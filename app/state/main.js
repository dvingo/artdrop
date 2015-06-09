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
// Init from Firebase.
////////////////////////////////////////////////////////////////////////////////

firebaseRef.once('value', data => {
  var allData = data.val();
  var designIds = Object.keys(allData.designs);
  designIds.map(hydrateDesignById.bind(null, allData))
           .forEach(d => reactor.dispatch('addDesign', d));

  var paletteIds = Object.keys(allData.colorPalettes);
  paletteIds.map(id => idsToObjs(id, allData.colorPalettes))
            .forEach(c => reactor.dispatch('addColorPalette', c));
});

////////////////////////////////////////////////////////////////////////////////
// Stores.
////////////////////////////////////////////////////////////////////////////////

var designsStore = new Nuclear.Store({

  getInitialState() {
    return Nuclear.toImmutable({});
  },

  initialize() {

   this.on('addDesign', function(state, design) {
     return state.set(design.id, Nuclear.Immutable.fromJS(design));
   });

   this.on('nextDesignColors', (state) => {
     var index = reactor.evaluate([module.exports.getters.currentDesignColorPaletteIndex]) || 0
     var allPalettesOne = reactor.evaluate([module.exports.getters.colorPalettes])
     var allPalettes = reactor.evaluate([['colorPalettes'], palettes => palettes.toList()])
     var currentDesign = reactor.evaluate([['currentDesignId'], ['designs'], (currentDesignId, designsMap) => {
        var currentDesign = designsMap.get(currentDesignId)
        console.log('ucrrent DESING XXX: ', currentDesign);
         return  currentDesign ;
     }])

     console.log('allPalettes: ', allPalettes)
     console.log('allPalettesONE: ', allPalettesOne)
     console.log('CURRENT DESIGN IN next colors: ', currentDesign)
     console.log('PALETTE INDEX in nextDesignColors: ', index)
     var newDesign = currentDesign.set('colorPalette', allPalettes.get(index + 1))
     return state.set(newDesign.get('id'), newDesign)
   })

 }
});

var currentDesignIdStore = new Nuclear.Store({

  getInitialState() {
    return ''
  },

  initialize() {

    this.on('selectDesignId', (state, designId) => {
      designsRef.child(designId).on('value', (design) => {
        design = design.val()
        design.id = designId
        hydrateDesign(design)
      })
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

reactor.registerStores({
  designs: designsStore,
  currentDesignId: currentDesignIdStore,
  colorPalettes: colorPalettesStore
});

////////////////////////////////////////////////////////////////////////////////
// Exports.
////////////////////////////////////////////////////////////////////////////////

module.exports = {

  // TODO try moving getters into their own object above.
  getters: {
    designs: [['designs'], designsMap => designsMap.toList()],
    currentDesign: [
      ['currentDesignId'],
      ['designs'],
      (currentDesignId, designsMap) => {
        var currentDesign = designsMap.get(currentDesignId)
        console.log('CURRENT DESIGN IN GETTEr: ', currentDesign)
        return currentDesign
      }
    ],
    colorPalettes: [['colorPalettes'], palettes => palettes.toList()],
    currentDesignColorPaletteIndex: [
      module.exports.currentDesign,
      module.exports.colorPalettes,
      (currentDesign, palettes) => {
        return palettes.indexOf(currentDesign.getIn(['colorPalette', 'id']))
      }
    ]
  },

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
    if (o == null) return null
    o.id = k;
    return o;
  }
  return Array.isArray(ids) ? ids.map(setupObj)
                            : setupObj(ids);
}

var hydrateDesignById = (dataSrc, designId) => {
  var design = idsToObjs(designId, dataSrc.designs);
  var layers = idsToObjs(Object.keys(design.layers), dataSrc.layers).map(l => {
    l.selectedLayerImage = idsToObjs(l.selectedLayerImage, dataSrc.layerImages);
    l.colorPalette = idsToObjs(l.colorPalette, dataSrc.colorPalettes)
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
