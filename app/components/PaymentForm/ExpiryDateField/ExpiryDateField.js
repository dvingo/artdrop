import React from 'react'
import classNames from 'classnames'
export default React.createClass({

  onChange(e) {
    var cursorPos = React.findDOMNode(this.refs.inputField).selectionStart
    var val = e.target.value.substr(0, 7).replace(/[^ 0-9\/]/g, '')
    var [month, year] = val.split('/')
  // TODO could just substring month and year to 2 digits
    month = (month || '').trim().substr(0,2)
    year = (year || '').trim().substr(0,2)
    console.log('month is: ', month)
    console.log('year is: ', year)
    if (month.length === 2 && year.length === 0) {
      cursorPos = 6
    }
console.log('cursor pos: ', cursorPos)
    // TODO if month is length 2 then move cursor to year position
    val = `${month} / ${year}`
    this.setState({cursorPos: cursorPos})
    this.props.onChange({target: {value:val}})
  },

  componentDidUpdate() {
    var inputField = React.findDOMNode(this.refs.inputField)
    if (inputField) {
      inputField.setSelectionRange(this.state.cursorPos,this.state.cursorPos)
    }
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
