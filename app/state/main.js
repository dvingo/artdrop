import fixtures from '../fixtures'
import reactor from './reactor'
import stores from './stores'
import {idsToObjs, hydrateDesignById} from './helpers'
import getters from './getters'
import firebaseRefs from './firebaseRefs'
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
    makeDesignCopy(newId) { reactor.dispatch('makeDesignCopy', newId) },
    createNewDesign(newDesign) { reactor.dispatch('createNewDesign', newDesign) }
  }
}

////////////////////////////////////////////////////////////////////////////////
// Init from Firebase.
////////////////////////////////////////////////////////////////////////////////

// TODO data retrieval should be lazy, as this strategy won't scale.
// On boot, select all "home screen designs, and pull all of their data."
firebaseRefs.firebaseRef.once('value', data => {
  var allData = data.val();
  Object.keys(allData.designs)
    .map(hydrateDesignById.bind(null, allData))
    .forEach(d => reactor.dispatch('addDesign', d))

  Object.keys(allData.colorPalettes)
    .map(id => idsToObjs(id, allData.colorPalettes))
    .forEach(c => reactor.dispatch('addColorPalette', c))

  Object.keys(allData.layerImages)
    .map(id => idsToObjs(id, allData.layerImages))
    .forEach(li => reactor.dispatch('addLayerImage', li))

  Object.keys(allData.surfaces)
    .map(id => idsToObjs(id, allData.surfaces))
    .forEach(s => reactor.dispatch('addSurface', s))
})
