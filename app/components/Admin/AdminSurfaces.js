import React from 'react'
import Router from 'react-router'
import reactor from '../../state/reactor'
import Store from '../../state/main'
import Immutable from 'Immutable'
import SurfaceImage from '../Design/SurfaceImage'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return { surfaces: Store.getters.surfaces,
             errors: Store.getters.errors }
  },

  getInitialState() {
    return { selectedSurface: Immutable.Map() }
  },

  componentWillMount() { Store.actions.loadSurfaces() },

  componentDidMount() {
    window.addEventListener('resize', () => this.forceUpdate())
  },

  selectSurface(surface) {
    console.log('selected surface: ', surface)
  },

  render() {
    var surface = this.state.selectedSurface
    var surfaces = this.state.surfaces.map(s => {
      return <SurfaceImage surface={s}
                           currentSurface={surface}
                           onClick={this.selectSurface.bind(null, s)}
                           key={s.get('id')}/>
    })
    return (
      <div className="admin-surfaces">
        {surfaces}
      </div>
    )
  }
})
