import React from 'react'
import State from '../../../state/main'
import {iconPath} from '../../../utils'

export default React.createClass({

  nextColor() {
    State.actions.nextColor()
    console.log('handle that color change')
  },

  render() {
    return (
      <div className="start visible">
        <div className="actions">
          <div className="new-colors-button">
            <div className="container" onClick={this.nextColor}>
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
          </div>
        </div>
      </div>
    )
  }
})
