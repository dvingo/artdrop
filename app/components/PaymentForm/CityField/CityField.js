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
        <label>City</label>
        <input placeholder="Anytown" type="text"
               className="CityField"
               onChange={this.handleChange}
               value={this.state.value}
               onBlur={this.checkIfValid} />
      </span>
    )
  }
})
