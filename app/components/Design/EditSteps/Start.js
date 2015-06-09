import React from 'react'
import reactor from '../../../state/reactor'
import State from '../../../state/main'
import {iconPath} from '../../../utils'

export default React.createClass({

  render() {
    return (
      <div className="start visible">
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
          </div>
        </div>
      </div>
    )
  }
})
