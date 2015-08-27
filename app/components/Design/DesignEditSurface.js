import React from 'react'
import reactor from '../../state/reactor'
import Store from '../../state/main'
import RenderLayers from './RenderLayers'
import {imageUrlForSurface} from '../../state/utils'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {
      design: Store.getters.currentDesign,
      currentLayer: Store.getters.currentLayer,
      surfaces: Store.getters.surfaces
    }
  },

  componentWillMount() {
    Store.actions.selectDesignId(this.props.params.designId)
  },

  render() {
    if (this.state.design == null) { return null }
    return (
      <section className="main design-edit">

        <div className="canvas-flex-wrapper">
          <span>
            <RenderLayers layers={this.state.design.get('layers')}/>
          </span>
        </div>

        <div className="edit-ui">
          {this.state.surfaces.map(s => <img src={imageUrlForSurface(s)} width={200} height={200}/>)}
        </div>

      </section>
    )
  }
})
