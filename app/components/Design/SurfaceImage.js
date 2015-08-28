import React from 'react'
import Store from '../../state/main'
import reactor from '../../state/reactor'
import {imageUrlForSurface} from '../../state/utils'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  selectSurfaceImage() {
    var styles = [
      'background: red'
    ].join(';')
    console.log("%c Surface Image Selected", styles)
  },

  render() {
    return (
      <div className="surface-image">
        <img src={imageUrlForSurface(this.props.surface)} width={100} height={100}/>
      </div>
    )
  }
})
