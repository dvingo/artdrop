import React from 'react'
import {iconPath} from 'utils'
import ColorsButtonRotate from 'components/ColorsButtonRotate/ColorsButtonRotate'
var classNames = require('classnames')

export default React.createClass({
  render() {
    var {isSmall, onLeftClick, onRightClick, label}  = this.props
    return (
      <div className={classNames("ColorsButton" , {small:isSmall})} >
        <div className="container">
          <span className="left" onClick={onLeftClick}>
            <img src={iconPath('triangle-left.svg')}/>
          </span>
          <ColorsButtonRotate/>
          <span className="right" onClick={onRightClick}>
            <img src={iconPath('triangle-right.svg')}/>
          </span>
        </div>
        {label ? <span className="rand-button-text">{label}</span> : null}
      </div>
    )
  }
})
