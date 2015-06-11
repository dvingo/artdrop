import React from 'react'
import State from '../../../state/main'
import {iconPath} from '../../../utils'
import {Link} from 'react-router'
var classNames = require('classnames')

export default React.createClass({

  render() {
    var editLayers = this.props.design.get('layers').map(layer => {
      return (
          <li>
            { /* TODO change back to onClick to make event handling easier.
                 and we'll need to set the current layer in the store anyway. */ }
            <Link to="layerEdit" params={{designId: this.props.design.get('id'), layerId: layer.get('id')}}>
              <img src={iconPath("eyeball.svg")} height="40" width="40"/>
              <span>Edit Layer {layer.order}</span>
            </Link>
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

