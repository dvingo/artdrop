import React from 'react'
import Router from 'react-router'
import reactor from 'state/reactor'
import Store from 'state/main'
import Immutable from 'Immutable'

export default React.createClass({
  getDefaultProps() {
    return {
      tag: Immutable.Map(),
      onRemoveTag: () => null
    }
  },

  render() {
    return (
      <div className="Tag">
        <span>
          {this.props.tag.get('name')}
        </span>
        <span className="remove">X</span>
      </div>
    )
  }
})
