import React from 'react';
import Router from 'react-router';
export default class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, app HERE.</h1>
        <Router.RouteHandler/>
      </div>
    );
  }
}
