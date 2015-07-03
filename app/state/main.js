import fixtures from '../fixtures'
import reactor from './reactor'
import stores from './stores'
import {idsToObjs, hydrateDesign} from './helpers'
import getters from './getters'
import {usersRef, firebaseRef} from './firebaseRefs'
var Nuclear = require('nuclear-js')

reactor.registerStores({
  users: stores.usersStore,
  currentUser: stores.currentUserStore,
  designs: stores.designsStore,
  currentDesignId: stores.currentDesignIdStore,
  colorPalettes: stores.colorPalettesStore,
  layerImages: stores.layerImagesStore,
  currentLayerId: stores.currentLayerIdStore,
  surfaces: stores.surfacesStore,
  validEditSteps: stores.validEditSteps
})

////////////////////////////////////////////////////////////////////////////////
// Exports.
////////////////////////////////////////////////////////////////////////////////

module.exports = {
  getters: getters,
  actions: {
    selectDesignId(id) { reactor.dispatch('selectDesignId', id) },
    previousDesignColors() { reactor.dispatch('previousDesignColors') },
    nextDesignColors() { reactor.dispatch('nextDesignColors') },
    selectLayerId(id)  { reactor.dispatch('selectLayerId', id) },
    selecteLayerImageId(id) { reactor.dispatch('selectLayerImageId', id) },
    selectColorPaletteId(id) { reactor.dispatch('selectColorPaletteId', id) },
    selectSurfaceId(id) { reactor.dispatch('selectSurfaceId', id) },
    makeDesignCopy(newId) { reactor.dispatch('makeDesignCopy', newId) },
    createNewDesign(newDesign) { reactor.dispatch('createNewDesign', newDesign) },
    loadAdminCreateDesignData() { reactor.dispatch('loadAdminCreateDesignData') },
    loadAdminCreatedDesigns() { reactor.dispatch('loadAdminCreatedDesigns') },
    loadCurrentDesignEditResources() { reactor.dispatch('loadCurrentDesignEditResources') },
    createNewUser(userProps) { reactor.dispatch('createNewUser', userProps) },
    setCurrentUser(currentUser) { reactor.dispatch('setCurrentUser', currentUser) },
    logoutCurrentUser() { reactor.dispatch('logoutCurrentUser') }
  }
}

firebaseRef.onAuth(authData => {
  if (authData) {
    (usersRef.orderByChild('uid')
      .equalTo(authData.uid)
      .once('value', snapshot => {
        var users = snapshot.val()
        if (users != null) {
          var keys = Object.keys(users)
          if (keys.length > 0) {
            var userId = keys[0]
            var currentUser = users[userId]
            currentUser.id = userId
            reactor.dispatch('setCurrentUser', currentUser)
          }
        }
      }))
  } else {
    console.log("User is logged out");
  }
})
