import React from 'react'
import reactor from '../../state/reactor'
import {imageUrlForSurface} from '../../state/utils'

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
    var style = (
      this.props.surface.get('id') === this.props.currentSurface.get('id') ?
      {border: '3px solid'} : null)
    return (
      <div className="surface-image" onClick={this.props.onClick}>
        <img src={imageUrlForSurface(this.props.surface)} width={width} height={height} style={style}/>
      </div>
    )
  }
})
