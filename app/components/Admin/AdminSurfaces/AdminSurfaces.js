import React from 'react'
import Router from 'react-router'
import reactor from 'state/reactor'
import Store from 'state/main'
import Immutable from 'Immutable'
import {imageUrlForSurface} from 'state/utils'
import SurfaceImage from 'components/Design/SurfaceImage/SurfaceImage'
import SurfaceImageOption from './SurfaceImageOption'
import SurfaceDetail from './SurfaceDetail'

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
    this.setState({selectedSurface: surface})
    this.transitionTo('adminSurface', {surfaceId: surface.get('id')})
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

  selectImageOption (imgUrl) {
    var newSurface = this.state.selectedSurface.set('imageUrl', imgUrl)
    this.setState({selectedSurface: newSurface})
    Store.actions.updateSurface(newSurface)
  },

  render() {
    var surface = this.state.selectedSurface
    if (!surface) { return null }
    var imgUrl = imageUrlForSurface(surface)
    var surfaces = this.state.surfaces.map(s => {
      return <SurfaceImage surface={s}
                           currentSurface={surface}
                           onClick={this.selectSurface.bind(null, s)}
                           key={s.get('id')}/>
    })

    return (
      <div className="AdminSurfaces">
        {surface ?
          <SurfaceDetail surface={surface} 
            onNameChange={this.onSurfaceNameChange}
            onDescriptionChange={this.onSurfaceDescriptionChange}/>
          : null}
        <div className="AdminSurfaces-surface-options-container"> 
          {surface.get('images') ? surface.get('images').map( (imgUrl) => {
            return <SurfaceImageOption imgUrl={imgUrl} 
                    onClick={this.selectImageOption.bind(null, imgUrl)}
                    key={imgUrl}
                    />
          }): null}
        </div>
        <div className="AdminSurfaces-surfaces-container">
          {surfaces}
        </div>
      </div>
    )
  }
})
