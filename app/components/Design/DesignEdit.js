import React from 'react'
import reactor from '../../state/reactor'
import State from '../../state/main'
import SVGInlineLayer  from '../SVGInlineLayer'
import Start from './EditSteps/Start'
import {iconPath} from '../../utils'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return { design: State.getters.currentDesign }
  },

  componentWillMount() {
    State.actions.selectDesignId(this.props.params.designId);
  },

  render() {
    if (this.state.design == null) { return null; }

    let layerImages = this.state.design.get('layers').map(
      layer => {
        return (
          <div className="layer" key={layer.get('id')}>
            <SVGInlineLayer layer={layer} width={100} height={100} />
          </div>
        )
      })

    return (
      <section className="design-edit">

        <div className="canvas">
          {layerImages}
        </div>

        <div className="edit-ui">
          <div className="edit-steps">
            <Start/>
          </div>
        </div>

      </section>
    )
  }
})
