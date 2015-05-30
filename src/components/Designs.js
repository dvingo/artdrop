import React from 'react';
import Router from 'react-router';
import AppState from '../state.js';
import Design from './Design';

var getDesigns = () => AppState.getDesigns();

export default class Designs extends React.Component {
  render() {
    let designs = getDesigns().map(d => <Design design={d} />);
    return (
      <ul className="designs">
        {designs}
        <Router.RouteHandler/>
      </ul>
    );
  }
}
/*
<ul class="designs">
  {{#each design in designs}}
    <li class="design">
      {{#link-to 'designs.show' design}}
        {{partial 'designs/canvas'}}
      {{/link-to}}
    </li>
  {{else}}
    You have no designs {{link-to 'create one!' 'designs.new'}}
  {{/each}}
</ul>
*/
