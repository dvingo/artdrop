import fixtures from '../fixtures';
import reactor from './reactor';
var Nuclear = require('nuclear-js');
var RSVP = require('RSVP');
var allData = null;

var fireBaseUri = "https://glaring-fire-8101.firebaseio.com";
var firebaseRef = new Firebase(fireBaseUri);
var designsRef = new Firebase(fireBaseUri+"/designs");
var layersRef = new Firebase(fireBaseUri+"/layers");
var layerImagesRef = new Firebase(fireBaseUri+"/layerImages");
var surfacesRef = new Firebase(fireBaseUri+"/surfaces");
var colorPalettesRef = new Firebase(fireBaseUri+"/colorPalettes");

////////////////////////////////////////////////////////////////////////////////
// Init from Firebase.
////////////////////////////////////////////////////////////////////////////////

firebaseRef.once('value', data => {
  allData = data.val();
  var designIds = Object.keys(allData.designs);
  designIds.map(hydrateDesignById.bind(null, allData))
           .forEach(d => reactor.dispatch('addDesign', d));
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
 }
});

var currentDesignIdStore = new Nuclear.Store({
  getInitialState() {
    return '';
  },
  initialize() {
    this.on('selectDesignId', function(state, designId) {
      designsRef.child(designId).on('value', (design) => {
        design = design.val()
        design.id = designId
        console.log('selecting design: ', design);
        hydrateDesign(design)
      })
      return designId;
    });
  }
});

reactor.registerStores({
  designs: designsStore,
  currentDesignId: currentDesignIdStore
});

////////////////////////////////////////////////////////////////////////////////
// Exports.
////////////////////////////////////////////////////////////////////////////////

module.exports = {

  getters: {
    designs: [['designs'], designsMap => designsMap.toList()],
    currentDesign: [
      ['currentDesignId'],
      ['designs'],
      (currentDesignId, designsMap) => {
        return designsMap.get(currentDesignId)
      }
    ]
  },

  actions: {
    selectDesignId(id) { reactor.dispatch('selectDesignId', id); },
    nextColor() { reactor.dispatch('nextColor'); }
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
    console.log('hydrating layers: ', layers)
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
