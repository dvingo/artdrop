import React from 'react'
import Router from 'react-router'
import {firebaseRef} from '../state/firebaseRefs'
var Link = Router.Link
var RouteHandler = Router.RouteHandler
export default React.createClass({

  authorizeGoogle() {
    firebaseRef.authWithOAuthPopup('google', (err, data) => {
      if (err) { console.log('Login failed!', err) }
      else { console.log('login success!: ', data) }
    }, {scope:'email'})
  },

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
          <Link to="adminCreateLayerImage" style={navLinkStyle}>Upload Layer Image</Link>
          <button onClick={this.authorizeGoogle}>Login with Google</button>
        </div>
        <RouteHandler/>
      </div>
    )
  }
})
