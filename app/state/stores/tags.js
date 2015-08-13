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
        if (tag.designs) {
          tag.designs = Object.keys(tag.designs)
        }
        return retVal.set(tag.id, Immutable.fromJS(tag))
      }, state)
    })

    this.on('loadAdminCreateDesignData', hydrateTags)
    this.on('loadCurrentDesignEditResources', hydrateTags)
    this.on('loadAdminTags', hydrateTags)

    this.on('addDesignsToTag', (state, data) => {
      var tag = data.tag
      console.log('tag is: ', tag.toJS())
      var tagId = tag.get('id')
      var allDesignsMap = reactor.evaluate(['designs'])
      var designs = data.designs.map(designId => allDesignsMap.get(designId))
      // TODO Need to handle removing the designs that were deselected.
      var updatedDesigns = designs.map(design => {
        var designId = design.get('id')
        console.log('handling design: ', designId)
        var tagIds = design.get('tags')
        if (tagIds)
        console.log('tagIds.toJS(): ', tagIds.toJS())
        var tagIdSet = tagIds ? Immutable.Set.fromKeys(tagIds.toJS()) : Immutable.Set()
        tagIdSet = tagIdSet.add(tagId)
        var tagsObj = tagIdSet.reduce((retVal, id) => {
          console.log('id is: ', id)
          retVal[id] = true
          return retVal
        }, {})
        designsRef.child(designId).update({tags: tagsObj})
        console.log('tagIdSet.toJS(): ', tagIdSet.toJS())
        return design.set('tags', tagIdSet.toJS())
      })
      var existingTagDesigns = tag.get('designs')
      var designIdSet = existingTagDesigns ? Immutable.Set(existingTagDesigns) : Immutable.Set()
      designIdSet = designs.reduce((retVal, d) => retVal.add(d.get('id')), designIdSet)
      var designIdsObj = designIdSet.reduce((retVal, id) => {
        retVal[id] = true
        return retVal
      }, {})
      tagsRef.child(tagId).update({designs: designIdsObj})

      setTimeout(() => reactor.dispatch('addManyDesigns', updatedDesigns.toJS()), 100)
        console.log('designIdSet.toJS(): ', designIdSet.toJS())
      tag = tag.set('designs', designIdSet.toJS())
      return state.set(tagId, tag)
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
