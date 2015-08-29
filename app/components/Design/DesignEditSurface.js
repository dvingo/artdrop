import React from 'react'
import reactor from '../../state/reactor'
import Store from '../../state/main'
import SurfaceImage from './SurfaceImage'
import RenderLayers from './RenderLayers'
var classNames = require('classnames')

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {
      design: Store.getters.currentDesign,
      surfaces: Store.getters.surfaces
    }
  },

  componentWillMount() {
    Store.actions.selectDesignId(this.props.params.designId)
    Store.actions.loadCurrentDesignEditResources()
  },

  render() {
    console.log('RENDER THE EDIT SURFACE')
    if (this.state.design == null || this.state.surfaces == null) { 
      console.log('RETURNING NULL')
      return null 
    }

    console.log('REDERING DOM AFTER IF')
    var isPortrait = window.innerHeight > window.innerWidth
    var surfaces = this.state.surfaces.map(surface => {
      return <SurfaceImage surface={surface} key={surface.get('id')}/>
    })

    return (
      <section className="main design-edit-surface">
        <div className="edit-ui">
<<<<<<< HEAD

          <div className="edit-ui-canvas">
            <div className="canvas-flex-wrapper">
              <span>
                <RenderLayers layers={this.state.design.get('layers')}/>
              </span>
            </div>
          </div>

          <div className="edit-ui-bottom">
            {surfaces}
          </div>
        </div>

      </section>
    )
  }
})
