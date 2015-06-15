var Nuclear = require('nuclear-js');
import {hydrateDesign} from './helpers'
import {designsRef} from './firebaseRefs'
import reactor from './reactor'
import getters from './getters'

var stores = {}

stores.designsStore = new Nuclear.Store({

  getInitialState() {
    return Nuclear.toImmutable({});
  },

  initialize() {
   this.on('addDesign', function(state, design) {
     if (!state.has(design.id)) {
       return state.set(design.id, Nuclear.Immutable.fromJS(design));
     }
     return state
   });

   this.on('nextDesignColors', (state) => {
     var allPalettes = reactor.evaluate(getters.colorPalettes)
     var currentDesign = reactor.evaluate(getters.currentDesign)
     var layers = currentDesign.get('layers').map(layer => {
       var index = allPalettes.findIndex(c => c.get('id') === layer.getIn(['colorPalette', 'id']))
       var newPalette = allPalettes.get((index + 1) % allPalettes.count())
       return layer.set('colorPalette', newPalette)
     })
     var newDesign = currentDesign.set('layers', layers)
     return state.set(newDesign.get('id'), newDesign)
   })

   this.on('selectLayerImageId', (state, layerImageId) => {
     var currentDesign = reactor.evaluate(getters.currentDesign)
     var currentLayerId = reactor.evaluate(['currentLayerId'])
     var layerImages = reactor.evaluate(['layerImages'])
     var layers = currentDesign.get('layers')
     var i = layers.findIndex(l => l.get('id') === currentLayerId)
     var newLayers = layers.update(i, v => v.set('selectedLayerImage', layerImages.get(layerImageId)))
     var newDesign = currentDesign.set('layers', newLayers)
     return state.set(newDesign.get('id'), newDesign)
   })

 }
})

stores.currentDesignIdStore = new Nuclear.Store({
  getInitialState() { return '' },

  initialize() {
    this.on('selectDesignId', (state, designId) => {
      var designs = reactor.evaluate(getters.designs)
      if (!designs.has(designId)) {
        designsRef.child(designId).on('value', (design) => {
          design = design.val()
          design.id = designId
          hydrateDesign(design)
        })
      }
      return designId
    })
  }
})

stores.colorPalettesStore = new Nuclear.Store({
  getInitialState() {
    return Nuclear.toImmutable({});
  },

  initialize() {
   this.on('addColorPalette', function(state, colorPalette) {
     return state.set(colorPalette.id, Nuclear.Immutable.fromJS(colorPalette));
   })
 }
})

stores.layerImagesStore = new Nuclear.Store({
  getInitialState() {
    return Nuclear.toImmutable({});
  },

  initialize() {
   this.on('addLayerImage', function(state, layerImage) {
     return state.set(layerImage.id, Nuclear.Immutable.fromJS(layerImage));
   })
 }
})

stores.currentLayerIdStore = new Nuclear.Store({
  getInitialState() { return '' },

  initialize() {
    this.on('selectLayerId', (state, layerId) => layerId)
  }
})

export default stores
