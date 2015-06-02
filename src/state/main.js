import fixtures from '../fixtures';
import reactor from './reactor';
var Map = require('immutable').Map
var Nuclear = require('nuclear-js');
//var designsRef = new Firebase("https://glaring-fire-8101.firebaseio.com/designs");
//designsRef.once('value', function(designs) { window.designs = designs.val(); });


var idsToObjs = (ids, dataSrc) => {
  return ids.map(k => {
    var o = dataSrc[k];
    o.id = k;
    return o;
  });
}

var firebaseRef = new Firebase("https://glaring-fire-8101.firebaseio.com");
firebaseRef.once('value', data => {
  var data = data.val();
  
  var designs = idsToObjs(Object.keys(data.designs), data.designs);
  designs.map( d => {
    var layers = idsToObjs(Object.keys(d.layers), data.layers);
    d.layers = layers;
    return d;
  }).map(d => reactor.dispatch('addDesign', d));

  var designs = idsToObjs('designs', data);
});

var designsStore = new Nuclear.Store({
  getInitialState() {
    return Nuclear.toImmutable([]);
  },
  initialize() {
   this.on('addDesign', function(state, design) {
     console.log('HANDLING ADD DESIGN');
     return state.push(Map(design));
   });
 }
});

reactor.registerStores({
  designs: designsStore
});

module.exports = {
  getters: {
    designs: ['designs']
  }
}
