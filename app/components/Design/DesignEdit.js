import React from 'react';
import reactor from '../../state/reactor'
import State from '../../state/main'
import {imageUrlForLayer} from '../../state/utils'
import {iconPath} from '../../utils'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return { design: State.getters.currentDesign };
  },

  componentWillMount() {
    State.actions.selectDesignId(this.props.params.designId);
  },

  nextColor() {
    console.log('handle that color change')
  },

  render() {
    if (this.state.design == null) { return null; }

    let layerImages = this.state.design.get('layers').map(
      layer => {
        return (
          <div className="layer" key={layer.id}>
            <img src={imageUrlForLayer(layer)} width={100} height={100} />
          </div>
        )
      })

    return (
      <section className="design-edit">
        <div className="canvas">
          {layerImages}
        </div>
        <div className="edit-ui">
          <div className="steps">
            <div className="new-colors-button">
              <div className="container" onClick={this.nextColor}>
                <span className="left">
                  <img src={iconPath('triangle-left.svg')}/>
                </span>
                <span className="color-wheel">
                  <img src={iconPath('color-wheel.svg')}/>
                </span>
                <span className="right">
                  <img src={iconPath('triangle-right.svg')}/>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
})
