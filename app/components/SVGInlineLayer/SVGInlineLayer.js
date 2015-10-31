import React from 'react'
import reactor from 'state/reactor'
import {imageUrlForLayer} from 'state/utils'
import {setSvgColors, replaceSvgImageWithText} from 'utils'

export default React.createClass({

  componentDidMount() {
    replaceSvgImageWithText(this.refs.container, this.refs.imgRef, this.props.layer)
  },

  componentDidUpdate(prevProps) {
    var container = React.findDOMNode(this.refs.container)
    var svgEl = container.querySelector('svg')
    if (prevProps.layer.get('colorPalette') !== this.props.layer.get('colorPalette') ||
        prevProps.layer.get('paletteRotation') !== this.props.layer.get('paletteRotation')) {
      setSvgColors(svgEl, this.props.layer)
    } else if (prevProps.layer.get('selectedLayerImage') !== this.props.layer.get('selectedLayerImage')) {
      replaceSvgImageWithText(this.refs.container, this.refs.imgRef, this.props.layer)
    }
  },

  shouldComponentUpdate(nextProps) {
    if (this.props.isAnimating) {
      let currentLayerId = reactor.evaluate(['currentLayerId'])
      return currentLayerId === this.props.layer.get('id') && this.props !== nextProps
    }
    return this.props !== nextProps
  },

  render() {
    return (
      <div ref="container" className="layer" style={this.props.style}>
        <img src={imageUrlForLayer(this.props.layer)}
             style={{display:'none'}}
             ref="imgRef"/>
      </div>
    )
  }
})
