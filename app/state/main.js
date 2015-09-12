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
import errorsStore from './stores/errors'
import getters from './getters'
import {usersRef, firebaseRef} from './firebaseRefs'
import actions from './actions'

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
  tags: tagsStore,
  errors: errorsStore
})

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

module.exports = {
  getters: getters,
  actions: actions
}
