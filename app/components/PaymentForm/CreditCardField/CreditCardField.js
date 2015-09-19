import React from 'react'
import classNames from 'classnames'

function isValidCreditCardNumber(num) {
  num = num.replace(/\s/g, '')
  if (num.length !== 16) {
    return false
  }
  return true
}

export default React.createClass({
  getInitialState() {
    return {value: '', hasError: false, errorMsg: ''}
  },

  handleChange(e) {
    var val = e.target.value
    val = val.replace(/[^\d]/g, '')
    var parts = [val.substr(0,4), val.substr(4,4), val.substr(8,4), val.substr(12,4)].filter(i => i.length)
    val = parts.join(' ')
    this.setState({value: val})
  },

  checkIfValid() {
    if (this.state.value.length === 0) {
      this.setState({hasError:true, errorMsg:'You must enter a credit card number'})
    } else if (!isValidCreditCardNumber(this.state.value)) {
      this.setState({hasError:true, errorMsg:'The credit card number you entered is invalid'})
    } else {
      this.setState({hasError:false, errorMsg:''})
    }
  },

  render() {
    var value = this.state.value;
    var errorMessage = <span className="errorMsg">{this.state.errorMsg}</span>
    var inputField = (
      <input className={classNames("CreditCardField",{error:this.state.hasError})}
        placeholder="1234 5679 9012 3456"
        pattern="\d*"
        type="tel"
        maxLength="19"
        onChange={this.handleChange}
        value={this.state.value}
        onBlur={this.checkIfValid} />)
    return (
      <span>
        {this.state.hasError ? errorMessage : null}
        <label>Card Number</label>
        <span className="cc_number_security_indicator"></span>
        {inputField}
      </span>
    )
  }
})
