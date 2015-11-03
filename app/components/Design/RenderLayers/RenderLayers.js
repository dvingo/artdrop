import React from 'react'
import {imageUrlForLayer} from 'state/utils'
import SVGInlineLayer  from 'components/SVGInlineLayer/SVGInlineLayer'

export default React.createClass({

  render() {
    return (
      <div className="canvas-flex-wrapper">
        <span>
          <div className="canvas">
            {this.props.layers
                .filter(layer => layer.get('isEnabled'))
                .map(layer => (
                    <SVGInlineLayer imageUrl={imageUrlForLayer(layer)}
                                    layer={layer}
                                    key={layer.get('id')} />))
            }
          </div>
        </span>
      </div>
    )
  }

})
