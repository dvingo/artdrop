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
    var onDesignEdit = (this.isActive('designEdit') || this.isActive('layerEdit'))

    return (
        onDesignEdit ? (
          <div>
            <RouteHandler/>
            <Nav/>
          </div>
        ) : (
          <div>
            <Nav/>
            <RouteHandler/>
          </div>
        ) 
    )
  }
})
