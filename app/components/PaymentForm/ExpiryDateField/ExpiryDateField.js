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
        <label>Expiry Date</label>
        <input className="ExpiryDateField"
               placeholder="MM / YY"
               pattern="\d*"
               type="tel"
               maxLength="7"
               onChange={this.handleChange}
               value={this.state.value}
               onBlur={this.checkIfValid} />
      </span>
    )
  }
})
