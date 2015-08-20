import React from 'react'
import {iconPath} from '../utils'
var classNames = require('classnames')

export default React.createClass({
  render() {
    var isSmall = this.props.isSmall
    return (
      <div className={classNames("check-button" , {small:isSmall})} >
        &#916;
      </div>
    )
  }
});