import React from 'react'
import classNames from 'classnames'
export default React.createClass({

  onChange(e) {
    var val = e.target.value.substr(0, 7).replace(/[^ 0-9\/]/g, '')
    var [month, year] = val.split('/')
    month = (month || '').trim().substr(0, 2)
    year = (year || '').trim().substr(0, 2)
    if (month.length === 2 && year.length === 0) {
      let inputField = React.findDOMNode(this.refs.inputField)
      let cursorPos = inputField.selectionStart
      cursorPos = (this.props.value.length === 6) ? 2 : 6
      inputField.setSelectionRange(cursorPos, cursorPos)
    }
    if (year.length === 0) {
      if (month.length === 0) {
        val = ''
      } else if (month.length === 1) {
        val = month
      } else {
        val = `${month} / `
      }
    } else {
      val = `${month} / ${year}`
    }
    this.props.onChange({target: {value: val}})
  },

  render() {
    var errorMsg = this.props.errorMsg
    var hasError = errorMsg.length > 0
    var errorMessage = <span className="errorMsg">{errorMsg}</span>
    return (
      <span>
        {hasError ? errorMessage : null}
        <label>Expiry Date</label>
        <input className={classNames("ExpiryDateField",{error:hasError})}
          ref="inputField"
          placeholder="MM / YY"
          pattern="\d*"
          type="tel"
          maxLength="7"
          onChange={this.onChange}
          value={this.props.value}
          onBlur={this.props.onBlur} />
      </span>
    )
  }
})
