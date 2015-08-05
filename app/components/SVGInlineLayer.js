import React from 'react'
import {imageUrlForLayer} from '../state/utils'
import {setSvgColors, replaceSvgImageWithText} from '../utils'

export default React.createClass({

  componentDidMount() {
    replaceSvgImageWithText(this.refs.container, this.refs.imgRef,
      this.props.layer.get('colorPalette'))
  },

  componentDidUpdate(prevProps, prevState) {
    var container = React.findDOMNode(this.refs.container)
    var svgEl = container.querySelector('svg')
    if (prevProps.layer.get('colorPalette') !== this.props.layer.get('colorPalette')) {
      setSvgColors(svgEl, this.props.layer.get('colorPalette'))
    } else if (prevProps.layer.get('selectedLayerImage') !== this.props.layer.get('selectedLayerImage')) {
      replaceSvgImageWithText(this.refs.container, this.refs.imgRef,
      this.props.layer.get('colorPalette'))
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps
  },

  render() {
    return (
      <div ref="container" className="layer">
        <img src={imageUrlForLayer(this.props.layer)}
             style={{display:'none'}}
             ref="imgRef"/>
      </div>
    )
  }
})
