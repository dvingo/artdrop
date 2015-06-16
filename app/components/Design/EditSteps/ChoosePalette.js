import React from 'react'
import Store from '../../../state/main'
import reactor from '../../../state/reactor'
var classNames = require('classnames')

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return { colorPalettes: Store.getters.colorPalettes }
  },

  choosePalette(paletteId) {
    Store.actions.selectColorPaletteId(paletteId)
  },

  render() {
    var palettes = this.state.colorPalettes.map(palette => {
      return (
        <div className="color-palette" onClick={this.choosePalette.bind(null, palette.get('id'))}>
          <div className="single-color" style={{backgroundColor: palette.get('colorOne')}}></div>
          <div className="single-color" style={{backgroundColor: palette.get('colorTwo')}}></div>
          <div className="single-color" style={{backgroundColor: palette.get('colorThree')}}></div>
          <div className="single-color" style={{backgroundColor: palette.get('colorFour')}}></div>
        </div>
      )
    })
    return (
      <section className={classNames('choose-palette', {visible: this.props.isActive})}>
        {palettes}
      </section>
    )
  }
})
