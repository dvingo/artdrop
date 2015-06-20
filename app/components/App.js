import React from 'react'
import Router from 'react-router'
import Nav from './Nav'
import s from '../styles/main.scss'
import {iconPath} from '../utils'

export default React.createClass({
  render() {
    return (
      <div>
        <Nav/>
        <Router.RouteHandler/>
      </div>
    );
  }
})
