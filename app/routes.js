import App from './components/App';
import Designs from './components/Designs';
import DesignDetail from './components/Design/DesignDetail';
import DesignEdit from './components/Design/DesignEdit';
import Test from './components/Test';
import React from 'react';
import Router from 'react-router';
var Route = Router.Route;

export default (
  <Route handler={App}>
    <Router.DefaultRoute handler={Designs}/>
    <Route name="designs" handler={Designs} path="designs/?">
      <Route name="designDetail" handler={DesignDetail} path=":designId/?"/>
    </Route>
    <Route name="designEdit" handler={DesignEdit} path="/designs/:designId/edit/:step/?"/>
  </Route>
);
