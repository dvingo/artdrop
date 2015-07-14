import React from 'react'
import Router from 'react-router'
import Store from '../../state/main'
import Notification from '../Notification'

export default React.createClass({

  getInitialState() {
    return {name: null,
            email: null,
            isAdmin: false,
            errors: [],
            messages: []}
  },

  createNewUser(e) {
    e.preventDefault()
    var {name, email, isAdmin} = this.state
    var errors = []
    var messages = []
    if (name == null) {
      errors.push('You must enter a name!') }

    if (email == null) {
      errors.push('You must enter an email!') }

    if (errors.length === 0 ) {
      var userObj = {}
      userObj.name = name
      userObj.email = email
      userObj.isAdmin = isAdmin
      Store.actions.createNewUser(userObj)
      messages.push('User successfully created.')
    }
    this.setState({errors: errors, messages:messages})
  },

  updateStringProp(prop, e) {
    var obj = {}
    obj[prop] = e.target.value
    this.setState(obj)
  },

  render() {
    var errors = this.state.errors.map(e => {
      return <p style={{background:'#E85672'}}>{e}</p>
    })

    var messages = this.state.messages.map(m => {
      return <Notification message={m}
                 onClose={() => this.setState({messages:[]})}/>
    })
    return (
      <div className="admin-users">
        <p>Users will be here</p>
        {this.state.errors.length > 0 ? <div>{errors}</div> : null}
        {this.state.messages.length > 0 ? <div>{messages}</div> : null}
      </div>
    )
  }
})
