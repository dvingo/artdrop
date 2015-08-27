import React from 'react'
import {RouteHandler} from 'react-router'
import Nav from './Nav'
import s from '../styles/main.scss'
import Router from 'react-router'

export default React.createClass({
  mixins: [Router.State],

  componentWillMount() {
    document.addEventListener('DOMContentLoaded', () => FastClick.attach(document.body))
  },

  render() {
    return (
      (this.isActive('designs') || this.isActive('/') || this.isActive('admin')) ?
        (<div>
           <Nav/>
           <RouteHandler/>
         </div>)
        :
        (<div>
           <RouteHandler/>
           <Nav/>
         </div>)
    )
  }
})
