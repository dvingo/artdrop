import React from 'react'
export default React.createClass({

  getInitialState() {
     return { mouseIsDown: false }
  },

  onMouseDown(e) {
    e.preventDefault()
    this.setState({mouseIsDown: true})
  },

  onMouseUp(e) {
    e.preventDefault()
    this.setState({mouseIsDown: false})
  },

  onTouchEnd(e) {
    e.preventDefault()
    this.setState({mouseIsDown: false})
    if (this.props.onClick) {
      this.props.onClick()
    }
  },

  render() {
    var style = {
      borderRadius: 2,
      boxShadow: (this.state.mouseIsDown ? '1px 1px 4px black inset': '1px 1px 1px black')
    }
    var size = this.props.size || 30
    return (
      <span className="image-with-label" style={style}
         onMouseDown={this.onMouseDown}
         onMouseUp={this.onMouseUp}
         onTouchStart={this.onMouseDown}
         onTouchEnd={this.onTouchEnd}
         onClick={this.props.onClick}>
        <span><img src={this.props.imgSrc} height={size} width={size}/></span>
        <span style={{marginTop:5}}>{this.props.label}</span>
      </span>
    )
  }
})
