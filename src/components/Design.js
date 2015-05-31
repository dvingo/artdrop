import React from 'react';
import Router from 'react-router';
import AppState from '../state.js';
let Link = Router.Link;

export default React.createClass({
  render() {
    let layerImages = this.props.design.layers.map(AppState.imageForLayer)
      .map(imageUrl => {
        return (
          <div className="layer">
            <img src={imageUrl} width={100} height={100} />
          </div>
        );
      });
    return (
      <section className="show-design">
        <div className="show-canvas">
          <Link to="design" params={{ designId: this.props.design.id }}>
            <div className="canvas">
              {layerImages}
            </div>
          </Link>
        </div>
      </section>
    );
  }
})
