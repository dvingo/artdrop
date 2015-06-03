import React from 'react';
import {Navigation} from 'react-router';
import State from '../state/main';

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
        var imageUrl = layer.selectedLayerImage.imageUrl.replace('/assets/images/new/', '/src/images/');
        return (
          <div className="layer" key={layer.id}>
            <img src={imageUrl} width={100} height={100} />
          </div>
        );
      });

    return (
      <section className="show-design">
        <div className="show-canvas">
          <a href="#" onClick={this.selectDesign}>
            <div className="canvas">
              {layerImages}
            </div>
          </a>
        </div>
      </section>
    );
  }
})
