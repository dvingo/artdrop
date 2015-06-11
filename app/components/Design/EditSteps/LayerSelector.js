import React from 'react'
import {imageUrlForLayer, imageUrlForSurface} from '../../../state/utils'
var classNames = require('classnames')

export default React.createClass({
  render() {
    var step = this.props.step
    return (
        <article className="layer-selector-wrapper small">
          <div className="container">
            {this.props.design.get('layers').map(layer => {
              return <img src={imageUrlForLayer(layer)} width={40} height={40}/>
             })
            }
            <img src={null} width={40} height={40}/>
          </div>
        </article>
      )
  }
})
