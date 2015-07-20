import React from 'react'
import Store from '../../../state/main'
import reactor from '../../../state/reactor'
import {imageUrlForLayerImage} from '../../../state/utils'
var classNames = require('classnames')

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {layerImageOptions: Store.getters.layerImageOptions}
  },

  componentWillMount() {
    if (this.props.layerId) {
      Store.actions.selectLayerId(this.props.layerId)}
  },

  selectLayerImage(layerImage) {
    Store.actions.selecteLayerImageId(layerImage.get('id'))
  },

  render() {
    if (this.state.layerImageOptions == null) return null
    var layerImages = this.state.layerImageOptions
        .filter(layerImage => layerImage)
        .map(layerImage => {
      return (
        <li onClick={this.selectLayerImage.bind(null, layerImage)}>
          <img src={imageUrlForLayerImage(layerImage)}/>
        </li>
      )
    })
    return (
      <section className={classNames('choose-art', {visible: this.props.isActive})}>
        <ul className="design-selection">
          {layerImages}
        </ul>
      </section>
    )
  }
})
