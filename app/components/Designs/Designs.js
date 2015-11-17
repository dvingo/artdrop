import React from 'react'
import Router from 'react-router'
import Design from 'components/Design/Design'
import reactor from 'state/reactor'
import Store from 'state/main'

export default React.createClass({
  mixins: [reactor.ReactMixin, Router.Navigation],

  getDataBindings() {
    return { designs: Store.getters.designsGroupedByTag }
  },

  componentWillMount() {
    Store.actions.loadAdminCreatedDesigns()
  },

  selectDesign(designId, e) {
    this.transitionTo('designDetail', {designId: designId})
  },

  render() {
    let designs = this.state.designs.map(d => {
      return (
        <li className="Design-li" key={d.get('id')}>
          <Design design={d} onClick={this.selectDesign.bind(null, d.get('id'))}/>
        </li>
      )
    })

    return (
      <div className="main">
        <ul className="Designs">
          {designs}
        </ul>
        <Router.RouteHandler/>
      </div>
    )
  }
})
