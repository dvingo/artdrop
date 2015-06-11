import fixtures from '../fixtures';
import reactor from './reactor';
var Nuclear = require('nuclear-js');
var RSVP = require('RSVP');
var fireBaseUri = "https://glaring-fire-8101.firebaseio.com";
var firebaseRef      = new Firebase(fireBaseUri);
var designsRef       = new Firebase(fireBaseUri + "/designs");
var layersRef        = new Firebase(fireBaseUri + "/layers");
var layerImagesRef   = new Firebase(fireBaseUri + "/layerImages");
var surfacesRef      = new Firebase(fireBaseUri + "/surfaces");
var colorPalettesRef = new Firebase(fireBaseUri + "/colorPalettes");

////////////////////////////////////////////////////////////////////////////////
// Stores.
////////////////////////////////////////////////////////////////////////////////

var designsStore = new Nuclear.Store({

  getInitialState() {
    return Nuclear.toImmutable({});
  },

  initialize() {
   this.on('addDesign', function(state, design) {
     if (!state.has(design.id)) {
       return state.set(design.id, Nuclear.Immutable.fromJS(design));
     }
     return state
   });

   this.on('nextDesignColors', (state) => {
     var allPalettes = reactor.evaluate(getters.colorPalettes)
     var currentDesign = reactor.evaluate(getters.currentDesign)
     var layers = currentDesign.get('layers').map(layer => {
       var index = allPalettes.findIndex(c => c.get('id') === layer.getIn(['colorPalette', 'id']))
       var newPalette = allPalettes.get((index + 1) % allPalettes.count())
       return layer.set('colorPalette', newPalette)
     })
     var newDesign = currentDesign.set('layers', layers)
     return state.set(newDesign.get('id'), newDesign)
   })
 }
})

var currentDesignIdStore = new Nuclear.Store({
  getInitialState() { return '' },

  initialize() {
    this.on('selectDesignId', (state, designId) => {
      var designs = reactor.evaluate(getters.designs)
      if (!designs.has(designId)) {
        designsRef.child(designId).on('value', (design) => {
          design = design.val()
          design.id = designId
          hydrateDesign(design)
        })
      }
      return designId
    })
  }
})

var colorPalettesStore = new Nuclear.Store({
  getInitialState() {
    return Nuclear.toImmutable({});
  },

  initialize() {
   this.on('addColorPalette', function(state, colorPalette) {
     return state.set(colorPalette.id, Nuclear.Immutable.fromJS(colorPalette));
   })
 }
})

var layerImagesStore = new Nuclear.Store({
  getInitialState() {
    return Nuclear.toImmutable({});
  },

  initialize() {
   this.on('addLayerImage', function(state, layerImage) {
     return state.set(layerImage.id, Nuclear.Immutable.fromJS(layerImage));
   })
 }
})

reactor.registerStores({
  designs: designsStore,
  currentDesignId: currentDesignIdStore,
  colorPalettes: colorPalettesStore,
  layerImages: layerImagesStore
})

////////////////////////////////////////////////////////////////////////////////
// Exports.
////////////////////////////////////////////////////////////////////////////////

var getters = {}
getters.designs = [['designs'], designsMap => designsMap.toList()]
getters.currentDesign = [
  ['currentDesignId'],
  ['designs'],
  (currentDesignId, designsMap) => designsMap.get(currentDesignId)
]
getters.colorPalettes = [['colorPalettes'], palettes => palettes.toList()]

module.exports = {
  getters: getters,
  actions: {
    selectDesignId(id) { reactor.dispatch('selectDesignId', id); },
    nextDesignColors() { reactor.dispatch('nextDesignColors'); }
  }
}

////////////////////////////////////////////////////////////////////////////////
// Helpers.
////////////////////////////////////////////////////////////////////////////////

var idsToObjs = (ids, dataSrc) => {
  var setupObj = (k) => {
    var o = dataSrc[k];
    o.id = k;
    return o;
  }
  return Array.isArray(ids) ? ids.map(setupObj)
                            : setupObj(ids);
}

var hydrateDesignById = (dataSrc, designId) => {
  var design = idsToObjs(designId, dataSrc.designs);
  var colorPaletteIds = Object.keys(dataSrc.colorPalettes)
  var layers = idsToObjs(Object.keys(design.layers), dataSrc.layers).map(l => {
    l.selectedLayerImage = idsToObjs(l.selectedLayerImage, dataSrc.layerImages);
    if (l.colorPalette == null) {
      var i = Math.floor(Math.random() * Object.keys(dataSrc.colorPalettes).length)
      l.colorPalette = idsToObjs(colorPaletteIds[i], dataSrc.colorPalettes)
    } else {
      l.colorPalette = idsToObjs(l.colorPalette, dataSrc.colorPalettes)
    }
    return l;
  });
  design.layers = layers;
  return design;
}

var hydrateDesign = (design) => {
  var layers = Object.keys(design.layers).map(layerId => {
    return hydrateLayer(layerId).then(layer => {
      return hydrateLayerImage(layer.selectedLayerImage).then(layerImage => {
        layer.selectedLayerImage = layerImage
        return hydrateColorPalette(layer.colorPalette).then(colorPalette => {
          layer.colorPalette = colorPalette
          return layer
        })
      })
    })
  })
  RSVP.all(layers).then(layers => {
    design.layers = layers;
    reactor.dispatch('addDesign', design)
  })
}

var hydrateObj = (ref, id) => {
  return new RSVP.Promise(resolve => {
    ref.child(id).on('value', o => resolve(o.val()))
  })
}

var hydrateLayer = hydrateObj.bind(null, layersRef)
var hydrateLayerImage = hydrateObj.bind(null, layerImagesRef)
var hydrateColorPalette = hydrateObj.bind(null, colorPalettesRef)

////////////////////////////////////////////////////////////////////////////////
// Init from Firebase.
////////////////////////////////////////////////////////////////////////////////

// TODO data retrieval should be lazy, as this strategy won't scale.
// On boot, select all "home screen designs, and pull all of their data."
firebaseRef.once('value', data => {
  var allData = data.val();
  var designIds = Object.keys(allData.designs);
  designIds.map(hydrateDesignById.bind(null, allData))
           .forEach(d => reactor.dispatch('addDesign', d))

  Object.keys(allData.colorPalettes)
    .map(id => idsToObjs(id, allData.colorPalettes))
    .forEach(c => reactor.dispatch('addColorPalette', c))

  Object.keys(allData.layerImages)
    .map(id => idsToObjs(id, allData.layerImages))
    .forEach(li => reactor.dispatch('addLayerImage', li))
})
