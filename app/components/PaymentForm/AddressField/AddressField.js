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
        <label>Address</label>
        <input placeholder="123 Fake Street" type="text"
               className="NameField"
               onChange={this.handleChange}
               value={this.state.value}
               onBlur={this.checkIfValid} />
      </span>
    )
  }
})
