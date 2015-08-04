var Nuclear = require('nuclear-js');
var Immutable = Nuclear.Immutable
import {usersRef} from '../firebaseRefs'
import reactor from '../reactor'

export default new Nuclear.Store({
  newUserObj(name, email, isAdmin) {
    var now = new Date().getTime()
    return {
      name: name,
      email: email,
      isAdmin: isAdmin,
      createdAt: now,
      updatedAt: now}
  },

  getInitialState() { return Nuclear.toImmutable({}) },

  initialize() {
   this.on('createNewUser', (state, userProps) => {
     var {id, name, email, isAdmin} = userProps
     var newUser = this.newUserObj(name, email, isAdmin)
     usersRef.child(id).set(newUser)
     newUser.id = id
     return state.set(id, Immutable.fromJS(newUser))
   }.bind(this))

   this.on('createNewUserAndSetAsCurrent', (state, userProps) => {
     var {id, name, email, isAdmin} = userProps
     var newUser = this.newUserObj(name, email, isAdmin)
     usersRef.child(id).set(newUser)
     newUser.id = id
     reactor.dispatch('setCurrentUser', newUser)
     return state.set(id, Immutable.fromJS(newUser))
   }.bind(this))

  }
})
