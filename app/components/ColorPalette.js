import React from 'react'
export default React.createClass({
  render() {
    var palette = this.props.palette
    return (
      <div className="color-palette" onClick={this.props.onClick}>
        <div className="single-color" style={{backgroundColor: palette.get('colorOne')}}></div>
        <div className="single-color" style={{backgroundColor: palette.get('colorTwo')}}></div>
        <div className="single-color" style={{backgroundColor: palette.get('colorThree')}}></div>
        <div className="single-color" style={{backgroundColor: palette.get('colorFour')}}></div>
      </div>
    )
  }
})
