import React from 'react'
import Router from 'react-router'
import reactor from '../../state/reactor'
import Store from '../../state/main'
import Immutable from 'Immutable'
import SurfaceImage from '../Design/SurfaceImage'
import {imageUrlForSurface} from '../../state/utils'
import EditableLabel from '../EditableLabel'

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

  componentDidMount() {
    window.addEventListener('resize', () => this.forceUpdate())
  },

  componentDidUpdate() {
    if (this.state.selectedSurface.get('id') == null &&
        this.state.surfaces.count() > 0) {
      this.setState({selectedSurface:this.state.surfaces.first()})
    }
  },

  selectSurface(surface) {
    this.setState({selectedSurface: surface})
  },

  onSurfaceNameChange(e) {
    var newSurface = this.state.selectedSurface.set('name', e.target.value)
    Store.actions.updateSurface(newSurface)
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

        <EditableLabel value={surface.get('name')}
          labelTag='h1' onChange={this.onSurfaceNameChange}/>

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
