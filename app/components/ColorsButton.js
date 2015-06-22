import React from 'react'
import {iconPath} from '../utils'
var classNames = require('classnames')

export default React.createClass({
  render() {
    var isSmall = this.props.isSmall
    var onLeftClick = this.props.onLeftClick
    var onRightClick = this.props.onRightClick
    var label = this.props.label

    return (
      <div className="new-colors-button">
        <div className="container">
          <span className={classNames("left", {small:isSmall})}
                onClick={onLeftClick}>
            <img src={iconPath('triangle-left.svg')}/>
          </span>
          <span className={classNames("color-wheel", {small:isSmall})}
                onClick={onRightClick}>
            <img src={iconPath('color-wheel.svg')}/>
          </span>
          <span className={classNames("right", {small:isSmall})}
                onClick={onRightClick}>
            <img src={iconPath('triangle-right.svg')}/>
          </span>
        </div>
        {label ?
          <span className="rand-button-text">{label}</span>
          : null}
      </div>
    )
  }
})
