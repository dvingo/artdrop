import React from 'react'
import reactor from '../../../state/reactor'
import Store from '../../../state/main'
import LayerSelector from './LayerSelector'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {
      design: Store.getters.currentDesign,
      currentLayer: Store.getters.currentLayer
    }
  },

  render() {

    if (this.state.design == null || this.state.currentLayer == null ) { return null }

    return (
      <article className="layer-selector-wrapper small">
          {this.state.design.get('layers').reverse().map(layer => {
            return (
              <LayerSelector currentLayer={this.state.currentLayer} layer={layer}/>
            )
          })}
      </article>
    )
  }
})
