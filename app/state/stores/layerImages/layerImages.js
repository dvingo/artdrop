import Nuclear from 'nuclear-js'
import Immutable from 'Immutable'
import reactor from 'state/reactor'
import getters from 'state/getters'
import {numTagsInCommon} from 'state/utils'
import {hydrateAndDispatchLayerImages} from 'state/helpers'

var recomputeLayersLayerImages = () => {
  var currentDesign = reactor.evaluate(getters.currentDesign)
  if (currentDesign == null || (typeof currentDesign.getIn(['layers', 0]) === 'string')) {
    setTimeout(() => recomputeLayersLayerImages(), 50)
    return
  }
  var allLayerImages = reactor.evaluate(getters.layerImagesUnsorted)
  if (allLayerImages.count() === 3) {
    setTimeout(() => recomputeLayersLayerImages(), 50)
    return
  }
  var updatedLayers = currentDesign.get('layers').map(layer => {
    var orderedLayerImages = allLayerImages.sort((li1, li2) => {
      return numTagsInCommon(layer, li2) - numTagsInCommon(layer, li1)
    })
    var selectedLayerImageId = layer.getIn(['selectedLayerImage', 'id'])
    var index = orderedLayerImages.findIndex(li => li.get('id') === selectedLayerImageId)
    return (layer.set('orderedLayerImages', orderedLayerImages)
                 .set('selectedLayerImageIndex', index))
  })
  reactor.dispatch('setDesignImm', currentDesign.set('layers', updatedLayers))
}

export default new Nuclear.Store({
  getInitialState() { return Nuclear.toImmutable({}) },

  initialize() {
    this.on('setLayerImage', (state, layerImage) => {
      return state.set(layerImage.id, Immutable.fromJS(layerImage))
    })

    this.on('addManyLayerImages', (state, layerImages) => {
      setTimeout(() => recomputeLayersLayerImages(), 50)
      return layerImages.reduce((retVal, layerImage) => (
        retVal.set(layerImage.id, Immutable.fromJS(layerImage))), state)
    })

    this.on('setManyImmLayerImages', (state, layerImages) => (
      layerImages.reduce((retVal, layerImage) => (
        retVal.set(layerImage.get('id'), layerImage)), state)))

    this.on('removeLayerImage', (state, layerImageId) => (
      state.delete(layerImageId)))

    this.on('loadCurrentDesignEditResources', state => {
      hydrateAndDispatchLayerImages()
      return state
    }),

    this.on('loadAdminLayerImages', state => {
      hydrateAndDispatchLayerImages()
      return state
    })

    this.on('loadAdminCreateDesignData', state => {
      hydrateAndDispatchLayerImages()
      return state
    })
  }
})
