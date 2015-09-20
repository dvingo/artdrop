import React from 'react'
import classNames from 'classnames'

export default React.createClass({

  onChange(e) {
    var val = e.target.value.substr(0,2).replace(/[^a-zA-Z]/g, '').toUpperCase()
    this.props.onChange({target: {value: val}})
  },

  render() {
    var errorMsg = this.props.errorMsg
    var hasError = errorMsg.length > 0
    var errorMessage = <span className="errorMsg">{errorMsg}</span>
    return (
      <span>
        {hasError ? errorMessage : null}
        <label>State</label>
        <input className={classNames("StateField", {error:hasError})}
          placeholder="CA" type="text"
          onChange={this.onChange}
          value={this.props.value}
          onBlur={this.props.onBlur} />
      </span>
    )
  }
})
