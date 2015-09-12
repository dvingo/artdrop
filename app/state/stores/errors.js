var Nuclear = require('nuclear-js');
var Immutable = Nuclear.Immutable
import {errorsRef} from '../firebaseRefs'
import reactor from '../reactor'

function persistError(error) {
  var errorId = error.id
  delete error.id
  errorsRef.child(errorId).set(error)
}

export default new Nuclear.Store({
  getInitialState() { return Nuclear.toImmutable({}) },

  initialize() {
    this.on('addError', (state, error) => {
      var immutableError = Immutable.fromJS(error)
      persistError(error)
      return state.set(error.id, immutableError);
    })
  }
})
