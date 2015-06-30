import React from 'react'
import SVGInlineLayer  from '../SVGInlineLayer'
export default React.createClass({
  render() {
    let layerImages = this.props.layers.map(
      layer => {
        return (
          <div className="layer" key={layer.get('id')}>
            <SVGInlineLayer layer={layer} width={this.props.width}
                                          height={this.props.height}/>
          </div>
        )
      })
    return (
      <div className="canvas">
        {layerImages}
      </div>
    )
  }
})
