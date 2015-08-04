var Nuclear = require('nuclear-js');
var Immutable = Nuclear.Immutable

export default new Nuclear.Store({
  getInitialState() {
    return Immutable.List(['start', 'choose-layer', 'surface', 'layers'])
  }
})
