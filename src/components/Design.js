import React from 'react';
import Router from 'react-router';
import AppState from '../state.js';

export default class Design extends React.Component {
  render() {
    let layerImages = this.props.design.layers.map(AppState.imageForLayer)
      .map(
        imageUrl => { return <img src={imageUrl} width={100} height={100} />; });
    return (
      <li className="design">
        {layerImages}
      </li>
    );
  }
}
