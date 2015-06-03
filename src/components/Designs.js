import React from 'react';
import Router from 'react-router';
import AppState from '../state.js';
import Design from './Design';
import reactor from '../state/reactor';
import State from '../state/main';

export default React.createClass({
  mixins: [reactor.ReactMixin],
  getDataBindings() {
    return {
      designs: State.getters.designs
    };
  },
  render() {
    var i = 0;
    let designs = this.state.designs.map(d => {
      return (
        <li className="design" key={i++}>
          <Design design={d}/>
        </li>);
    });
    return (
      <div>
        <ul className="designs" key="ul">
          {designs}
        </ul>
        <Router.RouteHandler/>
      </div>
    );
  }
});
