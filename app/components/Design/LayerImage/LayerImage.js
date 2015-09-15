import React from 'react'
import Store from 'state/main'
import reactor from 'state/reactor'
import {imageUrlForLayerImage} from 'state/utils'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {currentLayerImage: Store.getters.currentLayerImage}
  },

  selectLayerImage() {
    var currentLayerImage = this.state.currentLayerImage
    var layerImage = this.props.layerImage
    if (currentLayerImage == null) {
      Store.actions.selectLayerImage(layerImage)
    } else if (!this.state.layerIsBeingReplaced &&
               (currentLayerImage.get('id') !== layerImage.get('id'))) {
      Store.actions.selectLayerImage(layerImage)
      Store.actions.layerReplacementStarted(layerImage)
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props || nextState !== this.state) {
      return true
    }
    return false
  },

  render() {
    var isSelected = this.state.currentLayerImage.get('id') === this.props.layerImage.get('id')
    var style = isSelected ? {border: '2px solid black'} : null

    return (
      <div className="layer-image" onClick={this.selectLayerImage} style={style}>
        <img src={imageUrlForLayerImage(this.props.layerImage)}/>
      </div>
    )
  }
})
