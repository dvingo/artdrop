import React from 'react';
import {Navigation} from 'react-router';
import State from '../../state/main';
import {imageUrlForLayer} from '../../state/utils';

export default React.createClass({
  mixins: [Navigation],

  selectDesign(e) {
    e.preventDefault();
    State.actions.selectDesignId(this.props.design.get('id'));
    this.transitionTo('designDetail', {designId: this.props.design.get('id')});
  },

  render() {
    let layerImages = this.props.design.get('layers')
      .map(layer => {
        return (
          <div className="layer" key={layer.get('id')}>
            <img src={imageUrlForLayer(layer)} width={100} height={100} />
          </div>
        );
      });

    return (
      <section className="show-design">
        <div className="show-canvas">
          <div className="canvas" onClick={this.selectDesign}>
            {layerImages}
          </div>
        </div>
      </section>
    );
  }
})
