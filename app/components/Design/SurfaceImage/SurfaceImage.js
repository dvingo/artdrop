import React from 'react'
import reactor from 'state/reactor'
import {imageUrlForSurface} from 'state/utils'

export default React.createClass({

  shouldComponentUpdate(nextProps) {
    var currentSurface = this.props.currentSurface.get('id')
    var nextCurrentSurface = nextProps.currentSurface.get('id')
    var surface = this.props.surface.get('id')
    var nextSurface = nextProps.surface.get('id')
    if ((nextCurrentSurface === nextSurface && currentSurface !== surface) ||
        (currentSurface === surface && nextCurrentSurface !== nextSurface)) {
      return true
    }
    return false
  },

  render() {
    var height = this.props.height || 100
    var width = this.props.width || 100
    var selectedSurface = this.props.currentSurface
    var surface = this.props.surface
    var overlayStyle = (
      selectedSurface.get('id') === surface.get('id') ?
      { position: 'absolute',
        background: '#27002B',
        opacity: 0.7,
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        borderRadius: 6 }
      : { display: 'none' })
    return (
      <div className="SurfaceImage" onClick={this.props.onClick}>
        <div style={overlayStyle}/>
        <img src={imageUrlForSurface(this.props.surface)} width={width} height={height}/>
      </div>
    )
  }
})
