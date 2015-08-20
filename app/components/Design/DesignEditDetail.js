import React from 'react'
import reactor from '../../state/reactor'
import Store from '../../state/main'
import RenderLayers from './RenderLayers'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {
      design: Store.getters.currentDesign,
      currentLayer: Store.getters.currentLayer,
    }
  },

  componentWillMount() {
    Store.actions.selectDesignId(this.props.params.designId)
  },

  render() {
    return (
      <section className="main design-edit">

        <div className="canvas-flex-wrapper">
          <span>
            <RenderLayers layers={this.state.design.get('layers')}/>
          </span>
        </div>

        <div className="edit-ui">
          <div className="edit-steps">
          </div>
        </div>
        
      </section>
    )
  }
})
