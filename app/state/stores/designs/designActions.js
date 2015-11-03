import reactor from 'state/reactor'
import getters from 'state/getters'
import {persistLayer, updateLayerOfDesign,
  dispatchHelper, updateCurrentLayerOfDesign} from 'state/helpers'
import {rotateColorPalette} from 'state/utils'

export default {

  nextLayerImage(direction) {
    var currentDesign = reactor.evaluate(getters.currentDesign)
    var currentLayer = reactor.evaluate(getters.currentLayer)
    var images = (currentLayer.get('orderedLayerImages') != null
        ? currentLayer.get('orderedLayerImages')
        : reactor.evaluate(getters.layerImagesForCurrentLayer))
    var currentIndex = (currentLayer.get('selectedLayerImageIndex') != null
        ? currentLayer.get('selectedLayerImageIndex')
        : images.findIndex(i => i.get('id') === currentLayer.getIn(['selectedLayerImage', 'id'])))
    var nextIndex = (currentIndex + direction < 0
        ? images.count() - 1
        : (currentIndex + direction) % images.count())
    var layerImage = images.get(nextIndex)
    var newDesign = updateCurrentLayerOfDesign(l => (
      l.set('selectedLayerImage', layerImage)
       .set('selectedLayerImageIndex', nextIndex)))
    persistLayer(currentLayer.get('id'), {'selectedLayerImage': layerImage.get('id')})
    reactor.dispatch('setDesignImm', newDesign)
  },

  // TODO when selecting a layer image need to update the cached values.
  // The selected layer image should also always be in the currently visible options.
  // To do this set the slice index from the currently selected layer image's index

  selectLayerImage(layerImage) {
    var currentDesign = reactor.evaluate(getters.currentDesign)
    var currentLayer = reactor.evaluate(getters.currentLayer)
    var newDesign = updateLayerOfDesign(currentLayer, currentDesign, l => l.set('selectedLayerImage', layerImage))
    persistLayer(currentLayer.get('id'), {'selectedLayerImage': layerImage.get('id')})
    reactor.dispatch('setDesignImm', newDesign)
  },

  selectColorPalette(colorPalette) {
    var currentLayer = reactor.evaluate(getters.currentLayer)
    var newDesign = updateCurrentLayerOfDesign(l => (
      l.set('colorPalette', colorPalette)
       .set('paletteRotation', 0)))
    persistLayer(currentLayer.get('id'), {'colorPalette': colorPalette.get('id')})
    reactor.dispatch('setDesignImm', newDesign)
  },

  setLayerOfCurrentDesign(layer) {
    var currentDesign = reactor.evaluate(getters.currentDesign)
    var newDesign = updateLayerOfDesign(layer, currentDesign, l => layer)
    dispatchHelper('setDesignImm', newDesign)
  },

  rotateCurrentLayerColorPalette() {
    var currentDesign = reactor.evaluate(getters.currentDesign)
    var currentLayer = reactor.evaluate(getters.currentLayer)
    var newDesign = rotateColorPalette(currentDesign, currentLayer)
    var i = newDesign.get('layers').findIndex(l => l.get('id') === currentLayer.get('id'))
    var newRotation = newDesign.getIn(['layers', i, 'paletteRotation'])
    persistLayer(currentLayer.get('id'), {'paletteRotation': newRotation})
    reactor.dispatch('setDesignImm', newDesign)
  },

  toggleCurrentLayer() {
    var newDesign = updateCurrentLayerOfDesign(l => {
      var newIsEnabled = !l.get('isEnabled')
      persistLayer(l.get('id'), {'isEnabled': newIsEnabled})
      return l.set('isEnabled', newIsEnabled)
    })
    reactor.dispatch('setDesignImm', newDesign)
  }

}
