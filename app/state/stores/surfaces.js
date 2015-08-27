var Nuclear = require('nuclear-js');
var Immutable = Nuclear.Immutable
import {hydrateAndDispatchSurfaces} from '../helpers'
import {surfacesRef, surfaceOptionsRef} from '../firebaseRefs'
import surfaceFixtures from '../../fixtures/surfaces'

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

    this.on('loadAdminCreateDesignData', state => {
      hydrateAndDispatchSurfaces(state)
      return state
    })

    this.on('loadCurrentDesignEditResources', state => {
      hydrateAndDispatchSurfaces(state)
      return state
    })

    this.on('resetSurfacesFromFixture', state => {
      surfacesRef.set(surfaceFixtures.surfaces)
      surfaceOptionsRef.set(surfaceFixtures.surfaceOptions)
      return state
    })

  }
})
