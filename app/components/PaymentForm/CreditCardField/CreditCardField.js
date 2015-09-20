import React from 'react'
import classNames from 'classnames'

function formatCcNum(input) {
  var val = input.replace(/[^\d]/g, '')
  var parts = [val.substr(0,4), val.substr(4,4), val.substr(8,4), val.substr(12,4)].filter(i => i.length)
  return parts.join(' ')
}

export default React.createClass({
  onChange(e) {
    var val = formatCcNum(e.target.value)
    this.props.onChange({target: {value:formatCcNum(e.target.value)}})
  },

  render() {
    var errorMsg = this.props.errorMsg
    var hasError = errorMsg.length > 0
    var errorMessage = <span className="errorMsg">{errorMsg}</span>
    return (
      <span>
        {hasError ? errorMessage : null}
        <label>Card Number</label>
        <span className="cc_number_security_indicator"></span>
        <input className={classNames("CreditCardField",{error:hasError})}
          placeholder="1234 5679 9012 3456"
          pattern="\d*"
          type="tel"
          maxLength="19"
          onChange={this.onChange}
          value={this.props.value}
          onBlur={this.props.onBlur} />
      </span>
    )
  }
})
