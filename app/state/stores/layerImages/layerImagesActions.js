import reactor from 'state/reactor'
import Immutable from 'Immutable'
import RSVP from 'RSVP'
import {uploadImgToS3} from 'state/utils'
import {hydrateAndDispatchLayerImages} from 'state/helpers'
import {persistDeleteLayerImage, persistNewLayerImage} from 'state/persistence'
import {layerImagesRef} from 'state/firebaseRefs'

var newLayerImageObj = (filename, baseImageUrl, compositeImageUrl, compositeFilename) => {
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
}

export default {

  uploadLayerImageToS3({file, svgText}) {
    uploadImgToS3(svgText, file.name, 'image/svg+xml').then(imageUrl => {
      newLayerImage.id = persistNewLayerImage(newLayerImage)
      var layerImageImm = Immutable.fromJS(newLayerImage)
      reactor.dispatch('setLayerImage', newLayerImage)
      reactor.dispatch('layerImageUploadedSuccessfully', layerImageImm)
    }).catch(err => console.log('got err: ', err))
  },

  deleteLayerImage(layerImage) {
    var layerImageId = layerImage.get('id')
    var designsToDelete = reactor.evaluate(['designs']).filter(d => {
      return d.get('layers').some(layer => layer.getIn(['selectedLayerImage', 'id']) === layerImageId)
    })
    designsToDelete.forEach(d => reactor.dispatch('deleteDesign', d))
    persistDeleteLayerImage(layerImageId)
    reactor.dispatch('removeLayerImage', layerImageId)
  },

  uploadLayerImageWithCompositeToS3(files) {
    var {base:baseFile, top:topFile} = files
    RSVP.all([
      uploadImgToS3(baseFile, baseFile.name,  'image/svg+xml'),
      uploadImgToS3(topFile, topFile.name,  'image/svg+xml')
    ]).then(([baseImageUrl, topImageUrl]) => {
      var newLayerImage = newLayerImageObj(baseFile.name, baseImageUrl, topImageUrl, topFile.name)
      var newLayerImageRef = layerImagesRef.push(newLayerImage)
      var layerImageId = newLayerImageRef.key()
      newLayerImage.id = layerImageId
      reactor.dispatch('setLayerImage', newLayerImage)
      var layerImageImm = Immutable.fromJS(newLayerImage)
      reactor.dispatch('layerImageUploadedSuccessfully', layerImageImm)
    }).catch((err) => console.log('got err: ', err))
  }

}
