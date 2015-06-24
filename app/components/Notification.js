import React from 'react'
export default React.createClass({
  getInitialState() {
    return {isVisible:true}
  },
  componentWillReceiveProps(nextProps) {
    this.setState({isVisible:true})
  },
  onClose() {
    this.setState({isVisible:false})
    if (this.props.onClose) {
      this.props.onClose()
    }
  },
  render() {
    var containerStyle = {
      padding: 10,
      background: 'rgb(253, 252, 148)',
      position: 'relative',
      display: this.state.isVisible ? 'block' : 'none'
    }
    var closeStyle = {
      position: 'absolute',
      top: 0,
      right: 0
    }
    return (
      <div className="notification" style={containerStyle}>
        <span>{this.props.message}</span>
        <div style={closeStyle} onClick={this.onClose}>X</div>
      </div>
    )
  }
})
