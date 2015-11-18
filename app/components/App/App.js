import React from 'react'
import {RouteHandler} from 'react-router'
import Nav from 'components/Nav/Nav'
import s from 'styles/_Main.scss'
import Router from 'react-router'

export default React.createClass({
  mixins: [Router.State],

  componentWillMount() {
    document.addEventListener('DOMContentLoaded', () => FastClick.attach(document.body))
  },

  _onRouteWithTopBar() {
    return this.isActive('designs') ||
           this.isActive('/') ||
           this.isActive('admin')
  },

  render() {
    return (
      <div className="App">
          <Nav/>
          <RouteHandler/>
       </div>
    )
  }
})
