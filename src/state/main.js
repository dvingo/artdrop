import fixtures from '../fixtures';
import reactor from './reactor';
var Nuclear = require('nuclear-js');


var designsStore = new Nuclear.Store({
  getInitialState() {
    return Nuclear.toImmutable(fixtures.designs);
  }
});

var currentDesignStore = new Nuclear.Store({
  getInitialState() {
    return Nuclear.toImmutable({});
  }
});

reactor.registerStores({
  designs: designsStore,
  currentDesign: currentDesignStore
});

module.exports = {
  getters: {
    designs: ['designs'],
    currentDesign: ['currentDesign']
  }
}
