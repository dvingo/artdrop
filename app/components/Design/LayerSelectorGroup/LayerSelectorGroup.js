import React from 'react'
import reactor from 'state/reactor'
import getters from 'state/getters'
import LayerSelector from 'components/Design/LayerSelector/LayerSelector'
var classNames = require('classnames')

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {
      design: getters.currentDesign,
      currentLayer: getters.currentLayer
    }
  },

  render() {
    var {design, currentLayer} = this.state
    if (design == null || currentLayer == null ) { return null }

    return (
      <article className={classNames("LayerSelectorGroup", {portrait: this.props.isPortrait})}>
          {design.get('layers').reverse().map(layer => {
            return (
              <LayerSelector design={design} currentLayer={currentLayer} layer={layer}/>
            )
          })}
      </article>
    )
  }
})
