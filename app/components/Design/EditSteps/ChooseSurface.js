import React from 'react'
import Store from '../../../state/main'
import reactor from '../../../state/reactor'
import {surfacePath} from '../../../utils'
var classNames = require('classnames')

export default React.createClass({
  mixins: [reactor.ReactMixin],
  getDataBindings() {
    return {design: Store.getters.currentDesign}
  },
  render() {
    var surfaceSize = 50
    return (
      <div className={classNames('choose-surface', {visible: this.props.isActive})}>
        <ul>
          <li className="material">
            <span>Maple</span>
            <img src={surfacePath('maple.png')} height={surfaceSize} width={surfaceSize}/>
          </li>
          <li className="material">
            <span>Paper</span>
            <img src={surfacePath('paper.png')} height={surfaceSize} width={surfaceSize}/>
          </li>
          <li className="material">
            <span>Pine</span>
            <img src={surfacePath('pine.png')} height={surfaceSize} width={surfaceSize}/>
          </li>
          <li className="material">
            <span>Stone</span>
            <img src={surfacePath('stone.png')} height={surfaceSize} width={surfaceSize}/>
          </li>
        </ul>
      </div>
    )
  }
})
