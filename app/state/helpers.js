import firebaseRefs from './firebaseRefs'
import reactor from './reactor'
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

exports.designPropsToIds = (design) => {
  var layerIds = design.get('layers').map(l => l.get('id'))
  var surfaceId = (_ => {
    design.get('surface') ? design.getIn(['surface', 'id']) : null
  }())
  return surfaceId ? design.withMutations(d => d.set('layers', layerIds).set('surface', surfaceId))
                   : design.set('layers', layerIds)
}

exports.hydrateDesign = (design) => {
  var layers = design.layers.map(layerId => {
    return hydrateLayer(layerId).then(layer => {
      return hydrateLayerImage(layer.selectedLayerImage).then(layerImage => {
        layerImage.id = layer.selectedLayerImage
        layer.selectedLayerImage = layerImage
        layer.id = layerId
        return hydrateColorPalette(layer.colorPalette).then(colorPalette => {
          colorPalette.id = layer.colorPalette
          layer.colorPalette = colorPalette
          reactor.dispatch('addColorPalette', colorPalette)
          reactor.dispatch('addLayerImage', layerImage)
          return layer
        })
      })
    })
  })
  RSVP.all(layers).then(layers => {
    design.layers = layers;
    hydrateSurface(design.surface).then(surface => {
      surface.id = design.surface
      design.surface = surface
      reactor.dispatch('addSurface', surface)
      reactor.dispatch('addDesign', design)
    })
  }).catch(e => console.error("Got Error: ", e))
}

var hydrateObj = (ref, id) => {
  return new RSVP.Promise(resolve => {
    ref.child(id).on('value', o => resolve(o.val()))
  })
}

var hydrateLayer = hydrateObj.bind(null, firebaseRefs.layersRef)
var hydrateLayerImage = hydrateObj.bind(null, firebaseRefs.layerImagesRef)
var hydrateColorPalette = hydrateObj.bind(null, firebaseRefs.colorPalettesRef)
var hydrateSurface = hydrateObj.bind(null, firebaseRefs.surfacesRef)
exports.hydrateLayer = hydrateLayer
exports.hydrateLayerImage = hydrateLayerImage
exports.hydrateColorPalette = hydrateColorPalette
exports.hydrateObj = hydrateObj
exports.idsToObjs = idsToObjs
export default exports
