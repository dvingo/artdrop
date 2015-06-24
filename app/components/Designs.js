import React from 'react'
import Router from 'react-router'
import Design from './Design/Design'
import reactor from '../state/reactor'
import Store from '../state/main'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return { designs: Store.getters.adminCreatedDesigns }
  },

  componentWillMount() {
    Store.actions.loadAdminCreatedDesigns()
  },

  render() {
    let designs = this.state.designs.map(d => {
      return (
        <li className="design" key={d.get('id')}>
          <Design design={d}/>
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
