import React from 'react'
var classNames = require('classnames')

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
      isMouseOver: false
    }
  },

  onDoubleClick() {
    if (!this.state.isEditing) {
      this.setState({isEditing:true})
    }
  },

  onMouseOver() {
    console.log("got mouse")
    this.setState({isMouseOver:true})
  },

  onMouseOut() {
    this.setState({isMouseOver:false})
  },

  onKeyPress(e) {
    // TODO have prop to toggle sending all changes on every update
    // or one event when the user hits enter
    // this way you can allow using escape key to cancel changes without persisting them.
    if (e.key === 'Enter') {
      this.setState({isEditing:false})
    }
  },

  onChange(e) {
    // In the future we can add validation here so you can specify different
    // types of inputs, geared toward common needs, money, address, email address,
    // phone etc.
    this.props.onChange(e)
  },

  render() {
    var { editTag, labelTag, editType } = this.props
    var isEditing = this.state.isEditing
    console.log('ismouseover: ', this.state.isMouseOver)
    var labelStyle = {
      background: (this.state.isMouseOver ? 'red' : 'none'),
    }
    console.log('is editing: ', isEditing)

    var editProps = {
      value: this.props.value,
      className: '',
      onMouseOver: this.onMouseOver,
      onMouseOut: this.onMouseOut,
      onKeyPress: this.onKeyPress,
      onChange: this.onChange
    }
    if (editType) { editProps.type = editType }
    var editEl = (
      React.createElement(editTag, editProps))

    var labelEl = (
      React.createElement(labelTag, {
        style: labelStyle,
        className: '',
        onMouseOver: this.onMouseOver,
        onMouseOut: this.onMouseOut,
        onDoubleClick: this.onDoubleClick
      }, this.props.value))
    return (isEditing ? editEl : labelEl)
  }
})
