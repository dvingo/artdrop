import React from 'react'
import {iconPath} from 'utils'
var classNames = require('classnames')

export default React.createClass({
  render() {
    var onToggle = this.props.onToggle
    var inUpPosition = this.props.inUpPosition
    var label = inUpPosition ? this.props.upLabel : this.props.downLabel
    var arrowImg = inUpPosition ? "down-arrow.svg" : "up-arrow.svg"

    return (
      <div className="toggle-options-button" onClick={onToggle}>
        <span>{label}</span>
        <span>
          <img src={iconPath(arrowImg)}/>
        </span>
      </div>
    )
  }
})
