import React from 'react'
import classNames from 'classnames'
export default React.createClass({

  onChange(e) {
    var val = e.target.value.replace(/[^a-zA-Z0-9-]/g, '')
    this.props.onChange({target: {value: val}})
  },

  render() {
    var errorMsg = this.props.errorMsg
    var hasError = errorMsg.length > 0
    var errorMessage = <span className="errorMsg">{errorMsg}</span>
    return (
      <span>
        {hasError ? errorMessage : null}
        <label>Zipcode</label>
        <input className={classNames("ZipcodeField", {error:hasError})}
          placeholder="90210"
          type="text"
          onChange={this.onChange}
          value={this.props.value}
          onBlur={this.props.onBlur} />
      </span>
    )
  }
})
