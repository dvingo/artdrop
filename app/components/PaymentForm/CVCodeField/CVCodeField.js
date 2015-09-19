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
        <label>CV Code</label>
        <input autoComplete="off"
               className="CVCodeField cv_code"
               maxLength="4" pattern="\d*"
               placeholder="123"
               type="tel"/>
      </span>
    )
  }
})
