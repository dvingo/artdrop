var Nuclear = require('nuclear-js');
var Immutable = Nuclear.Immutable
import {firebaseRef, usersRef} from '../firebaseRefs'

export default new Nuclear.Store({
  getInitialState() { return null },

  initialize() {

    this.on('setCurrentUser', (state, currentUser) => {
      return Immutable.fromJS(currentUser)
    })

    this.on('logoutCurrentUser', state => {
      firebaseRef.unauth()
      return null
    })
  }

})
