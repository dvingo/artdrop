import React from 'react';
import Router from 'react-router';
import AppState from '../state';
import Modal from './Modal';
var appElement = document.getElementById('app');
Modal.setAppElement(appElement);
Modal.injectCSS();

export default React.createClass({
  getInitialState() {
    return {
      design: (
       this.props.params
       ? AppState.designForId(this.props.params.designId)
       : this.props.design)
    };
  },
  render() {
    let layerImages = this.state.design.get('layers')
      .map(layerImageId => {
        var imageUrl = AppState.imageForLayer(layerImageId);
        return (
          <div className="layer" key={layerImageId}>
            <img src={imageUrl} width={100} height={100} />
          </div>
        );
      });
    return (
      <Modal isOpen={true}>
        <section className="show-design">
          <div className="show-canvas">
            <div className="canvas">
              {layerImages}
            </div>
          </div>
        </section>
      </Modal>
    );
  }
})
