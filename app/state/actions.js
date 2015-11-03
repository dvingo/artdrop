import reactor from 'state/reactor'
import getters from 'state/getters'
import tagActions from 'state/stores/tags/tagsActions'
import designActions from 'state/stores/designs/designActions'

var dispatchHelper = function() {
  var args = arguments
  var interval = setInterval(() => {
    if (!reactor.__isDispatching) {
      clearInterval(interval)
      reactor.dispatch.apply(reactor, args)
    }
  }, 100)
}

function merge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }

  for (var property in source) {
    if (source.hasOwnProperty(property)) {
      var sourceProp = source[property]
      if (typeof sourceProp === 'object') {
        target[property] = merge(target[property], sourceProp)
        continue
      }
      target[property] = sourceProp
    }
  }

  for (var i = 2, len = arguments.length; i < len; i++) {
    merge(target, arguments[i])
  }
  return target
}

var actions = {
  selectDesignId(id) { dispatchHelper('selectDesignId', id) },
  selectDesignAndLayerId(ids) { dispatchHelper('selectDesignAndLayerId', ids) },
  previousDesignColors() { dispatchHelper('previousDesignColors') },
  nextDesignColors() { dispatchHelper('nextDesignColors') },
  selectLayerId(id)  { dispatchHelper('selectLayerId', id) },
  deleteLayerImage(layerImage) { dispatchHelper('deleteLayerImage', layerImage) },
  layerReplacementStarted() { dispatchHelper('layerReplacementStarted') },
  layerReplacementComplete() { dispatchHelper('layerReplacementComplete') },
  uploadLayerImageToS3(file) { dispatchHelper('uploadLayerImageToS3', file) },
  uploadLayerImageWithCompositeToS3(files) { dispatchHelper('uploadLayerImageWithCompositeToS3', files) },
  deleteColorPalette(colorPalette) { dispatchHelper('deleteColorPalette', colorPalette) },
  selectSurface(surface) { dispatchHelper('selectSurface', surface) },
  selectSurfaceOptionFromKeyValue(key, value) {
    dispatchHelper('selectSurfaceOptionFromKeyValue', {key:key, value:value})
  },
  updateSurface(surface) { dispatchHelper('updateSurface', surface) },
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
  addManyDesigns(designs) { reactor.dispatch('addManyDesigns', designs) },
  getShipPrice(shipData) { dispatchHelper('getShipPrice', shipData) },
  createOrder(orderData) { dispatchHelper('createOrder', orderData) },
  createError(message) { dispatchHelper('createError', message) },
  removeError(error) { dispatchHelper('removeError', error) }
}

merge(actions, tagActions, designActions)
export default actions
