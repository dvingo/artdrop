var Nuclear = require('nuclear-js');
var Immutable = Nuclear.Immutable
import {designPropsToIds} from '../helpers'
import getters from '../getters'
import reactor from '../reactor'
import {newId, uploadImgToS3} from '../utils'
import {designsRef, layersRef} from '../firebaseRefs'

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

export default new Nuclear.Store({

  getInitialState() {
    return Nuclear.toImmutable({});
  },

  initialize() {
   this.on('addDesign', function(state, design) {
     return state.set(design.id, Immutable.fromJS(design))
   })

   this.on('addManyDesigns', (state, designs) => {
     return designs.reduce((retVal, design) => {
       return retVal.set(design.id, Immutable.fromJS(design))
     }, state)
   })

   this.on('deleteDesign', function(state, design) {
     if (state.has(design.id)) {
       designsRef.child(d.get('id')).remove()
       return state.remove(design.get('id'))
     }
     return state
   })

   this.on('loadAdminCreatedDesigns', function(state, design) {
     if (state.count() > 2) { return state }

     var designsQuery = designsRef.orderByChild('adminCreated').equalTo(true)
     designsQuery.on('value', snapshot => {
       var data = snapshot.val()
       var designs = Object.keys(data).map(id => {
         var obj = data[id]
         obj.id = id
         return obj
       })
       reactor.dispatch('addManyDesigns', designs)
     })
     return state
   })

   this.on('nextDesignColors', (state) => {
     return transitionDesignColors('forward', state)
   })
   this.on('previousDesignColors', (state) => {
     return transitionDesignColors('backward', state)
   })

   this.on('selectLayerImage', (state, layerImage) => {
     var currentDesign = reactor.evaluate(getters.currentDesign)
     var currentLayerId = reactor.evaluate(['currentLayerId'])
     var layers = currentDesign.get('layers')
     var i = layers.findIndex(l => l.get('id') === currentLayerId)
     var newLayers = layers.update(i, v => v.set('selectedLayerImage', layerImage))
     var newDesign = currentDesign.set('layers', newLayers)
     layersRef.child(currentLayerId).update({'selectedLayerImage': layerImage.get('id')})
     return state.set(newDesign.get('id'), newDesign)
   })

   this.on('selectColorPalette', (state, colorPalette) => {
     var currentDesign = reactor.evaluate(getters.currentDesign)
     var currentLayerId = reactor.evaluate(['currentLayerId'])
     var layers = currentDesign.get('layers')
     var i = layers.findIndex(l => l.get('id') === currentLayerId)
     var newLayers = layers.update(i, v => v.set('colorPalette', colorPalette).set('paletteRotation', 0))
     var newDesign = currentDesign.set('layers', newLayers)
     layersRef.child(currentLayerId).update({'colorPalette': colorPalette.get('id')})
     return state.set(newDesign.get('id'), newDesign)
   })

   this.on('selectSurfaceId', (state, surfaceId) => {
     var currentDesign = reactor.evaluate(getters.currentDesign)
     var surfaces = reactor.evaluate(['surfaces'])
     var newDesign = currentDesign.set('surface', surfaces.get(surfaceId))
     designsRef.child(newDesign.get('id')).update({'surface':surfaceId})
     return state.set(newDesign.get('id'), newDesign)
   })

   this.on('rotateCurrentLayerColorPalette', (state) => {
     var currentDesign = reactor.evaluate(getters.currentDesign)
     var currentLayerId = reactor.evaluate(['currentLayerId'])
     var layers = currentDesign.get('layers')
     var i = layers.findIndex(l => l.get('id') === currentLayerId)
     var currentLayer = layers.get(i)
     var currentRotation = currentLayer.get('paletteRotation')
     // 0 - 3
     var nextRotation = (currentRotation + 1) % 4
     var newLayers = layers.update(i, v => v.set('paletteRotation', nextRotation))
     var newDesign = currentDesign.set('layers', newLayers)
     layersRef.child(currentLayerId).update({'paletteRotation': nextRotation})
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

   this.on('createNewDesign', (state, newDesignData) => {
     // This assumes layerImages, surfaces, and palettes already exist in firebase.
     var newDesign = newDesignData.newDesign
     var designJpgBlob = newDesignData.jpgBlob
     var imageFilename = newDesign.get('title') + '.jpg'
     uploadImgToS3(designJpgBlob, imageFilename, 'image/jpeg', (err, imgUrl) => {
       if (err) {
         console.log('got error: ', err)
       } else {
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
         design.imageUrl = imgUrl
         design.layers = layerIds
         design.surface = design.surface.id
         design.price = 2000
         design.createdAt = now
         design.updatedAt = now
         var newDesignRef = designsRef.push(design)
         design.id = newDesignRef.key()
         reactor.dispatch('addDesign', design)
       }
     }.bind(this))

     return state
   })
 }
})
