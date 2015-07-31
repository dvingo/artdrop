import React from 'react'
import {imageUrlForLayer} from '../state/utils'
import {replaceSvgImageWithText} from '../utils'

export default React.createClass({
  componentDidMount() {
    replaceSvgImageWithText(this.refs.container, this.refs.imgRef,
      this.props.layer.get('colorPalette'))
  },

  componentDidUpdate() {
    replaceSvgImageWithText(this.refs.container, this.refs.imgRef,
      this.props.layer.get('colorPalette'))
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
