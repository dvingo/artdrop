import React from 'react'
import {iconPath} from 'utils'
import ColorsButtonRotate from 'components/ColorsButtonRotate/ColorsButtonRotate'
var classNames = require('classnames')


export default React.createClass({
  render() {
    var isSmall = this.props.isSmall
    var onLeftClick = this.props.onLeftClick
    var onRightClick = this.props.onRightClick
    var label = this.props.label

    // <span className="color-wheel"
    //       onClick={onRightClick}>
    //   <img src={iconPath('color-wheel.svg')}/>

    return (
      <div className={classNames("ColorsButton" , {small:isSmall})} >
        <div className="container">
          <span className="left"
                onClick={onLeftClick}>
            <img src={iconPath('triangle-left.svg')}/>
          </span>
          <ColorsButtonRotate/>
          <span className="right"
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
});