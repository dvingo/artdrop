import React from 'react';
import Router from 'react-router';
import AppState from '../state';
import Modal from './Modal';
var Link = Router.Link;


export default React.createClass({
  render() {
    console.log('props in Design: ', this.props.design);

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
          <Link to="designDetail" params={{ designId: this.props.design.get('id') }}>
            <div className="canvas">
              {layerImages}
            </div>
          </Link>
        </div>
      </section>
    );
  }
})
