var Nuclear = require('nuclear-js');
var Immutable = Nuclear.Immutable
import {persistSurface, hydrateAndDispatchSurfaces} from '../helpers'
console.log("persist surface is: ", persistSurface)
import {surfacesRef, designsRef, surfaceOptionsRef} from '../firebaseRefs'
import surfaceFixtures from '../../fixtures/surfaces'

function loadSurfaces(state) {
  hydrateAndDispatchSurfaces(state)
  return state
}

function persistSurfaceImm(surface) {
  var s = surface.toJS()
  var surfaceId = s.id
  delete s.id
  persistSurface(surfaceId, s)
}

export default new Nuclear.Store({
  getInitialState() { return Nuclear.toImmutable({}) },

  initialize() {

    this.on('addSurface', (state, surface) => {
      return state.set(surface.id, Immutable.fromJS(surface))
    })

    this.on('addManySurfaces', (state, surfaces) => {
      return surfaces.reduce((retVal, surface) => {
        return retVal.set(surface.id, Immutable.fromJS(surface))
      }, state)
    })

    this.on('updateSurface', (state, newSurface) => {
      persistSurfaceImm(newSurface)
      return state.set(newSurface.get('id'), newSurface)
    })

    this.on('loadAdminCreateDesignData', loadSurfaces)
    this.on('loadCurrentDesignEditResources', loadSurfaces)
    this.on('loadSurfaces', loadSurfaces)

    this.on('resetSurfacesFromFixture', state => {
      surfacesRef.set(surfaceFixtures.surfaces)
      surfaceOptionsRef.set(surfaceFixtures.surfaceOptions)
      designsRef.once('value', snapshot => {
        var allDesigns = snapshot.val()
        var surfaceId = Object.keys(surfaceFixtures.surfaces)[0]
        var surfaceOptionId = Object.keys(surfaceFixtures.surfaces[surfaceId].options)[0]
        Object.keys(allDesigns).forEach( id => {
          designsRef.child(id).update({
            surface: surfaceId,
            surfaceOption: surfaceOptionId
          })
        })
      })
      return state
    })

  }
})
