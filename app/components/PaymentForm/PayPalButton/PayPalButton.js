import React from 'react'
import {iconPath} from 'utils'
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
      <div className="PayPalButton">
        <i className="gi-paypal">
          <img src={iconPath("paypal_color_icon.png")}/>
        </i>
        <span>or pay with</span>
      </div>
    )
  }
})
