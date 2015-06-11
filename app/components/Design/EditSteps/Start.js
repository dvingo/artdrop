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
    var isActive = this.props.isActive
    return (
      <div className={classNames('start', {visible: isActive, small: !isActive})}>

        <div className="actions">
          <div className="new-colors-button">
            <div className="container" onClick={Store.actions.nextDesignColors}>
              <span className={classNames("left", {small: !isActive})}>
                <img src={iconPath('triangle-left.svg')}/>
              </span>
              <span className={classNames("color-wheel", {small: !isActive})}>
                <img src={iconPath('color-wheel.svg')}/>
              </span>
              <span className={classNames("right", {small: !isActive})}>
                <img src={iconPath('triangle-right.svg')}/>
              </span>
            </div>
            {this.props.isActive ?
              <span className="rand-button-text">New Colors</span>
              : null}
          </div>
        </div>

         {this.props.isActive ?
          <div className="more-options">
            <Link to="designEdit" params={{designId: this.state.design.get('id'), step: 'choose-layer'}}>
              <button onClick={this.moreOptionsClicked}>MORE OPTIONS</button>
            </Link>
          </div>
          : null }
      </div>
    )
  }
})
