import {layersRef, layerImagesRef,
colorPalettesRef,surfacesRef} from './firebaseRefs'
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
  var surfaceId = design.get('surface') ? design.getIn(['surface', 'id']) : null
  return surfaceId ? design.withMutations(d => d.set('layers', layerIds).set('surface', surfaceId))
                   : design.set('layers', layerIds)
}

exports.hydrateDesign = (design) => {
  console.log('hydrating design: ', design)
  var layers = design.layers.map(layerId => {
    return hydrateLayer(layerId).then(layer => {
      return hydrateLayerImage(layer.selectedLayerImage).then(layerImage => {
        layerImage.id = layer.selectedLayerImage
        layer.selectedLayerImage = layerImage
        layer.id = layerId
        console.log('layer: ', layer)
        console.log('layer.colorPalette: ', layer.colorPalette)
        return hydrateColorPalette(layer.colorPalette).then(colorPalette => {
          console.log('hydrated color palette: ', colorPalette)
          colorPalette.id = layer.colorPalette
          layer.colorPalette = colorPalette
          reactor.dispatch('addColorPalette', colorPalette)
          reactor.dispatch('addLayerImage', layerImage)
          return layer
        })
      })
    })
  })
  return RSVP.all(layers).then(layers => {
    design.layers = layers;
    hydrateSurface(design.surface).then(surface => {
      surface.id = design.surface
      design.surface = surface
      reactor.dispatch('addSurface', surface)
      reactor.dispatch('addDesign', design)
    }).catch(e => console.error('Got surface error: ', e))
  }).catch(e => console.error("Got Error: ", e))
}

var hydrateObj = (ref, id) => {
  if (ref === colorPalettesRef) {
    console.log('hydrating color palette: ', id)
  }
  return new RSVP.Promise(resolve => {
    ref.child(id).on('value', o => {
      if (ref === colorPalettesRef) {
        console.log('Resolved colorPalette: ', o.val())
      }
      resolve(o.val())
    })
  })
}

var hydrateAndDispatchData = (dbRef, dispatchMsg, currentState) => {
  dbRef.once('value', snapshot => {
    var data = snapshot.val()
    Object.keys(data).map(id => {
      if (!currentState.has(id)) {
        var obj = data[id]
        obj.id = id
        reactor.dispatch(dispatchMsg, obj)
      }
    })
  })
}

exports.hydrateAndDispatchLayerImages = hydrateAndDispatchData.bind(null, layerImagesRef, 'addLayerImage')
exports.hydrateAndDispatchSurfaces = hydrateAndDispatchData.bind(null, surfacesRef, 'addSurface')
exports.hydrateAndDispatchColorPalettes = hydrateAndDispatchData.bind(null, colorPalettesRef, 'addColorPalette')

var hydrateLayer = hydrateObj.bind(null, layersRef)
var hydrateLayerImage = hydrateObj.bind(null, layerImagesRef)
var hydrateColorPalette = hydrateObj.bind(null, colorPalettesRef)
var hydrateSurface = hydrateObj.bind(null, surfacesRef)

exports.hydrateLayer = hydrateLayer
exports.hydrateLayerImage = hydrateLayerImage
exports.hydrateColorPalette = hydrateColorPalette
exports.hydrateSurface = hydrateSurface
exports.hydrateObj = hydrateObj
exports.idsToObjs = idsToObjs
export default exports
