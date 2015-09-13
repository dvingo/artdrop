import React from 'react'
import Router from 'react-router'
import reactor from '../../state/reactor'
import Store from '../../state/main'
import Immutable from 'Immutable'
import SurfaceImage from '../Design/SurfaceImage'
import {imageUrlForSurface} from '../../state/utils'
import EditableLabel from '../EditableLabel'

export default React.createClass({
  mixins: [reactor.ReactMixin, Router.Navigation],

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
      if (this.props.params.surfaceId) {
        var s = this.state.surfaces.find(v => v.get('id') === this.props.params.surfaceId)
          if (s) {
            this.setState({selectedSurface:s})
          }
      } else {
        this.selectSurface(this.state.surfaces.first())
      }
    }
  },

  selectSurface(surface) {
    console.log('got surface: ', surface)
    this.setState({selectedSurface: surface})
    this.transitionTo('adminSurface', {surfaceId: surface.get('id')})
    // update route here
  },
  onSurfaceDescriptionChange(newDescription) {
    var newSurface = this.state.selectedSurface.set('description', newDescription)
    this.setState({selectedSurface:newSurface})
    Store.actions.updateSurface(newSurface)
  },

  onSurfaceNameChange(newName) {
    var newSurface = this.state.selectedSurface.set('name', newName)
    this.setState({selectedSurface:newSurface})
    Store.actions.updateSurface(newSurface)
  },

  render() {
    console.log('here')
    var surface = this.state.selectedSurface
    if (!surface) { return null }
    var imgUrl = imageUrlForSurface(surface)
    var surfaces = this.state.surfaces.map(s => {
      return <SurfaceImage surface={s}
                           currentSurface={surface}
                           onClick={this.selectSurface.bind(null, s)}
                           key={s.get('id')}/>
    })
    console.log('after sufraces')
    var selectedSurfaceDetails = (surface ?
      <div className="admin-surface-details">

        <EditableLabel value={surface.get('name')}
          labelTag='h1' onChange={this.onSurfaceNameChange}/>

        <EditableLabel value={surface.get('description')}
           editTag='textarea'
           onChange={this.onSurfaceDescriptionChange}/>

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
