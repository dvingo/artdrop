import React from 'react'
import Router from 'react-router'
import reactor from '../state/reactor'
import Store from '../state/main'
import ColorPalette from './ColorPalette'
var Link = Router.Link
var RouteHandler = Router.RouteHandler
export default React.createClass({
  render() {
    var navBarStyle = {
      border: '1px solid'
    }
    var navLinkStyle = {
      margin: '0 10px'
    }
    return (
      <div className="admin">
        <div className="admin-nav-bar" style={navBarStyle}>
          <Link to="adminDesigns" style={navLinkStyle}>All Designs</Link>
          <Link to="adminCreateDesign" style={navLinkStyle}>Create Design</Link>
        </div>
        <RouteHandler/>
      </div>
    )
  }
})
