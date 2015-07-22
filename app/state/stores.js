var Nuclear = require('nuclear-js');
import {hydrateDesign, designPropsToIds, layerPropsToIds,
  hydrateAndDispatchSurfaces, hydrateAndDispatchLayerImages,
  hydrateAndDispatchColorPalettes} from './helpers'
import {firebaseRef, usersRef, designsRef, layersRef, surfacesRef,
  layerImagesRef, colorPalettesRef, credsRef} from './firebaseRefs'
import reactor from './reactor'
import getters from './getters'
import {newId, uploadImgToS3} from './utils'
var config = require('../../config')
var srcDir = config.srcDir
var s3Endpoint = config.s3Endpoint
var s3BucketName = config.s3BucketName
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
   this.on('createNewUser', (state, userProps) => {
     var {id, name, email, isAdmin} = userProps
     var newUser = this.newUserObj(name, email, isAdmin)
     usersRef.child(id).set(newUser)
     newUser.id = id
     return state.set(id, Immutable.fromJS(newUser))
   }.bind(this))

   this.on('createNewUserAndSetAsCurrent', (state, userProps) => {
     var {id, name, email, isAdmin} = userProps
     var newUser = this.newUserObj(name, email, isAdmin)
     usersRef.child(id).set(newUser)
     newUser.id = id
     reactor.dispatch('setCurrentUser', newUser)
     return state.set(id, Immutable.fromJS(newUser))
   }.bind(this))

  }
})

stores.currentUserStore = new Nuclear.Store({
  getInitialState() { return null },
  initialize() {
    this.on('setCurrentUser', (state, currentUser) => {
      return Immutable.fromJS(currentUser)
    })
    this.on('logoutCurrentUser', state => {
      firebaseRef.unauth()
      return null
    })
  }
})

stores.validEditSteps = new Nuclear.Store({
  getInitialState() {
    return Immutable.List(['start', 'choose-layer', 'surface', 'layers'])
  },
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

   this.on('createNewDesign', (state, newDesignData) => {
     // This assumes layerImages, surfaces, and palettes already exist in firebase.
     var newDesign = newDesignData.newDesign
     var designJpgBlob = newDesignData.jpgBlob
     console.log('new design: ', newDesign.get('title'))
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

   this.on('loadAdminColorPalettes', state => {
     hydrateAndDispatchColorPalettes(state)
     return state
   })

   this.on('loadCurrentDesignEditResources', state => {
     hydrateAndDispatchColorPalettes(state)
     return state
   })

   this.on('saveColorPalette', (state, colorPalette) => {
     var now = new Date().getTime()
     colorPalettesRef.child(colorPalette.get('id'))
       .update({
         colorOne: colorPalette.get('colorOne'),
         colorTwo: colorPalette.get('colorTwo'),
         colorThree: colorPalette.get('colorThree'),
         colorFour: colorPalette.get('colorFour'),
         updatedAt: now
       })
     return state.set(colorPalette.get('id'), colorPalette.set('updatedAt', now))
   })

   this.on('createNewColorPalette', (state, colorPalette) => {
     var now = new Date().getTime()
     var newColorObj = {
       colorOne: colorPalette.get('colorOne'),
       colorTwo: colorPalette.get('colorTwo'),
       colorThree: colorPalette.get('colorThree'),
       colorFour: colorPalette.get('colorFour'),
       createdAt: now,
       updatedAt: now
     }
     var newColorRef = colorPalettesRef.push(newColorObj)
     newColorObj.id = newColorRef.key()
     reactor.dispatch('addColorPalette', newColorObj)
     return state
   })

 }
})

stores.layerImageUploadedStore = new Nuclear.Store({
  getInitialState() { return null },
  initialize() {
   this.on('layerImageUploadedSuccessfully', (state, layerImage) => {
     return layerImage
   })
  }
})

stores.layerImagesStore = new Nuclear.Store({
  getInitialState() { return Nuclear.toImmutable({}) },

  newLayerImageObj(baseImageUrl, compositeImageUrl) {
    var now = new Date().getTime()
    return {
      imageUrl: baseImageUrl,
      compositeImageUrl: compositeImageUrl,
      validOrders: [0,1,2],
      createdAt: now,
      updatedAt: now}
  },

  initialize() {
    this.on('addLayerImage', (state, layerImage) => {
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

    this.on('uploadLayerImageToS3', (state, file) => {
      uploadImgToS3(file, file.name,  'image/svg+xml', (err, imageUrl) => {
        if (err) {
          console.log('got err: ', err)
        } else {
          var newLayerImage = this.newLayerImageObj(imageUrl)
          var newLayerImageRef = layerImagesRef.push(newLayerImage)
          var layerImageId = newLayerImageRef.key()
          newLayerImage.id = layerImageId
          var layerImageImm = Immutable.fromJS(newLayerImage)
          reactor.dispatch('addLayerImage', layerImageImm)
          reactor.dispatch('layerImageUploadedSuccessfully', layerImageImm)
        }
      }.bind(this))
      return state
    })

    this.on('uploadLayerImageWithCompositeToS3', (state, files) => {
      var baseFile = files.base
      var topFile = files.top
      uploadImgToS3(baseFile, baseFile.name,  'image/svg+xml', (err, baseImageUrl) => {
        if (err) {
          console.log('got err: ', err)
        } else {
          uploadImgToS3(topFile, topFile.name,  'image/svg+xml', (err, topImageUrl) => {
            if (err) {
              console.log('got err: ', err)
            } else {
              var newLayerImage = this.newLayerImageObj(baseImageUrl, topImageUrl)
              var newLayerImageRef = layerImagesRef.push(newLayerImage)
              var layerImageId = newLayerImageRef.key()
              newLayerImage.id = layerImageId
              var layerImageImm = Immutable.fromJS(newLayerImage)
              reactor.dispatch('addLayerImage', layerImageImm)
              reactor.dispatch('layerImageUploadedSuccessfully', layerImageImm)
            }
          }.bind(this))
        }
      }.bind(this))
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
