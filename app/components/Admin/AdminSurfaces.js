import React from 'react'
import reactor from '../../state/reactor'
import Store from '../../state/main'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return { surfaces: Store.getters.surfaces }
  },

  componentWillMount() {
    //Store.actions.loadSurfaces()
  },

  handleResetSurfaces() {
    Store.actions.resetSurfacesFromFixture()
    console.log('got it')
  },

  render() {
    return (
      <div style={{padding: '10px 20px'}}>
        <h2>Surfaces</h2>
        <button onClick={this.handleResetSurfaces}>Reset Surfaces from fixtures</button>
      </div>
    )
  }
})
