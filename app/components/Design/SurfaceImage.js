import React from 'react'
import reactor from '../../state/reactor'
import {imageUrlForSurface} from '../../state/utils'

export default React.createClass({

  shouldComponentUpdate(nextProps, nextState) {
    // TODO only update if previous currentSurface equal the props.surface
    // or currentSurface equals props.surface and previous currentSurface != previous surface
    // basically only if it used to be highlighted and now shouldn't be or if it should be and isn't already
    if (nextProps !== this.props) {
      return true
    }
    return false
  },

  render() {
    console.log('rendering imag')
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
