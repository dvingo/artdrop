import fixtures from '../fixtures'
import reactor from './reactor'
import stores from './stores'
import {idsToObjs, hydrateDesign} from './helpers'
import getters from './getters'
import {firebaseRef, designsRef} from './firebaseRefs'
var Nuclear = require('nuclear-js')

reactor.registerStores({
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
    createNewDesign(newDesign) { reactor.dispatch('createNewDesign', newDesign) }
  }
}

////////////////////////////////////////////////////////////////////////////////
// Init from Firebase.
////////////////////////////////////////////////////////////////////////////////

var designsQuery = designsRef.orderByChild('adminCreated').equalTo(true)
designsQuery.on('child_added', snapshot => {
  var design = snapshot.val()
  design.id = snapshot.key()
  hydrateDesign(design)
})
