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
    selectDesignId(id) { reactor.dispatch('selectDesignId', id) },
    selectDesignAndLayerId(ids) { reactor.dispatch('selectDesignAndLayerId', ids) },
    previousDesignColors() { reactor.dispatch('previousDesignColors') },
    nextDesignColors() { reactor.dispatch('nextDesignColors') },
    selectLayerId(id)  { reactor.dispatch('selectLayerId', id) },
    selectLayerImage(layerImage) { reactor.dispatch('selectLayerImage', layerImage) },
    deleteLayerImage(layerImage) { reactor.dispatch('deleteLayerImage', layerImage) },
    toggleCurrentLayer() { reactor.dispatch('toggleCurrentLayer')},
    layerReplacementStarted() { reactor.dispatch('layerReplacementStarted') },
    layerReplacementComplete() { reactor.dispatch('layerReplacementComplete') },
    uploadLayerImageToS3(file) { reactor.dispatch('uploadLayerImageToS3', file) },
    uploadLayerImageWithCompositeToS3(files) { reactor.dispatch('uploadLayerImageWithCompositeToS3', files) },
    selectColorPalette(colorPalette) { reactor.dispatch('selectColorPalette', colorPalette) },
    deleteColorPalette(colorPalette) { reactor.dispatch('deleteColorPalette', colorPalette) },
    selectSurfaceId(id) { reactor.dispatch('selectSurfaceId', id) },
    makeDesignCopy(newId) { reactor.dispatch('makeDesignCopy', newId) },
    createNewDesign(newDesign) { reactor.dispatch('createNewDesign', newDesign) },
    saveDesign(design) { reactor.dispatch('saveDesign', design) },
    updateDesign(designData) { reactor.dispatch('updateDesign', designData) },
    deleteDesign(design) { reactor.dispatch('deleteDesign', design) },
    loadAdminCreateDesignData() { reactor.dispatch('loadAdminCreateDesignData') },
    loadAdminCreatedDesigns() { reactor.dispatch('loadAdminCreatedDesigns') },
    loadAdminColorPalettes() { reactor.dispatch('loadAdminColorPalettes') },
    loadAdminLayerImages() { reactor.dispatch('loadAdminLayerImages') },
    loadCurrentDesignEditResources() { reactor.dispatch('loadCurrentDesignEditResources') },
    createNewUser(userProps) { reactor.dispatch('createNewUser', userProps) },
    createNewUserAndSetAsCurrent(userProps) { reactor.dispatch('createNewUserAndSetAsCurrent', userProps) },
    setCurrentUser(currentUser) { reactor.dispatch('setCurrentUser', currentUser) },
    logoutCurrentUser() { reactor.dispatch('logoutCurrentUser') },
    saveColorPalette(colorPalette) { reactor.dispatch('saveColorPalette', colorPalette) },
    createNewColorPalette(colorPalette) { reactor.dispatch('createNewColorPalette', colorPalette) },
    rotateCurrentLayerColorPalette() { reactor.dispatch('rotateCurrentLayerColorPalette') },
    createTag(newTagName) { reactor.dispatch('createTag', newTagName) },
    loadAdminTags() { reactor.dispatch('loadAdminTags') },
    addDesignsToTag(data) { reactor.dispatch('addDesignsToTag', data) },
    addManyTags(tags) { reactor.dispatch('addManyTags', tags) },
    addManyDesigns(designs) { reactor.dispatch('addManyDesigns', designs) }
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
        var interval = setInterval(() => {
          if (!reactor.__isDispatching) {
            clearInterval(interval)
            reactor.dispatch('createNewUserAndSetAsCurrent', userData)
          }
        }, 100)
       
      } else {
        existingUser.id = s.key()
        var interval = setInterval(() => {
          if (!reactor.__isDispatching) {
            clearInterval(interval)
            reactor.dispatch('setCurrentUser', existingUser)
          }
        }, 100)
      }
    })
  } else {
    console.log("User is logged out");
  }
})
