import React from 'react'
import {iconPath} from '../utils'
var classNames = require('classnames')

export default React.createClass({
  render() {
    var isSmall = this.props.isSmall
    return (
      <div onClick={this.props.onClick} className={classNames("check-button" , {small:isSmall})} >
        <img src={iconPath("check.svg")}/>
      </div>
    )
  }
});