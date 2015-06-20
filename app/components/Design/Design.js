import React from 'react';
import {Navigation} from 'react-router';
import State from '../../state/main';
import SVGInlineLayer  from '../SVGInlineLayer'
import {imageUrlForLayer} from '../../state/utils';

export default React.createClass({
  mixins: [Navigation],

  selectDesign(e) {
    State.actions.selectDesignId(this.props.design.get('id'))
    this.transitionTo('designDetail', {designId: this.props.design.get('id')})
  },

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.design !== nextProps.design
  },

  render() {
    let layerImages = this.props.design.get('layers')
      .map(layer => {
        return (
          <div className="layer" key={layer.get('id')}>
            <SVGInlineLayer layer={layer}/>
          </div>
        )
      })

    return (
      <section className="show-design">
        <div className="canvas-container">
          <div className="canvas" onClick={this.selectDesign} onTouchStart={this.selectDesign}>
            {layerImages}
          </div>
        </div>
      </section>
    )
  }
})
