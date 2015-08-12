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

export default new Nuclear.Store({
  getInitialState() { return '' },

  handleSelectDesignId(state, designId) {
    if (state === designId) {
      return designId
    }
    var designs = reactor.evaluate(['designs'])
    if (!designs.has(designId) || designIsNotHydrated(designId)) {
      designsRef.child(designId).once('value', (design) => {
        design = design.val()
        design.id = designId
        hydrateDesign(design)
      })
    }
    return designId
  },

  initialize() {
    this.on('selectDesignId', this.handleSelectDesignId)
    this.on('selectDesignAndLayerId', (state, ids) => this.handleSelectDesignId(state, ids.designId))
    this.on('deleteDesign', (state, design) => '')
  }
})
