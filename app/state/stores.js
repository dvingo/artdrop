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

stores.colorPalettesStore = new Nuclear.Store({
  getInitialState() {
    return Nuclear.toImmutable({});
  },

  initialize() {
   this.on('addColorPalette', function(state, colorPalette) {
     return state.set(colorPalette.id, Immutable.fromJS(colorPalette));
   })

   this.on('deleteColorPalette', (state, colorPalette) => {
     var colorPalettes = reactor.evaluate(getters.colorPalettes)
     var replacementColorPalette = colorPalettes.find(color => color.get('id') !== colorPalette.get('id'))
     layersRef.orderByChild('colorPalette').equalTo(colorPalette.get('id')).on('value', snapshot => {
       var layers = snapshot.val()
       if (layers) {
         Object.keys(layers).forEach(layerId => {
           layersRef.child(layerId).update({colorPalette: replacementColorPalette.get('id')})
         })
       }
     })
     colorPalettesRef.child(colorPalette.get('id')).remove()
     return state.remove(colorPalette.get('id'))
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

  newLayerImageObj(filename, baseImageUrl, compositeImageUrl, compositeFilename) {
    var now = new Date().getTime()
    var retVal = {
      filename: filename,
      imageUrl: baseImageUrl,
      validOrders: [0,1,2],
      createdAt: now,
      updatedAt: now}
    if (compositeImageUrl) {
      retVal.compositeImageUrl = compositeImageUrl
      retVal.compositeFilename = compositeFilename
    }
    return retVal
  },

  initialize() {
    this.on('addLayerImage', (state, layerImage) => {
      return state.set(layerImage.id, Immutable.fromJS(layerImage));
    })

    this.on('loadAdminCreateDesignData', state => {
      hydrateAndDispatchLayerImages(state)
      return state
    })

    this.on('loadAdminLayerImages', state => {
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
          var newLayerImage = this.newLayerImageObj(file.name, imageUrl)
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
              var newLayerImage = this.newLayerImageObj(baseFile.name, baseImageUrl, topImageUrl, topFile.name)
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

    this.on('deleteLayerImage', (state, layerImage) => {
      var layerImageId = layerImage.get('id')
      var designsToDelete = reactor.evaluate(['designs']).filter(d => {
        return d.get('layers').some(layer => layer.getIn(['selectedLayerImage', 'id']) === layerImageId)
      })
      designsToDelete.forEach(d => reactor.dispatch('deleteDesign', d))
      layerImagesRef.child(layerImageId).remove()
      return state.delete(layerImage.get('id'))
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
   this.on('loadCurrentDesignEditResources', state => {
     hydrateAndDispatchSurfaces(state)
     return state
   })
 }
})

export default stores
