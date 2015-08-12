import React from 'react'
import Router from 'react-router'
import Design from '../Design/Design'
import reactor from '../../state/reactor'
import Store from '../../state/main'
import ColorPalette from '../ColorPalette'
import Immutable from 'Immutable'
import {imageUrlForLayerImage,imageUrlForSurface} from '../../state/utils'

export default React.createClass({
  mixins: [reactor.ReactMixin, Router.Navigation],

  getDataBindings() {
    return { designs: Store.getters.adminCreatedDesigns }
  },

  getInitialState() {
    return { selectedDesign: null }
  },

  componentWillMount() {
    this._interval = setInterval(() => {
      if (!reactor.__isDispatching) {
        clearInterval(this._interval)
        Store.actions.loadAdminCreatedDesigns()
      }
    }, 100)
  },

  componentWillUnmount() {
    clearInterval(this._interval)
  },

  selectDesign(designId, e) {
    e.preventDefault()
    this.transitionTo('adminEditDesign', {designId: designId})
  },

  render() {
    let designs = this.state.designs.map(d => {
      return (
        <li className="design" key={d.get('id')}>
          <Design design={d} onClick={this.selectDesign.bind(null, d.get('id'))}/>
        </li>
      )
    })

    return (
      <div className="main">
        <ul className="designs">
          {designs}
        </ul>
        <Router.RouteHandler/>
      </div>
    )
  }
})
