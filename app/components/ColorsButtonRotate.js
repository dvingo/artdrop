import React from 'react'
import {iconPath} from '../utils'
import reactor from '../state/reactor'
import Store from '../state/main'
import {setSvgColors, replaceSvgImageWithText} from '../utils'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {currentLayer: Store.getters.currentLayer}
  },

  componentDidMount() {
    this._interval = setInterval(() => {
      if (this.props.layer) {
        clearInterval(this._interval)
        replaceSvgImageWithText(this.refs.container, this.refs.imgRef, this.props.layer)
      } else if (this.state.currentLayer) {
        clearInterval(this._interval)
        replaceSvgImageWithText(this.refs.container, this.refs.imgRef, this.state.currentLayer)
      }
    }, 50)
  },

  componentWillUnmount() {
    if (this._interval) {
      clearInterval(this._interval)
    }
  },

  componentDidUpdate(prevProps, prevState) {
    var container = React.findDOMNode(this.refs.container)
    var svgEl = container.querySelector('svg')
    if (svgEl) {
      if (this.props.layer) {
        setSvgColors(svgEl, this.props.layer)
      } else {
        setSvgColors(svgEl, this.state.currentLayer)
      }
    }
  },

  rotateColors(e) {
    e.preventDefault()
    if (this.props.onClick) {
      this.props.onClick()
    } else {
      Store.actions.rotateCurrentLayerColorPalette()
    }
  },

  render() {
    return (
      <span ref="container" style={{width: 60}} onClick={this.rotateColors}>
        <img style={{display:'none'}} src={iconPath('shuffle.svg')} ref="imgRef"/>
      </span>
    )
  }
});
