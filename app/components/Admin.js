import React from 'react'
import {Link, RouteHandler} from 'react-router'
import reactor from '../state/reactor'
import Store from '../state/main'
import {firebaseRef} from '../state/firebaseRefs'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {currentUser: ['currentUser']}
  },

  authorizeGoogle() {
    firebaseRef.authWithOAuthPopup('google', (err, data) => {
      if (err) { console.log('Login failed!', err) }
      else { console.log('login success!: ', data) }
    },
    {scope:'email'})
  },

  logoutCurrentUser() {
    Store.actions.logoutCurrentUser()
  },

  render() {
    var navBarStyle = {
      border: '1px solid',
      padding: '20px 0'
    }
    var navLinkStyle = {
      margin: '0 10px'
    }
    if (this.state.currentUser && this.state.currentUser.get('isAdmin')) {
      return (
        <div className="admin">
          <div className="admin-nav-bar" style={navBarStyle}>
            {/*<Link to="adminUsers" style={navLinkStyle}>Edit Users</Link>*/}
            <Link to="adminTags" style={navLinkStyle}>Tags</Link>
            <Link to="adminColorPalettes" style={navLinkStyle}>Color Palettes</Link>
            <Link to="adminDesigns" style={navLinkStyle}>Designs</Link>
            <Link to="adminCreateDesign" style={navLinkStyle}>Create Design</Link>
            <Link to="adminCreateLayerImage" style={navLinkStyle}>Upload Layer Image</Link>
            <Link to="adminLayerImages" style={navLinkStyle}>Layer Images</Link>
            <Link to="adminSurfaces" style={navLinkStyle}>Surfaces</Link>
            <button onClick={this.logoutCurrentUser}>Logout</button>
          </div>
          <RouteHandler/>
        </div>
      )
    } else {
      return (
        <div className="admin">
          <div className="admin-nav-bar" style={navBarStyle}>
            <button onClick={this.authorizeGoogle}>Login with Google</button>
          </div>
          <p>You must be an admin to continue</p>
        </div>
      )
    }
  }
})
