var Nuclear = require('nuclear-js');
var Immutable = Nuclear.Immutable
import reactor from '../reactor'
import {tagsRef, designsRef} from '../firebaseRefs'
import {hydrateAndDispatchTags} from '../helpers'
var hydrateTags = (state) => {
  hydrateAndDispatchTags(state)
  return state
}

var addTagToDesign = (tagId, design) => {
  var updatedTags = Immutable.Set(design.get('tags')).add(tagId).toKeyedSeq()
  return design.set('tags', updatedTags)
}

var removeTagFromDesign = (tagId, design) => {
  var designId = design.get('id')
  var tagIds = Immutable.Set(design.get('tags')).remove(tagId)
  return design.set('tags', tagIds.toKeyedSeq())
}

var removeDesignsFromTag = (tag, designsToRemove) => {
  designsToRemove = designsToRemove.map(d => d.get('id'))
  var currentDesigns = Immutable.Set(tag.get('designs'))
  return tag.set('designs', currentDesigns.subtract(designsToRemove))
}

var addDesignsToTag = (tag, designs) => {
  var currentDesigns = Immutable.Set(tag.get('designs'))
  return tag.set('designs', currentDesigns.union(designs))
}

var updateTagAndDesigns = (tag, selectedDesigns) => {
  var allDesignsMap = reactor.evaluate(['designs'])
  var existingsDesigns = Immutable.Set(tag.get('designs'))
  var selectedDesigns = Immutable.Set(selectedDesigns)
  var designsToRemoveTagFrom = (
    existingsDesigns.subtract(selectedDesigns)
      .map(d => allDesignsMap.get(d))
      .map(removeTagFromDesign.bind(null, tag.get('id'))))
  var tag = removeDesignsFromTag(tag, designsToRemoveTagFrom)

  var designsToAddTagTo = (
    selectedDesigns.subtract(
      existingsDesigns.intersect(selectedDesigns)))

  var updatedDesigns = (
    designsToRemoveTagFrom.union(designsToAddTagTo
     .map(id => allDesignsMap.get(id))
     .map(addTagToDesign.bind(null, tag.get('id')))))
  tag = addDesignsToTag(tag, designsToAddTagTo)
  return { updatedTag: tag, updatedDesigns: updatedDesigns }
}

// TODO combine common code
var persistTagWithUpdatedDesigns = (tag) => {
  if (TEST) { return }
  var designIdsObj = {}
  tag.get('designs').forEach(d => designIdsObj[d] = true)
  tagsRef.child(tag.get('id')).update({designs: designIdsObj})
}

var persistDesignWithUpdatedTags = (design) => {
  if (TEST) { return }
  var tagsObj = {}
  design.get('tags').forEach(id => tagsObj[id] = true)
  designsRef.child(design.get('id')).update({tags: tagsObj})
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
      var selectedDesigns = data.designs
      var { updatedTag, updatedDesigns } = updateTagAndDesigns(tag, selectedDesigns)
      updatedDesigns.forEach(d => persistDesignWithUpdatedTags(d))
      persistTagWithUpdatedDesigns(updatedTag)
      setTimeout(() => reactor.dispatch('addManyDesigns', updatedDesigns.toJS()), 100)
      return state.set(tag.get('id'), updatedTag)
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
