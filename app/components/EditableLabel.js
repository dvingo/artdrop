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
      isMouseDown: false,
      updatedValue: null,
    }
  },

  onDoubleClick() { this.setState({isEditing:true}) },

  onMouseOver() { this.setState({isMouseOver:true}) },

  onMouseOut() { this.setState({isMouseOver:false}) },

  onMouseDown() { this.setState({isMouseDown:true}) },

  onMouseUp() { this.setState({isMouseDown:false}) },

  onChange(e) {
    // In the future we can add validation here so you can specify different
    // types of inputs, geared toward common needs, money, address, email address,
    // phone etc.
    this.setState({updatedValue: e.target.value})
  },

  onKeyUp(e) {
    // TODO should probably use Keypress lib here.
    var key = e.keyCode
    var input = (this.refs.input ? React.findDOMNode(this.refs.input) : null)
    if (input !== e.target) { return }
    if (key === 27) {
      this.setState({isEditing:false})
    } else if (key === 13) {
      this.props.onChange(this.state.updatedValue)
      this.setState({isEditing:false})
    }
  },

  componentDidMount() {
    this.setState({updatedValue: this.props.value})
    window.addEventListener('keyup', this.onKeyUp)
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.state.updatedValue == null && this.props.value != null) {
      this.setState({updatedValue: this.props.value})
    }
    if (this.state.isEditing && !prevState.isEditing) {
      this.setState({updatedValue: this.props.value})
    }
    var input = (this.refs.input ? React.findDOMNode(this.refs.input) : null)
    if (input != null) { input.focus() }
  },

  render() {
    var { editTag, labelTag, editType } = this.props
    var isEditing = this.state.isEditing
    var boxShadow = (this.state.isMouseDown ?'2px 2px 10px 2px rgba(0,0,0,0.8) inset' :
       (this.state.isMouseOver ? '2px 2px 10px 2px rgba(0,0,0,0.6) inset' : ''))

    var labelStyle = { boxShadow: boxShadow }
    var self = this
    var editProps = {
      value: this.state.updatedValue,
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
