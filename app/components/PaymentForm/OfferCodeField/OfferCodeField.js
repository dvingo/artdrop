import React from 'react'
export default React.createClass({
  checkIfValid() {},

  render() {
    var placeholder = this.props.placeholder || "Offer code (optional)"
    return (
      <input className="OfferCodeField"
        placeholder={placeholder}
        type="text"
        onChange={this.props.onChange}
        value={this.props.value}
        onBlur={this.checkIfValid} />
    )
  }
})
