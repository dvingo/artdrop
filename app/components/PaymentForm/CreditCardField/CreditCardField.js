import React from 'react'
export default React.createClass({
  getInitialState() {
    return { value: '' }
  },

  handleChange(e) {
    this.setState({value: e.target.value})
  },

  checkIfValid() {},

  render() {
    var value = this.state.value;
    return (
      <span>
        <label>Card Number</label>
        <span className="cc_number_security_indicator"></span>
        <input className="CreditCardField"
          placeholder="1234 5679 9012 3456" pattern="\d*" type="tel" maxLength="19" onChange={this.handleChange}
          value={this.state.value}
          onBlur={this.checkIfValid} />
      </span>
    )
  }
})
