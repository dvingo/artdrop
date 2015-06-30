import React from 'react'
import SVGInlineLayer  from '../SVGInlineLayer'
export default React.createClass({
  render() {
    return (
      <div className="canvas">
        {this.props.layers.map(layer => <SVGInlineLayer layer={layer}/>)}
      </div>
    )
  }
})
