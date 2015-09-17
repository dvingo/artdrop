import React from 'react'
export default React.createClass({
  getInitialState() {
    return { value: '' }
  },

  handleChange(e) {
    this.setState({value: e.target.value})
  },

  checkIfValid() {
    //if (isValidEmail(this.state.value)) {
      //this.props.onChange(this.state.value)
    //} else {
      //this.props.onInvalidInput(this.state.value)
    //}
  },

  render() {
    var value = this.state.value;
    return (
      <input className="OfferCodeField"
       placeholder="Offer code (optional)" type="text" onChange={this.handleChange}
       value={this.state.value}
       onBlur={this.checkIfValid} />
    )
  }
});
