var RSVP = require('rsvp')
var firebaseRefs = require('./firebase_refs')
var layersRef = firebaseRefs.layersRef
var layerImagesRef = firebaseRefs.layerImagesRef
var colorPalettesRef = firebaseRefs.colorPalettesRef
var surfaceOptionsRef = firebaseRefs.surfaceOptionsRef
var surfacesRef = firebaseRefs.surfacesRef
function hydrateObj(ref, id) {
  return new RSVP.Promise(function(resolve) {
    ref.child(id).once('value', function(o) { resolve(o.val()) })
  })
}

var hydrateLayer = hydrateObj.bind(null, layersRef)
var hydrateLayerImage = hydrateObj.bind(null, layerImagesRef)
var hydrateColorPalette = hydrateObj.bind(null, colorPalettesRef)
var hydrateSurface = hydrateObj.bind(null, surfacesRef)

function hydrateSurfaceOption(surfaceOptionId) {
  return (
    hydrateObj(surfaceOptionsRef, surfaceOptionId)
    .then(function(surfaceOption) {
      surfaceOption.id = surfaceOptionId
      return surfaceOption
    })
  )
}

function hydrateSurfaceOptionsForSurface (surface) {
  return RSVP.all(Object.keys(surface.options).map(hydrateSurfaceOption))
}

function hydrateDesign(design) {
  var layers = design.layers.map(nestedHydrateLayer)
  return RSVP.all(layers).then(function(layers) {
    design.layers = layers;
    return hydrateSurface(design.surface)
  }).then(function(surface) {
    return (
      hydrateSurfaceOptionsForSurface(surface)
      .then(function(surfaceOptions) {
        surface.id = design.surface
        surface.options = surfaceOptions
        design.surface = surface
        design.surfaceOption = surface.options.filter(function(o) {
          o.id === design.surfaceOption
        })[0]
        return design
      })
    )
  }).catch(function(e) {
    console.error("Got Error: ", e)
  })
}

function nestedHydrateLayer(layerId) {
  return hydrateLayer(layerId).then(function(layer) {
    return hydrateLayerImage(layer.selectedLayerImage).then(function(layerImage) {
      layerImage.id = layer.selectedLayerImage
      layer.selectedLayerImage = layerImage
      layer.id = layerId
      return hydrateColorPalette(layer.colorPalette).then(function(colorPalette) {
        colorPalette.id = layer.colorPalette
        layer.colorPalette = colorPalette
        return layer
      })
    })
  })
}

module.exports = {
  hydrateObj: hydrateObj,
  hydrateSurfaceOption: hydrateSurfaceOption,
  nestedHydrateLayer: nestedHydrateLayer,
  hydrateLayer: hydrateLayer,
  hydrateLayerImage: hydrateLayerImage,
  hydrateColorPalette: hydrateColorPalette,
  hydrateSurface: hydrateSurface,
  hydrateDesign: hydrateDesign
}
