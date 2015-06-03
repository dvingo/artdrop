import App from './components/App';
import Designs from './components/Designs';
import DesignDetail from './components/DesignDetail';
import Test from './components/Test';
import React from 'react';
import Router from 'react-router';
var Route = Router.Route;

export default (
  <Route handler={App}>
    <Route name="designs" handler={Designs} path="designs/?">
      <Route name="test" handler={Test} path="test/?"/>
      <Route name="designDetail" handler={DesignDetail} path=":designId/?"/>
    </Route>
  </Route>
);
