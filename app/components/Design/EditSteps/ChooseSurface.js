import React from 'react'
import Store from '../../../state/main'
import reactor from '../../../state/reactor'
import {imageUrlForSurface} from '../../../state/utils'
var classNames = require('classnames')

export default React.createClass({
  mixins: [reactor.ReactMixin],
  getDataBindings() {
    return {design: Store.getters.currentDesign,
            surfaces: Store.getters.surfaces}
  },

  selectSurface(surfaceId) {
    Store.actions.selectSurfaceId(surfaceId)
  },

  render() {
    var surfaceSize = 100
    var surfaces = this.state.surfaces.map(surface => {
      var highlight = surface.get('id') === this.state.design.getIn(['surface','id'])
      return (
        <li className="material" onClick={this.selectSurface.bind(null, surface.get('id'))}>
          <span style={{fontWeight: highlight?'bold':'normal'}}>{surface.get('title')}</span>
          <img src={imageUrlForSurface(surface)} height={surfaceSize} width={surfaceSize}/>
        </li>
      )
    })
    return (
      <div className={classNames('choose-surface', {visible: this.props.isActive})}>
        <ul> {surfaces} </ul>
      </div>
    )
  }
})
