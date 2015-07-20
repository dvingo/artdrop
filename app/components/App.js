import React from 'react'
import {RouteHandler} from 'react-router'
import Nav from './Nav'
import s from '../styles/main.scss'

export default React.createClass({
  componentWillMount() {
    document.addEventListener('DOMContentLoaded', () => FastClick.attach(document.body))
  },
  render() {
    return (
      <div>
        <Nav/>
        <RouteHandler/>
      </div>
    )
  }
})
