import React from 'react'
import Router from 'react-router'
import reactor from '../../state/reactor'
import Store from '../../state/main'
import Immutable from 'Immutable'
import SurfaceImage from '../Design/SurfaceImage'
import {imageUrlForSurface} from '../../state/utils'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return { surfaces: Store.getters.surfaces,
             errors: Store.getters.errors }
  },

  getInitialState() {
    return { selectedSurface: Immutable.fromJS({imageUrl:''}) }
  },

  componentWillMount() { Store.actions.loadSurfaces() },

  componentDidUpdate() {
   // attempt set default selected surface
  },
  componentDidMount() {
    window.addEventListener('resize', () => this.forceUpdate())
  },

  selectSurface(surface) {
    this.setState({selectedSurface: surface})
  },

  render() {
    var surface = this.state.selectedSurface
    var imgUrl = imageUrlForSurface(surface)
    var surfaces = this.state.surfaces.map(s => {
      return <SurfaceImage surface={s}
                           currentSurface={surface}
                           onClick={this.selectSurface.bind(null, s)}
                           key={s.get('id')}/>
    })
    var selectedSurfaceDetails = (surface ?
      <div className="admin-surface-details">
        <div className="text-container">
          <h1>{surface.get('name')}</h1>
          <span style={{fontSize:'0.7em'}}>{surface.get('description')}</span>
        </div>
        <div className="image-container">
          <img src={imgUrl}/>
        </div>
      </div>
      : null)
    return (
      <div className="admin-surfaces">
        {selectedSurfaceDetails}
        <div className="surfaces-container">
          {surfaces}
        </div>
      </div>
    )
  }
})
