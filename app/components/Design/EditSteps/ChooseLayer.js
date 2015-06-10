import React from 'react'
import State from '../../../state/main'
import {iconPath} from '../../../utils'
var classNames = require('classnames')

export default React.createClass({

  chooseLayer(layer) {
    console.log('chose layer: ', layer.toJS())
  },

  render() {
    var editLayers = this.props.design.get('layers').map(layer => {
      return (
        <li onClick={this.chooseLayer.bind(null, layer)}>
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

