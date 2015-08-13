var Nuclear = require('nuclear-js');
var Immutable = Nuclear.Immutable
import reactor from '../reactor'
import {tagsRef, designsRef} from '../firebaseRefs'
import {hydrateAndDispatchTags} from '../helpers'
var hydrateTags = (state) => {
  hydrateAndDispatchTags(state)
  return state
}

export default new Nuclear.Store({
  getInitialState() { return Nuclear.toImmutable({}) },

  initialize() {
    this.on('addTag', (state, tag) => {
      return state.set(tag.id, Immutable.fromJS(tag))
    })

    this.on('addManyTags', (state, tags) => {
      return tags.reduce((retVal, tag) => {
        return retVal.set(tag.id, Immutable.fromJS(tag))
      }, state)
    })

    this.on('loadAdminCreateDesignData', hydrateTags)
    this.on('loadCurrentDesignEditResources', hydrateTags)
    this.on('loadAdminTags', hydrateTags)

    this.on('addDesignsToTag', (state, data) => {
      var tag = data.tag
      var tagId = tag.get('id')
      var designs = data.designs
      designs.forEach(design => {
        var designId = design.get('id')
        var tags = design.get('tags')
        if (tags) {
          var tagsList = tags.map(tag => tag.get('id'))
          if (!tagsList.includes(tagId)) {
            tagsList.push(tagId)
            designsRef.child(designId).update({tags: tagsList.toJS()})
          }
        } else {
          designsRef.child(designId).update({tags: [tagId]})
          var newDesign = design.toJS()
          newDesign.tags = [tagId]
          setTimeout(() => reactor.dispatch('addDesign', newDesign), 100)
        }
      })
      var existingTagDesigns = tag.get('designs')
      var designIdSet = existingTagDesigns ? Immutable.Set(existingTagDesigns.map(d => d.get('id'))) : Immutable.Set()
      var designIds = designs.reduce((retVal, d) => retVal.add(d.get('id')), designIdSet)
      designIds = designIds.reduce((retVal, id) => {id: true}, {})
      tagsRef.child(tagId).update({designs: designIds})
      return state
    })

    this.on('createTag', (state, newTagName) => {
      var now = new Date().getTime()
      var newTag = {
        name: newTagName,
        createdAt: now,
        updatedAt: now
      }
      var newTagRef = tagsRef.push(newTag)
      newTag.id = newTagRef.key()
      setTimeout(() => reactor.dispatch('addTag', newTag), 50)
      return state
    })
  }
})
