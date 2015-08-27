import React from 'react'
import SVGInlineLayer  from '../SVGInlineLayer'
export default React.createClass({
  render() {
    return (
      <div className="canvas">
        {this.props.layers
        	.filter(layer => layer.get('isEnabled'))
        	.map(layer => <SVGInlineLayer layer={layer} key={layer.get('id')}/>)}
      </div>
    )
  }
})
