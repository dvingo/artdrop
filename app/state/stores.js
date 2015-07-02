var Nuclear = require('nuclear-js');
import {hydrateDesign, designPropsToIds, layerPropsToIds,
  hydrateAndDispatchSurfaces, hydrateAndDispatchLayerImages,
  hydrateAndDispatchColorPalettes} from './helpers'
import {usersRef, designsRef, layersRef, surfacesRef,
  layerImagesRef} from './firebaseRefs'
import reactor from './reactor'
import getters from './getters'
import {newId} from './utils'
var Immutable = Nuclear.Immutable

var stores = {}

stores.usersStore = new Nuclear.Store({

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
   this.on('createNewUser', function(state, userProps) {
     var {name, email, isAdmin} = userProps
     var newUser = this.newUserObj(name, email, isAdmin)
     var newUserRef = usersRef.push(newUser)
     newUser.id = newUserRef.key()
     return state.set(newUser.id, Immutable.fromJS(newUser))
   }.bind(this))
  }
})

var transitionDesignColors = (direction, state) => {
   var allPalettes = reactor.evaluate(getters.colorPalettes)
   var currentDesign = reactor.evaluate(getters.currentDesign)
   var layers = currentDesign.get('layers').map(layer => {
     var index = allPalettes.findIndex(c => c.get('id') === layer.getIn(['colorPalette', 'id']))
     var newPalette;
     if (direction === 'forward') {
       newPalette = allPalettes.get((index + 1) % allPalettes.count())
     } else if (direction === 'backward') {
       newPalette = allPalettes.get((index - 1) % allPalettes.count())
     }
     layersRef.child(layer.get('id')).update({'colorPalette':newPalette.get('id')})
     return layer.set('colorPalette', newPalette)
   })
   var newDesign = currentDesign.set('layers', layers)
   return state.set(newDesign.get('id'), newDesign)
}

stores.designsStore = new Nuclear.Store({

  getInitialState() {
    return Nuclear.toImmutable({});
  },

  initialize() {
   this.on('addDesign', function(state, design) {
     if (!state.has(design.id)) {
       return state.set(design.id, Immutable.fromJS(design));
     }
     return state
   })

   this.on('loadAdminCreatedDesigns', function(state, design) {
     var designsQuery = designsRef.orderByChild('adminCreated').equalTo(true)
     designsQuery.on('child_added', snapshot => {
       var id = snapshot.key()
       if (!state.has(id)) {
         var design = snapshot.val()
         design.id = id
         hydrateDesign(design)
       }
     })
     return state
   })

   this.on('nextDesignColors', (state) => {
     return transitionDesignColors('forward', state)
   })
   this.on('previousDesignColors', (state) => {
     return transitionDesignColors('backward', state)
   })

   this.on('selectLayerImageId', (state, layerImageId) => {
     var currentDesign = reactor.evaluate(getters.currentDesign)
     var currentLayerId = reactor.evaluate(['currentLayerId'])
     var layerImages = reactor.evaluate(['layerImages'])
     var layers = currentDesign.get('layers')
     var i = layers.findIndex(l => l.get('id') === currentLayerId)
     var newLayers = layers.update(i, v => v.set('selectedLayerImage', layerImages.get(layerImageId)))
     var newDesign = currentDesign.set('layers', newLayers)
     layersRef.child(currentLayerId).update({'selectedLayerImage':layerImageId})
     return state.set(newDesign.get('id'), newDesign)
   })

   this.on('selectColorPaletteId', (state, colorPaletteId) => {
     var currentDesign = reactor.evaluate(getters.currentDesign)
     var currentLayerId = reactor.evaluate(['currentLayerId'])
     var colorPalettes = reactor.evaluate(['colorPalettes'])
     var colorPalette = colorPalettes.get(colorPaletteId)
     var layers = currentDesign.get('layers')
     var i = layers.findIndex(l => l.get('id') === currentLayerId)
     var newLayers = layers.update(i, v => v.set('colorPalette', colorPalette))
     var newDesign = currentDesign.set('layers', newLayers)
     layersRef.child(currentLayerId).update({'colorPalette':colorPalette.get('id')})
     return state.set(newDesign.get('id'), newDesign)
   })

   this.on('selectSurfaceId', (state, surfaceId) => {
     var currentDesign = reactor.evaluate(getters.currentDesign)
     var surfaces = reactor.evaluate(['surfaces'])
     var newDesign = currentDesign.set('surface', surfaces.get(surfaceId))
     designsRef.child(newDesign.get('id')).update({'surface':surfaceId})
     return state.set(newDesign.get('id'), newDesign)
   })

   this.on('makeDesignCopy', (state, newDesignId) => {
     var currentDesign = reactor.evaluate(getters.currentDesign)
     var newDesign = currentDesign.update(d => {
       var newLayers = d.get('layers').map(l => l.set('id', newId()))
       newLayers.forEach(layer => {
         var l = layer.toJS()
         l.colorPalette = l.colorPalette.id
         l.selectedLayerImage = l.selectedLayerImage.id
         layersRef.child(l.id).set(l)
       })
       var now = new Date().getTime()
       return d.withMutations(d2 => {
         d2.set('id', newDesignId)
           .set('adminCreated', false)
           .set('layers', newLayers)
           .set('createdAt', now)
           .set('updatedAt', now)
       })
     })
     var firebaseDesign = designPropsToIds(newDesign)
     designsRef.child(newDesignId).set(firebaseDesign.toJS())
     return state.set(newDesignId, newDesign)
   })

   this.on('createNewDesign', (state, newDesign) => {
     // This assumes layerImages, surfaces, and palettes already exist in firebase.
     var now = new Date().getTime()
     var design = newDesign.toJS()
     var layerIds = design.layers.map((layer, i) => {
       layer.order = i
       layer.colorPalette = layer.colorPalette.id
       layer.selectedLayerImage = layer.selectedLayerImage.id
       layer.createdAt = now
       layer.updatedAt = now
       layer.layerImages = reactor.evaluate(getters.layerImageIds).toJS()
       var newLayerRef = layersRef.push(layer)
       return newLayerRef.key()
     })
     design.layers = layerIds
     design.surface = design.surface.id
     design.price = 2000
     design.createdAt = now
     design.updatedAt = now
     designsRef.push(design)
     return state
   })

 }
})

stores.currentDesignIdStore = new Nuclear.Store({
  getInitialState() { return '' },

  initialize() {
    this.on('selectDesignId', (state, designId) => {
      var designs = reactor.evaluate(['designs'])
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
     return state.set(colorPalette.id, Immutable.fromJS(colorPalette));
   })

   this.on('loadAdminCreateDesignData', state => {
     hydrateAndDispatchColorPalettes(state)
     return state
   })

   this.on('loadCurrentDesignEditResources', state => {
     hydrateAndDispatchColorPalettes(state)
     return state
   })
 }
})

stores.layerImagesStore = new Nuclear.Store({
  getInitialState() { return Nuclear.toImmutable({}); },
  initialize() {
   this.on('addLayerImage', function(state, layerImage) {
     return state.set(layerImage.id, Immutable.fromJS(layerImage));
   })

   this.on('loadAdminCreateDesignData', state => {
     hydrateAndDispatchLayerImages(state)
     return state
   })

   this.on('loadCurrentDesignEditResources', state => {
     hydrateAndDispatchLayerImages(state)
     return state
   })
 }
})

stores.currentLayerIdStore = new Nuclear.Store({
  getInitialState() { return '' },
  initialize() {
    this.on('selectLayerId', (state, layerId) => layerId)
  }
})

stores.surfacesStore = new Nuclear.Store({
  getInitialState() { return Nuclear.toImmutable({}) },
  initialize() {
   this.on('addSurface', function(state, surface) {
     return state.set(surface.id, Immutable.fromJS(surface))
   })

   this.on('loadAdminCreateDesignData', state => {
     hydrateAndDispatchSurfaces(state)
     return state
   })
 }
})

export default stores
