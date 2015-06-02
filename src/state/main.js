import fixtures from '../fixtures';
import reactor from './reactor';
var Map = require('immutable').Map
var Nuclear = require('nuclear-js');
//var designsRef = new Firebase("https://glaring-fire-8101.firebaseio.com/designs");
//designsRef.once('value', function(designs) { window.designs = designs.val(); });


var idsToObjs = (ids, dataSrc) => {
  if (Array.isArray(ids)) {
    return ids.map(k => {
      var o = dataSrc[k];
      o.id = k;
      return o;
    });
  } else {
      var o = dataSrc[ids];
      o.id = ids;
      return o;
  }
}

var firebaseRef = new Firebase("https://glaring-fire-8101.firebaseio.com");
firebaseRef.once('value', data => {
  var data = data.val();
  
  var designs = idsToObjs(Object.keys(data.designs), data.designs);
  designs.map( d => {
    var layers = idsToObjs(Object.keys(d.layers), data.layers).map( l => {
      l.selectedLayerImage = idsToObjs(l.selectedLayerImage, data.layerImages);
      return l;
    });
    d.layers = layers;
    return d;
  }).map(d => reactor.dispatch('addDesign', d));
});

var designsStore = new Nuclear.Store({
  getInitialState() {
    return Nuclear.toImmutable([]);
  },
  initialize() {
   this.on('addDesign', function(state, design) {
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
