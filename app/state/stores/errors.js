var Nuclear = require('nuclear-js');
var Immutable = Nuclear.Immutable
import {newId} from '../utils'

export default new Nuclear.Store({

  getInitialState() { return Nuclear.toImmutable({}) },

  initialize() {

    this.on('createError', (state, errorMessage) => {
      var id = newId()
      return state.set(id, Immutable.fromJS({id:id, message:errorMessage}))
    })

    this.on('removeError', (state, error) => (
      state.remove(error.get('id'))
    ))

  }
})
