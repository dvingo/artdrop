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
    return {colorPalettes: Store.getters.colorPalettes}
  },
  componentWillMount() {
    Store.actions.loadAdminColorPalettes()
  },
  choosePalette(paletteId) {
    console.log("chose palette: ", paletteId)
  },
  render() {
    var palettes = this.state.colorPalettes.map(palette => {
      return (<ColorPalette onClick={this.choosePalette.bind(null, palette.get('id'))}
                palette={palette}/>)
    })
    return (
      <div className="admin-color-palettes">
        {palettes}
      </div>
    )
  }
})
