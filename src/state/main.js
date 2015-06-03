import fixtures from '../fixtures';
import reactor from './reactor';
var Nuclear = require('nuclear-js');
var allData = null;

var idsToObjs = (ids, dataSrc) => {
  var setupObj = (k) => {
    var o = dataSrc[k];
    o.id = k;
    return o;
  }
  return Array.isArray(ids) ? ids.map(setupObj)
                            : setupObj(ids);
}

var hydrateDesignById = (designId) => {
  var design = idsToObjs(designId, allData.designs);
  var layers = idsToObjs(Object.keys(design.layers), allData.layers).map(l => {
    l.selectedLayerImage = idsToObjs(l.selectedLayerImage, allData.layerImages);
    return l;
  });
  design.layers = layers;
  return design;
}

var firebaseRef = new Firebase("https://glaring-fire-8101.firebaseio.com");
firebaseRef.once('value', data => {
  allData = data.val();
  var designIds = Object.keys(allData.designs);
  designIds.map(hydrateDesignById)
           .forEach(d => reactor.dispatch('addDesign', d));
});

var designsStore = new Nuclear.Store({
  getInitialState() {
    return Nuclear.toImmutable({});
  },
  initialize() {
   this.on('addDesign', function(state, design) {
     return state.set(design.id, Nuclear.Immutable.fromJS(design));
   });
 }
});

var currentDesignIdStore = new Nuclear.Store({
  getInitialState() {
    return '';
  },
  initialize() {
    this.on('selectDesignId', function(state, designId) {
      return designId;
    });
  }
});

reactor.registerStores({
  designs: designsStore,
  currentDesignId: currentDesignIdStore
});

module.exports = {

  getters: {
    designs: [['designs'], designsMap => designsMap.toList()],
    currentDesign: [
      ['currentDesignId'],
      ['designs'],
      (currentDesignId, designsMap) => designsMap.get(currentDesignId)
    ]
  },

  actions: {
    selectDesignId(id) { reactor.dispatch('selectDesignId', id); }
  }
}
