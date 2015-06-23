import React from 'react'
import Router from 'react-router'
import reactor from '../../state/reactor'
import Store from '../../state/main'
import ColorPalette from '../ColorPalette'
import Immutable from 'Immutable'
import {imageUrlForLayerImage,imageUrlForSurface} from '../../state/utils'

export default React.createClass({
  mixins: [reactor.ReactMixin],
  getDataBindings() {
    return {designs: Store.getters.designs}
  },
  render() {
    return (
      <div className="admin-designs">
      <p>Designs will be here</p>
      </div>
    )
  }
})
