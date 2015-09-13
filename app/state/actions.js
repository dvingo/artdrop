import reactor from './reactor'

var dispatchHelper = function() {
  var args = arguments
  var interval = setInterval(() => {
    if (!reactor.__isDispatching) {
      clearInterval(interval)
      reactor.dispatch.apply(reactor, args)
    }
  }, 100)
}

export default {
  selectDesignId(id) { dispatchHelper('selectDesignId', id) },
  selectDesignAndLayerId(ids) { dispatchHelper('selectDesignAndLayerId', ids) },
  previousDesignColors() { dispatchHelper('previousDesignColors') },
  nextDesignColors() { dispatchHelper('nextDesignColors') },
  selectLayerId(id)  { dispatchHelper('selectLayerId', id) },
  selectLayerImage(layerImage) { dispatchHelper('selectLayerImage', layerImage) },
  deleteLayerImage(layerImage) { dispatchHelper('deleteLayerImage', layerImage) },
  toggleCurrentLayer() { dispatchHelper('toggleCurrentLayer')},
  layerReplacementStarted() { dispatchHelper('layerReplacementStarted') },
  layerReplacementComplete() { dispatchHelper('layerReplacementComplete') },
  uploadLayerImageToS3(file) { dispatchHelper('uploadLayerImageToS3', file) },
  uploadLayerImageWithCompositeToS3(files) { dispatchHelper('uploadLayerImageWithCompositeToS3', files) },
  selectColorPalette(colorPalette) { dispatchHelper('selectColorPalette', colorPalette) },
  deleteColorPalette(colorPalette) { dispatchHelper('deleteColorPalette', colorPalette) },
  selectSurface(surface) { dispatchHelper('selectSurface', surface) },
  selectSurfaceOptionFromKeyValue(key, value) {
    dispatchHelper('selectSurfaceOptionFromKeyValue', {key:key, value:value})
  },
  updateSurface(surface) { dispatchHelper('updateSurface', surface) },
  resetSurfacesFromFixture() { dispatchHelper('resetSurfacesFromFixture') },
  loadSurfaces() { dispatchHelper('loadSurfaces') },
  makeDesignCopy(newId) { dispatchHelper('makeDesignCopy', newId) },
  createNewDesign(newDesign) { dispatchHelper('createNewDesign', newDesign) },
  saveDesign(design) { dispatchHelper('saveDesign', design) },
  updateDesign(designData) { dispatchHelper('updateDesign', designData) },
  deleteDesign(design) { dispatchHelper('deleteDesign', design) },
  loadAdminCreateDesignData() { dispatchHelper('loadAdminCreateDesignData') },
  loadAdminCreatedDesigns() { dispatchHelper('loadAdminCreatedDesigns') },
  loadAdminColorPalettes() { dispatchHelper('loadAdminColorPalettes') },
  loadAdminLayerImages() { dispatchHelper('loadAdminLayerImages') },
  loadCurrentDesignEditResources() { dispatchHelper('loadCurrentDesignEditResources') },
  createNewUser(userProps) { dispatchHelper('createNewUser', userProps) },
  createNewUserAndSetAsCurrent(userProps) { dispatchHelper('createNewUserAndSetAsCurrent', userProps) },
  setCurrentUser(currentUser) { dispatchHelper('setCurrentUser', currentUser) },
  logoutCurrentUser() { dispatchHelper('logoutCurrentUser') },
  saveColorPalette(colorPalette) { dispatchHelper('saveColorPalette', colorPalette) },
  createNewColorPalette(colorPalette) { dispatchHelper('createNewColorPalette', colorPalette) },
  rotateCurrentLayerColorPalette() { dispatchHelper('rotateCurrentLayerColorPalette') },
  createTag(newTagName) { dispatchHelper('createTag', newTagName) },
  loadAdminTags() { dispatchHelper('loadAdminTags') },
  addDesignsToTag(data) { dispatchHelper('addDesignsToTag', data) },
  addManyTags(tags) { dispatchHelper('addManyTags', tags) },
  addManyDesigns(designs) { dispatchHelper('addManyDesigns', designs) }
}
