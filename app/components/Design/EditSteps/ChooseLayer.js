import React from 'react'
import Store from '../../../state/main'
import {iconPath} from '../../../utils'
import {Link} from 'react-router'
import Router from 'react-router'
var classNames = require('classnames')

export default React.createClass({
  mixins: [Router.Navigation],

  selectLayer(layerId) {
    Store.actions.selectLayerId(layerId)
    this.transitionTo('layerEdit', {designId: this.props.design.get('id'), layerId: layerId})
  },

  render() {
    var editLayers = this.props.design.get('layers').map(layer => {
      return (
          <li onClick={this.selectLayer.bind(null, layer.get('id'))}>
            <img src={iconPath("eyeball.svg")} height="40" width="40"/>
            <span>Edit Layer {layer.order}</span>
          </li>
      )
    })
    return (
      <section className={classNames("choose-layer", {visible: this.props.isActive})}>
        <ol>
          {editLayers}
          <li className="surface">
            <img src="" height="40" width="40"/>
            <span>Choose a Surface</span>
          </li>
        </ol>
      </section>
    )
  }
})

