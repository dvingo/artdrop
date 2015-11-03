import React from 'react'
import SVGInlineLayer from 'components/SVGInlineLayer/SVGInlineLayer'
import {imageUrlForLayerImage, imageUrlForLayer} from 'state/utils'
import reactor from 'state/reactor'
import actions from 'state/actions'
import getters from 'state/getters'
import {numTagsInCommon} from 'state/utils'
import {Map} from 'Immutable'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {
      currentLayersMap: getters.currentLayersMap,
      layerImages: getters.layerImagesUnsorted
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.layer.get('id') === reactor.evaluate(['currentLayerId']) ||
      this.props.layer.get('colorPalette') !== nextProps.layer.get('colorPalette')
    )
  },

  _getLayerImagesForLayer(layer) {
    if (layer.has('orderedLayerImages')) {
      return layer.get('orderedLayerImages')
    }
    var orderedLayerImages = this.state.layerImages.sort((li1, li2) => (
      numTagsInCommon(layer, li2) - numTagsInCommon(layer, li1)
    ))
    console.log('Num layer images in get layer images for layer: ', orderedLayerImages.count())
    var index = layer.get('selectedLayerImageIndex')
    if (index == null) {
      let selectedLayerImageId = this.props.layer.getIn(['selectedLayerImage', 'id'])
      index = orderedLayerImages.findIndex(li => li.get('id') === selectedLayerImageId)
    }
    var newLayer = layer.set('orderedLayerImages', orderedLayerImages)
                        .set('selectedLayerImageIndex', index)
    actions.setLayerOfCurrentDesign(newLayer)
    return orderedLayerImages
  },

  _getPreviousLayerImage() {
    var layer = this.props.layer
    var layerImages = this._getLayerImagesForLayer(layer)
    var index = layer.get('selectedLayerImageIndex')
    if (index == null) {
      let selectedLayerImageId = this.props.layer.getIn(['selectedLayerImage', 'id'])
      index = layerImages.findIndex(li => li.get('id') === selectedLayerImageId)
    }
    var previousIndex = ((index - 1 < 0) ? layerImages.count() - 1 : index - 1)
    return layerImages.get(previousIndex)
  },

  _getNextLayerImage() {
    var layer = this.props.layer
    var layerImages = this._getLayerImagesForLayer(layer)
    var index = layer.get('selectedLayerImageIndex')
    if (index == null) {
      let selectedLayerImageId = this.props.layer.getIn(['selectedLayerImage', 'id'])
      index = layerImages.findIndex(li => li.get('id') === selectedLayerImageId)
    }
    var nextIndex = (index + 1) % layerImages.count()
    return layerImages.get(nextIndex)
  },

  render() {
    var {layer} = this.props
    var previousLayerImage = this._getPreviousLayerImage()
    var nextLayerImage = this._getNextLayerImage()
    if (previousLayerImage == null || nextLayerImage == null) { return null }
    var xOffset = this.props.xOffset
    var style = {transform: `translate(${xOffset}px)`}
    return (
      <div className="LayerImageContainer">
        <div className="LayerImageMover" style={style}>
          <SVGInlineLayer imageUrl={imageUrlForLayerImage(previousLayerImage)}
                          layer={layer}
                          key={previousLayerImage.get('id') + '0'} />
          <SVGInlineLayer imageUrl={imageUrlForLayer(layer)}
                          layer={layer}
                          key={layer.get('id') + '1'} />
          <SVGInlineLayer imageUrl={imageUrlForLayerImage(nextLayerImage)}
                          layer={layer}
                          key={layer.get('id') + '2'} />
        </div>
      </div>
    )
  }
})
