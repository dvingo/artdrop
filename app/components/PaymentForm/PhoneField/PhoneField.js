import React from 'react'
import classNames from 'classnames'
export default React.createClass({

  onChange(e) {
    var val = e.target.value.substr(0, 14).replace(/[^0-9-]/g, '')
    this.props.onChange({target: {value: val}})
  },

  render() {
    var errorMsg = this.props.errorMsg
    var hasError = errorMsg.length > 0
    var errorMessage = <span className="errorMsg">{errorMsg}</span>
    return (
      <span>
        {hasError ? errorMessage : null}
        <label>Phone number</label>
        <input className={classNames("PhoneField", {error:hasError})}
          placeholder="917-555-1234"
          type="tel"
          onChange={this.onChange}
          value={this.props.value}
          onBlur={this.props.onBlur} />
      </span>
    )
  }
})
