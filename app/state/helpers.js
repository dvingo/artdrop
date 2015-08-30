import {layersRef, layerImagesRef,
colorPalettesRef,surfacesRef,
surfaceOptionsRef, tagsRef} from './firebaseRefs'
import reactor from './reactor'
var RSVP = require('RSVP')

var exports = {}

exports.defaultSurfaceOptionIdForSurface = (surfaceObj) => {
  if (Array.isArray(surfaceObj.options)) {
    return surfaceObj.options[0].id
  }
  return Object.keys(surfaceObj.options)[0]
}

exports.designPropsToIds = (design) => {
  var layerIds = design.get('layers').map(l => l.get('id'))
  var surfaceId = design.get('surface') ? design.getIn(['surface', 'id']) : null
  var surfaceOptionId = design.get('surfaceOption') ? design.getIn(['surfaceOption', 'id']) : null
  return surfaceId ? design.withMutations(d => {
   return d.set('layers', layerIds).set('surface', surfaceId).set('surfaceOption', surfaceOptionId)
  })
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
  return RSVP.all(layers).then(layers => {
    design.layers = layers;
    return hydrateSurface(design.surface)
  }).then(surface => {
    return RSVP.all(Object.keys(surface.options).map(optionId => {
      return hydrateSurfaceOption(optionId).then(surfaceOption => {
        surfaceOption.id = optionId
        return surfaceOption
      })
    })).then(surfaceOptions => {
      surface.id = design.surface
      surface.options = surfaceOptions
      design.surface = surface
      design.surfaceOption = surface.options.filter(o => o.id === design.surfaceOption)[0]
      reactor.dispatch('addSurface', surface)
      reactor.dispatch('addDesign', design)
    }).catch(e => console.error('Got surface error: ', e))
  }).catch(e => console.error("Got Error: ", e))
}

exports.hydrateSurfaceOptionsForSurface = (surface) => {
  return RSVP.all(Object.keys(surface.options).map(optionId => {
    return hydrateSurfaceOption(optionId).then(surfaceOption => {
      surfaceOption.id = optionId
      return surfaceOption
    })
  }))
}

var hydrateObj = (ref, id) => {
  return new RSVP.Promise(resolve => {
    ref.child(id).once('value', o => resolve(o.val()))
  })
}

var hydrateAndDispatchData = (dbRef, dispatchMsg, currentState) => {
  dbRef.once('value', snapshot => {
    var data = snapshot.val()
    var dataToDispatch = Object.keys(data).map(id => {
      var obj = data[id]
      obj.id = id
      return obj
    })
    reactor.dispatch(dispatchMsg, dataToDispatch)
  })
}

exports.hydrateAndDispatchLayerImages = hydrateAndDispatchData.bind(null, layerImagesRef, 'addManyLayerImages')
exports.hydrateAndDispatchSurfaces = hydrateAndDispatchData.bind(null, surfacesRef, 'addManySurfaces')
exports.hydrateAndDispatchTags = hydrateAndDispatchData.bind(null, tagsRef, 'addManyTags')
exports.hydrateAndDispatchColorPalettes = hydrateAndDispatchData.bind(null, colorPalettesRef, 'addManyColorPalettes')

var hydrateLayer = hydrateObj.bind(null, layersRef)
var hydrateLayerImage = hydrateObj.bind(null, layerImagesRef)
var hydrateColorPalette = hydrateObj.bind(null, colorPalettesRef)
var hydrateSurface = hydrateObj.bind(null, surfacesRef)
var hydrateSurfaceOption = hydrateObj.bind(null, surfaceOptionsRef)

exports.hydrateColorPalette = hydrateColorPalette
exports.hydrateSurface = hydrateSurface
exports.hydrateSurfaceOption = hydrateSurfaceOption
exports.hydrateObj = hydrateObj
export default exports
