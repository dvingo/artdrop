import React from 'react'
import {iconPath} from 'utils'
export default React.createClass({
  onClick(e) {
    e.preventDefault()
    console.log('got gift click')
  },
  render() {
    return (
      <a className="GiftIcon" onClick={this.onClick}>
        <img src={iconPath("gift_icon.svg")}/>
        <span>Give as a gift</span>
      </a>
    )
  }
})
