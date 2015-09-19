import {designsRef, layersRef, layerImagesRef,
colorPalettesRef, surfacesRef,
surfaceOptionsRef, tagsRef} from 'state/firebaseRefs'
import reactor from 'state/reactor'
var Map = require('nuclear-js').Immutable.Map
var RSVP = require('RSVP')

var exports = {}

exports.nonOptionKeys = ['id', 'printingPrice', 'salePrice', 'units',
  'vendorId', 'height', 'width', 'depth']

function setSizeOnSurfaceOption(option) {
  var units = option.get('units')
  var height = option.get('height')
  var width = option.get('width')
  var depth = option.get('depth')
  if (!(height && width)) { return option }
  if (depth) {
    return option.set('size: height, width, depth', `${height} x ${width} x ${depth} ${units}`)
  }
  return option.set('size: height, width', `${height} x ${width} ${units}`)
}

exports.dispatchHelper = function() {
  var args = arguments
  var interval = setInterval(() => {
    if (!reactor.__isDispatching) {
      clearInterval(interval)
      reactor.dispatch.apply(reactor, args)
    }
  }, 100)
}

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

function nestedHydrateLayer(layerId) {
  return hydrateLayer(layerId).then(layer => {
    return hydrateLayerImage(layer.selectedLayerImage).then(layerImage => {
      layerImage.id = layer.selectedLayerImage
      reactor.dispatch('addLayerImage', layerImage)
      layer.selectedLayerImage = layerImage
      layer.id = layerId
      return hydrateColorPalette(layer.colorPalette).then(colorPalette => {
        colorPalette.id = layer.colorPalette
        layer.colorPalette = colorPalette
        reactor.dispatch('addColorPalette', colorPalette)
        return layer
      })
    })
  })
}

function hydrateSurfaceOption(surfaceOptionId) {
  return (
    hydrateObj(surfaceOptionsRef, surfaceOptionId)
    .then(surfaceOption => {
      surfaceOption.id = surfaceOptionId
      return setSizeOnSurfaceOption(Map(surfaceOption)).toJS()
    })
  )
}

exports.hydrateDesign = (design) => {
  var layers = design.layers.map(nestedHydrateLayer)
  return RSVP.all(layers).then(layers => {
    design.layers = layers;
    return hydrateSurface(design.surface)
  }).then(surface => {
    return (
      hydrateSurfaceOptionsForSurface(surface)
      .then(surfaceOptions => {
        surface.id = design.surface
        surface.options = surfaceOptions
        design.surface = surface
        design.surfaceOption = surface.options.filter(o => o.id === design.surfaceOption)[0]
        reactor.dispatch('addSurface', surface)
        reactor.dispatch('addDesign', design)
      })
    )
  }).catch(e => console.error("Got Error: ", e))
}

function hydrateSurfaceOptionsForSurface (surface) {
  return RSVP.all(Object.keys(surface.options).map(hydrateSurfaceOption))
}
exports.hydrateSurfaceOptionsForSurface = hydrateSurfaceOptionsForSurface

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

exports.hydrateColorPalette = hydrateColorPalette
exports.hydrateSurface = hydrateSurface
exports.hydrateObj = hydrateObj

var persistWithRef = (firebaseRef, id, obj) => {
  if (DEBUG) {
    console.log(`Saving to firebase ref ${firebaseRef} at id: ${id}.`)
  }
  firebaseRef.child(id).update(obj)
}
exports.persistWithRef = persistWithRef
exports.persistDesign = persistWithRef.bind(null, designsRef)
exports.persistLayer = persistWithRef.bind(null, layersRef)
exports.persistSurface = persistWithRef.bind(null, surfacesRef)
export default exports
