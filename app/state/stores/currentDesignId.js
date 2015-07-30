var Nuclear = require('nuclear-js');
import reactor from '../reactor'
import {hydrateDesign} from '../helpers'
import {designsRef} from '../firebaseRefs'

var designIsNotHydrated = (designId) => {
  var designsMap = reactor.evaluate(['designs'])
  var design = designsMap.get(designId)
  if (typeof design.getIn(['layers', 0]) === 'string') {
    return true
  }
  return false
}

var currentlyHydratingDesignId = null

export default new Nuclear.Store({
  getInitialState() { return '' },

  initialize() {
    this.on('selectDesignId', (state, designId) => {
      if (currentlyHydratingDesignId === designId) {
        return designId
      }
      var designs = reactor.evaluate(['designs'])
      if (!designs.has(designId) || designIsNotHydrated(designId)) {
        currentlyHydratingDesignId = designId
        designsRef.child(designId).on('value', (design) => {
          design = design.val()
          design.id = designId
          hydrateDesign(design).then(() => currentlyHydratingDesignId = null)
        })
      }
      return designId
    })
  }
})
