import React from 'react'
import Store from '../../../state/main'
import reactor from '../../../state/reactor'
import {iconPath} from '../../../utils'
import {Link} from 'react-router'
import Router from 'react-router'
var classNames = require('classnames')

export default React.createClass({
  mixins: [Router.Navigation, reactor.ReactMixin],

  getDataBindings() {
    return {design: Store.getters.currentDesign}
  },

  selectLayer(layerId) {
    Store.actions.selectLayerId(layerId)
    this.transitionTo('layerEdit', {designId: this.state.design.get('id'), layerId: layerId,
                                    imagesOrColors: 'images'})
  },

  editSurface() {
    this.transitionTo('designEdit', {designId:this.state.design.get('id'), step:'surface'})
  },

  render() {
    var editLayers = this.state.design.get('layers').map(layer => {
      return (
        <li onClick={this.selectLayer.bind(null, layer.get('id'))}>
          <img src={iconPath("eyeball.svg")} height="40" width="40"/>
          <span>Edit Layer {layer.get('order')}</span>
        </li>
      )
    })
    return (
      <section className={classNames("choose-layer", {visible: this.props.isActive})}>
        <ol>
          {editLayers}
          <li className="surface">
            <img src="" height="40" width="40"/>
            <span onClick={this.editSurface}>Choose a Surface</span>
          </li>
        </ol>
      </section>
    )
  }
})

