var Nuclear = require('nuclear-js');
var Immutable = Nuclear.Immutable
import reactor from '../reactor'
import {uploadImgToS3} from '../utils'
import {layerImagesRef} from '../firebaseRefs'
import {hydrateAndDispatchLayerImages} from '../helpers'

export default new Nuclear.Store({
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

    this.on('addManyLayerImages', (state, layerImages) => {
      return layerImages.reduce((retVal, layerImage) => {
        return retVal.set(layerImage.id, Immutable.fromJS(layerImage))
      }, state)
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
