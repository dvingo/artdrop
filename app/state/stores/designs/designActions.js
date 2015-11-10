import reactor from 'state/reactor'
import getters from 'state/getters'
import actions from 'state/actions'
import Immutable from 'Immutable'
import {persistLayer, updateLayerOfDesign,
  dispatchHelper, updateCurrentLayerOfDesign,
  defaultSurfaceOptionIdForSurface,
  idListToFirebaseObj,
  persistNewLayerJs, persistDesign
} from 'state/helpers'
import {designsRef} from 'state/firebaseRefs'
import {uploadDesignPreview, rotateColorPalette} from 'state/utils'

export default {

  createNewDesign(newDesignData) {
    var { design:newDesign, svgEls, layersToTagsMap } = newDesignData
    var title = newDesign.get('title')
    uploadDesignPreview(title, svgEls, (err, imgUrls) => {
      if (err) { console.log('got error: ', err); return }

      var now = new Date().getTime()
      var design = newDesign.toJS()
      var layerIds = design.layers.map((layer, i) => {
        delete layer.id
        layer.order = i
        layer.colorPalette = layer.colorPalette.id
        layer.selectedLayerImage = layer.selectedLayerImage.id
        layer.createdAt = now
        layer.updatedAt = now
        layer.layerImages = reactor.evaluate(getters.layerImageIds).toJS()
        return persistNewLayerJs(layer)
      })

      design.smallImageUrl = imgUrls.small
      design.largeImageUrl = imgUrls.large
      design.layers = layerIds
      design.surfaceOption = defaultSurfaceOptionIdForSurface(design.surface)
      design.surface = design.surface.id
      design.price = 2000
      design.createdAt = now
      design.updatedAt = now
      var newDesignRef = designsRef.push(design)
      design.id = newDesignRef.key()
      reactor.dispatch('addDesign', design)
      var designImm = Immutable.fromJS(design)

      layersToTagsMap.forEach((tagSet, layerIndex) => {
        var layers = newDesign.get('layers').map((l, i) => l.set('id', layerIds[i]))
        var layer = layers.get(layerIndex)
        var designImm = newDesign.set('layers', layers)
        tagSet.forEach(tag => actions.addTagToLayer(tag, layer, designImm))
      })
    })
  },

  updateDesign(designData) {
    var updatedDesign = designData.design
    var svgEls = designData.svgEls
    var title = updatedDesign.get('title')
    // TODO should only upload the design image
    // if the color palettes or layerImages have changed for any layer.
    uploadDesignPreview(title, svgEls, (err, imgUrls) => {
      if (err) {
        console.log('got error: ', err)
        return
      }
      var now = new Date().getTime()
      var design = updatedDesign.toJS()
      var layerIds = design.layers.map((layer, i) => {
        var id = layer.id
        delete layer.id
        layer.order = i
        layer.colorPalette = layer.colorPalette.id
        layer.selectedLayerImage = layer.selectedLayerImage.id
        layer.updatedAt = now
        if (layer.hasOwnProperty('tags')) {
          layer.tags = idListToFirebaseObj(layer.tags.map(t => t.id))
        }
        persistLayer(id, layer)
        return id
      })
      var id = design.id
      delete design.id
      design.smallImageUrl = imgUrls.small
      design.largeImageUrl = imgUrls.large
      design.layers = layerIds
      design.surface = design.surface.id
      design.surfaceOption = design.surfaceOption.id
      design.price = 2000
      design.updatedAt = now
      persistDesign(id, design)
      design.id = id
      reactor.dispatch('setDesignImm', updatedDesign)
    })
  },

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
    var numEnabledLayers = reactor.evaluate(getters.numEnabledLayers)
    var currentLayer = reactor.evaluate(getters.currentLayer)
    // Don't allow disabling all layers.
    if (numEnabledLayers === 1 && currentLayer.get('isEnabled')) { return }
    var newDesign = updateCurrentLayerOfDesign(l => {
      var newIsEnabled = !l.get('isEnabled')
      persistLayer(l.get('id'), {'isEnabled': newIsEnabled})
      return l.set('isEnabled', newIsEnabled)
    })
    reactor.dispatch('setDesignImm', newDesign)
  }

}
