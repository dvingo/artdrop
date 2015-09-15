import React from 'react'
import reactor from '../../state/reactor'
import Store from '../../state/main'
import LayerSelector from './LayerSelector'
var classNames = require('classnames')

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
      <article className={classNames("layer-selector-wrapper", {portrait: this.props.isPortrait})}>
          {this.state.design.get('layers').reverse().map(layer => {
            return (
              <LayerSelector design={this.state.design} currentLayer={this.state.currentLayer} layer={layer}/>
            )
          })}
      </article>
    )
  }
})
