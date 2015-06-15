import firebaseRefs from './firebaseRefs'
var RSVP = require('RSVP')
var exports = {}
var idsToObjs = (ids, dataSrc) => {
  var setupObj = (k) => {
    var o = dataSrc[k];
    o.id = k;
    return o;
  }
  return Array.isArray(ids) ? ids.map(setupObj)
                            : setupObj(ids);
}

exports.hydrateDesignById = (dataSrc, designId) => {
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

exports.hydrateDesign = (design) => {
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

var hydrateLayer = hydrateObj.bind(null, firebaseRefs.layersRef)
var hydrateLayerImage = hydrateObj.bind(null, firebaseRefs.layerImagesRef)
var hydrateColorPalette = hydrateObj.bind(null, firebaseRefs.colorPalettesRef)
exports.hydrateLayer = hydrateLayer
exports.hydrateLayerImage = hydrateLayerImage
exports.hydrateColorPalette = hydrateColorPalette
exports.hydrateObj = hydrateObj
exports.idsToObjs = idsToObjs
export default exports
