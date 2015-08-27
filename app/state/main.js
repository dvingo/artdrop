import reactor from './reactor'
import designsStore from './stores/designs'
import currentUserStore from './stores/currentUser'
import usersStore from './stores/users'
import validEditStepsStore from './stores/validEditSteps'
import currentDesignIdStore from './stores/currentDesignId'
import colorPalettesStore from './stores/colorPalettes'
import layerImagesStore from './stores/layerImages'
import surfacesStore from './stores/surfaces'
import layerImageUploadedStore from './stores/layerImageUploaded'
import layerIsBeingReplacedStore from './stores/layerIsBeingReplaced'
import currentLayerIdStore from './stores/currentLayerId'
import tagsStore from './stores/tags'
import getters from './getters'
import {usersRef, firebaseRef} from './firebaseRefs'
var Nuclear = require('nuclear-js')


var dispatchHelper = function() {
  var args = arguments
  var interval = setInterval(() => {
    if (!reactor.__isDispatching) {
      clearInterval(interval)
      reactor.dispatch.apply(reactor, args)
    }
  }, 100)
}

reactor.registerStores({
  users: usersStore,
  currentUser: currentUserStore,
  designs: designsStore,
  currentDesignId: currentDesignIdStore,
  colorPalettes: colorPalettesStore,
  layerImages: layerImagesStore,
  layerImageUploaded: layerImageUploadedStore,
  currentLayerId: currentLayerIdStore,
  surfaces: surfacesStore,
  validEditSteps: validEditStepsStore,
  layerIsBeingReplaced: layerIsBeingReplacedStore,
  tags: tagsStore
})

////////////////////////////////////////////////////////////////////////////////
// Exports.
////////////////////////////////////////////////////////////////////////////////

module.exports = {
  getters: getters,
  actions: {
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
    selectSurfaceId(id) { dispatchHelper('selectSurfaceId', id) },
    resetSurfacesFromFixture() { dispatchHelper('resetSurfacesFromFixture') },
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
}

firebaseRef.onAuth(authData => {
  if (authData) {
    usersRef.child(authData.uid).once('value', s => {
      var existingUser = s.val()
      if (existingUser == null) {
        let userData = {
          id: authData.uid,
          name: authData.google.displayName,
          email: authData.google.email,
          isAdmin: false}
        reactor.dispatch('createNewUserAndSetAsCurrent', userData)
      } else {
        existingUser.id = s.key()
        reactor.dispatch('setCurrentUser', existingUser)
      }
    })
  } else {
    console.log("User is logged out");
  }
})
