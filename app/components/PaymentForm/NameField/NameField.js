import React from 'react'
import classNames from 'classnames'
export default React.createClass({

  getDefaultProps() {
    return {
     label: 'Full Name',
     placeholder: "John McCarthy"
    }
  },

  onChange(e) {
    var val = e.target.value.replace(/[^a-zA-Z- ]/g, '')
    this.props.onChange({target: {value: val}})
  },

  render() {
    var errorMsg = this.props.errorMsg
    var hasError = errorMsg.length > 0
    var errorMessage = <span className="errorMsg">{errorMsg}</span>
    var classNamesObj = {error: hasError}
    if (this.props.className) {
      classNamesObj[this.props.className] = true
    }
    return (
      <span>
        {hasError ? errorMessage : null}
        <label>{this.props.label}</label>
        <input className={classNames("NameField", classNamesObj)}
          placeholder={this.props.placeholder}
          type="text"
          onChange={this.onChange}
          value={this.props.value}
          onBlur={this.props.onBlur} />
      </span>
    )
  }
})
