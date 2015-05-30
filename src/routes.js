import App from './components/App';
import Designs from './components/Designs';
import Design from './components/Design';
import React from 'react';
import Router from 'react-router';
var Route = Router.Route;

export default (
  <Route handler={App}>

    <Route handler={Designs} path="designs">
      <Route handler={Design} path=":id" />
    </Route>

  </Route>
);
