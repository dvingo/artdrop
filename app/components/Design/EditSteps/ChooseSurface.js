import React from 'react'
import State from '../../../state/main'
import {surfacePath} from '../../../utils'
var classNames = require('classnames')

export default React.createClass({
  render() {
    return (
      <section className={classNames('choose-surface', {visible: false})}>
        <div className="design-selection">
          <ul className="design-selection-items">
            <li className="item-single material-single">
              <img src={surfacePath('maple.png')}/>
            </li>
            <li className="item-single material-single">
              <img src={surfacePath('paper.png')}/>
            </li>
            <li className="item-single material-single">
              <img src={surfacePath('pine.png')}/>
            </li>
            <li className="item-single material-single">
              <img src={surfacePath('stone.png')}/>
            </li>
          </ul>
        </div>
      </section>
    )
  }
})
