import React from 'react'
import reactor from '../../../state/reactor'
import Store from '../../../state/main'
import ColorsButton from '../../ColorsButton'
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
    var isSmall = this.props.isSmall
    return (
      <div className={classNames('start', {visible: isActive, small: isSmall})}>
        <div className="actions">
          <ColorsButton isSmall={false}
                        onLeftClick={Store.actions.nextDesignColors}
                        onRightClick={Store.actions.nextDesignColors}
                        label={isActive ? "New Colors" : null}/>
        </div>
         {this.props.isActive ?
          <div className="more-options">
            <Link to="designEdit" params={{designId: this.state.design.get('id'), step: 'choose-layer'}}>
              <button>MORE OPTIONS</button>
            </Link>
          </div>
          : null }
      </div>
    )
  }
})
