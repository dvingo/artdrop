import React from 'react';
import Router from 'react-router';
import Modal from './Modal';
import State from '../state/main';
import router from '../router';

export default React.createClass({
  selectDesign() {
    State.actions.selectDesignId(this.props.design.get('id'));
    router.transitionTo('designDetail', {designId: this.props.design.get('id')});
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
