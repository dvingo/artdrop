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
        <label>State</label>
        <input placeholder="CA" type="text"
               className="StateField"
               onChange={this.handleChange}
               value={this.state.value}
               onBlur={this.checkIfValid} />
      </span>
    )
  }
})
