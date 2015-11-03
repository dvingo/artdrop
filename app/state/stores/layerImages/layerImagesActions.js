import reactor from 'state/reactor'
import {uploadImgToS3} from 'state/utils'
import {persistDeleteLayerImage,
  persistNewLayerImage, hydrateAndDispatchLayerImages} from 'state/helpers'

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

  loadAdminCreateDesignData() {
    hydrateAndDispatchLayerImages()
  },

  loadAdminLayerImages() {
    hydrateAndDispatchLayerImages()
  },

  loadCurrentDesignEditResources() {
    hydrateAndDispatchLayerImages()
  },

  uploadLayerImageToS3(fileData) {
    var file = fileData.file
    var svgText = fileData.svgText
    uploadImgToS3(svgText, file.name,  'image/svg+xml', (err, imageUrl) => {
      if (err) {
        console.log('got err: ', err)
      } else {
        var newLayerImage = newLayerImageObj(file.name, imageUrl)
        newLayerImage.id = persistNewLayerImage(newLayerImage)
        var layerImageImm = Immutable.fromJS(newLayerImage)
        reactor.dispatch('setLayerImage', newLayerImage)
        reactor.dispatch('layerImageUploadedSuccessfully', layerImageImm)
      }
    })
  },

  deleteLayerImage(layerImage) {
    var layerImageId = layerImage.get('id')
    var designsToDelete = reactor.evaluate(['designs']).filter(d => {
      return d.get('layers').some(layer => layer.getIn(['selectedLayerImage', 'id']) === layerImageId)
    })
    designsToDelete.forEach(d => reactor.dispatch('deleteDesign', d))
    persistDeleteLayerImage(layerImageId)
    reactor.dispatch('removeLayerImage', layerImageId)
  }

}
