import React from 'react'
var classNames = require('classnames')
var Keypress = require("react-keypress")

export default React.createClass({
  getDefaultProps() {
    return {
      labelTag: 'span',
      editTag: 'input',
      editType: 'text'
    }
  },

  getInitialState() {
    return {
      isEditing: false,
      isMouseOver: false,
      isMouseDown: false
    }
  },

  onDoubleClick() {
    if (!this.state.isEditing) {
      this.setState({isEditing:true})
    }
  },

  onMouseOver() {
    this.setState({isMouseOver:true})
  },

  onMouseOut() {
    this.setState({isMouseOver:false})
  },

  onMouseDown() {
    this.setState({isMouseDown:true})
  },

  onMouseUp() {
    this.setState({isMouseDown:false})
  },

  onChange(e) {
    // In the future we can add validation here so you can specify different
    // types of inputs, geared toward common needs, money, address, email address,
    // phone etc.
    //this.props.onChange(e)
  },

  onkeyUp(e) {
    console.log('e.key: ', e.key)
    if (e.key === 'Escape') {
      console.log('esc')
      this.setState({isEditing:false})
    } else if (e.key === 'Enter') {
      console.log('enter')
      this.setState({isEditing:false})
    }
  },

  onKeyUp(e) {
    var key = e.keyCode
    var input = (this.refs.input ? React.findDOMNode(this.refs.input) : null)
    if (input === e.target) {
      if (key === 27) {
        console.log('esc')
      }
      else if (key === 13) {
        console.log('enter')
      }
      console.log(' GOT KEY: ', key)
    }
  },

  componentDidMount() {
    window.addEventListener('keyup', this.onKeyUp)
  },

  render() {
    var { editTag, labelTag, editType } = this.props
    var isEditing = this.state.isEditing
    console.log('ismouseover: ', this.state.isMouseOver)
    var boxShadow = (this.state.isMouseDown ?'2px 2px 10px 2px rgba(0,0,0,0.8) inset' :
       (this.state.isMouseOver ? '2px 2px 10px 2px rgba(0,0,0,0.6) inset' : ''))

    var labelStyle = {
      //background: (this.state.isMouseOver ? 'red' : 'none'),
      boxShadow: boxShadow
    }

    var self = this
    var editProps = {
      value: this.props.value,
      className: '',
      onMouseOver: this.onMouseOver,
      onMouseOut: this.onMouseOut,
      onChange: this.onChange,
      ref: 'input',
    }
    if (editType) { editProps.type = editType }

    var editEl = React.createElement(editTag, editProps)
    var labelEl = (
      React.createElement(labelTag, {
        style: labelStyle,
        className: '',
        onMouseOver: this.onMouseOver,
        onMouseOut: this.onMouseOut,
        onMouseDown: this.onMouseDown,
        onMouseUp: this.onMouseUp,
        onDoubleClick: this.onDoubleClick
      }, this.props.value))
    return (isEditing ? editEl : labelEl)
  }
})
