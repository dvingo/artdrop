var Nuclear = require('nuclear-js');
var Immutable = Nuclear.Immutable
import {hydrateAndDispatchSurfaces} from '../helpers'
import {surfacesRef, designsRef, surfaceOptionsRef} from '../firebaseRefs'
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
      });

      return state
    })

  }
})
