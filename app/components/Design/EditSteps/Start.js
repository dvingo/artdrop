import React from 'react'
import State from '../../../state/main'
import {iconPath} from '../../../utils'
var classNames = require('classnames')

export default React.createClass({

  render() {
    return (
      <div className={classNames('start', {visible: this.props.isActive})}>

        <div className="actions">
          <div className="new-colors-button">
            <div className="container" onClick={State.actions.nextDesignColors}>
              <span className="left">
                <img src={iconPath('triangle-left.svg')}/>
              </span>
              <span className="color-wheel">
                <img src={iconPath('color-wheel.svg')}/>
              </span>
              <span className="right">
                <img src={iconPath('triangle-right.svg')}/>
              </span>
            </div>
            <span className="rand-button-text">New Colors</span>
          </div>
        </div>

        <div className="more-options">
          <button onClick={this.moreOptionsClicked}>MORE OPTIONS</button>
        </div>
      </div>
    )
  }
})
