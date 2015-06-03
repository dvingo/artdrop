import React from 'react';
import Modal from './Modal';
import reactor from '../state/reactor';
import State from '../state/main';
var appElement = document.getElementById('app');
Modal.setAppElement(appElement);
Modal.injectCSS();

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return { design: State.getters.currentDesign };
  },

  componentWillMount() {
    State.actions.selectDesignId(this.props.params.designId);
  },

  render: function() {
    if (this.state.design == null) {
      return null;
    }
    let layerImages = this.state.design.get('layers').map(
      layer => {
        var imageUrl = layer.selectedLayerImage.imageUrl.replace('/assets/images/new/', '/src/images/');
        return (
          <div className="layer" key={layer.id}>
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
