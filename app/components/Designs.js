import React from 'react';
import Router from 'react-router';
import Design from './Design/Design';
import reactor from '../state/reactor';
import State from '../state/main';

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return { designs: State.getters.designs };
  },

  render() {
    let designs = this.state.designs.map(d => {
      return (
        <li className="design" key={d.get('id')}>
          <Design design={d}/>
        </li>);
    });

    return (
      <div className="main">
        <ul className="designs">
          {designs}
        </ul>
        <Router.RouteHandler/>
      </div>
    );
  }
});
