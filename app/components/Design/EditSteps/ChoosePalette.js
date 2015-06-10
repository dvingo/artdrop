import React from 'react'
import State from '../../../state/main'
import reactor from '../../../state/reactor'
var classNames = require('classnames')

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return { colorPalettes: State.getters.colorPalettes }
  },

  choosePalette(palette) {
    console.log('chose palette: ', palette.toJS())
  },

  render() {
    var palettes = this.state.colorPalettes.map(palette => {
      return (
        <div className="color-palette" onClick={this.choosePalette.bind(null, palette)}>
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
