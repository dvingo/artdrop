import React from 'react';
import Router from 'react-router';
import AppState from '../state.js';
import Design from './Design';

var getDesigns = () => AppState.getDesigns();

export default class Designs extends React.Component {
  render() {
    let designs = getDesigns().map(d => <li className="design"><Design design={d}/></li>);
    return (
      <ul className="designs">
        {designs}
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
