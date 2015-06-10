import React from 'react'
import reactor from '../../../state/reactor'
import Store from '../../../state/main'
import {iconPath} from '../../../utils'
import {Link} from 'react-router'
var classNames = require('classnames')

export default React.createClass({
  mixins: [reactor.ReactMixin],
  getDataBindings() {
    return { design: Store.getters.currentDesign }
  },

  render() {
    return (
      <div className={classNames('start', {visible: this.props.isActive})}>

        <div className="actions">
          <div className="new-colors-button">
            <div className="container" onClick={Store.actions.nextDesignColors}>
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
          <Link to="designEdit" params={{designId: this.state.design.get('id'), step: 'choose-layer'}}>
            <button onClick={this.moreOptionsClicked}>MORE OPTIONS</button>
          </Link>
        </div>
      </div>
    )
  }
})
