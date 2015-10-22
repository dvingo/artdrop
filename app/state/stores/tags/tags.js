var Nuclear = require('nuclear-js')
var Immutable = Nuclear.Immutable
import reactor from 'state/reactor'
import {tagsRef} from 'state/firebaseRefs'
import {hydrateAndDispatchTags} from 'state/helpers'

var hydrateTags = (state) => {
  hydrateAndDispatchTags(state)
  return state
}

export default new Nuclear.Store({
  getInitialState() { return Nuclear.toImmutable({}) },

  initialize() {

    this.on('setTagImm', (state, tag) => {
      return state.set(tag.get('id'), tag)
    })

    this.on('setTag', (state, tag) => {
      return state.set(tag.id, Immutable.fromJS(tag))
    })

    this.on('addManyTags', (state, tags) => {
      return tags.reduce((retVal, tag) => {
        if (tag.designs) {
          tag.designs = Object.keys(tag.designs)
        }
        if (tag.layers) {
          tag.layers = Object.keys(tag.layers)
        }
        return retVal.set(tag.id, Immutable.fromJS(tag))
      }, state)
    })

    this.on('loadAdminCreateDesignData', hydrateTags)
    this.on('loadCurrentDesignEditResources', hydrateTags)
    this.on('loadAdminTags', hydrateTags)
  }
})
