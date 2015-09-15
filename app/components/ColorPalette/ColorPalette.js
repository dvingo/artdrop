import React from 'react'

export default React.createClass({
  render() {
    var palette = this.props.palette
    var currentPalette = this.props.currentPalette
    var style = {}
    if ((currentPalette && palette) && currentPalette.get('id') === palette.get('id')) {
      style = {boxShadow: '4px 4px 10px 4px #4E4D4D'}
    }
    return (
      <div className="color-palette" onClick={this.props.onClick} style={style}>
        <div className="single-color" style={{backgroundColor: palette.get('colorOne')}}></div>
        <div className="single-color" style={{backgroundColor: palette.get('colorTwo')}}></div>
        <div className="single-color" style={{backgroundColor: palette.get('colorThree')}}></div>
        <div className="single-color" style={{backgroundColor: palette.get('colorFour')}}></div>
      </div>
    )
  }
})
