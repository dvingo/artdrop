import reactor from 'state/reactor'
import designsStore from 'state/stores/designs'
import currentUserStore from 'state/stores/currentUser'
import usersStore from 'state/stores/users'
import validEditStepsStore from 'state/stores/validEditSteps'
import currentDesignIdStore from 'state/stores/currentDesignId'
import colorPalettesStore from 'state/stores/colorPalettes'
import layerImagesStore from 'state/stores/layerImages'
import surfacesStore from 'state/stores/surfaces'
import layerImageUploadedStore from 'state/stores/layerImageUploaded'
import layerIsBeingReplacedStore from 'state/stores/layerIsBeingReplaced'
import currentLayerIdStore from 'state/stores/currentLayerId'
import tagsStore from 'state/stores/tags'
import errorsStore from 'state/stores/errors'
import getters from 'state/getters'
import {usersRef, firebaseRef} from 'state/firebaseRefs'
import actions from 'state/actions'

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
