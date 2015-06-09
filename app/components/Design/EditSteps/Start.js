import React from 'react'
import reactor from '../../../state/reactor'
import State from '../../../state/main'
import {iconPath} from '../../../utils'

export default React.createClass({

  nextDesignColors() {
    var currentDesign = reactor.evaluate([State.getters.currentDesign])
    console.log('CURRENT DESIGN in nextDesignColors: ', currentDesign)
    State.actions.nextDesignColors()
  },

  render() {
    return (
      <div className="start visible">
        <div className="actions">
          <div className="new-colors-button">
            <div className="container" onClick={this.nextDesignColors}>
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
