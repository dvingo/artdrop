import fixtures from '../fixtures'
import reactor from './reactor'
import stores from './stores'
import {idsToObjs, hydrateDesign} from './helpers'
import getters from './getters'
import {usersRef, firebaseRef} from './firebaseRefs'
var Nuclear = require('nuclear-js')

reactor.registerStores({
  users: stores.usersStore,
  designs: stores.designsStore,
  currentDesignId: stores.currentDesignIdStore,
  colorPalettes: stores.colorPalettesStore,
  layerImages: stores.layerImagesStore,
  currentLayerId: stores.currentLayerIdStore,
  surfaces: stores.surfacesStore
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
    createNewUser(userProps) { reactor.dispatch('createNewUser', userProps) }
  }
}

firebaseRef.onAuth(authData => {
  if (authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
    console.log('All data: ', authData)
    // TODO at this point we look up the user in the DB if they exist, we set app state indicating
    // the current user and this will determine if they are an admin or not.
    usersRef.orderByChild('uid')
            .equalTo(authData.uid)
            .once('value', snapshot => console.log('got snapshot: ', snapshot.val(), ' id: ', snapshot.key()))
  } else {
    console.log("User is logged out");
  }
})

