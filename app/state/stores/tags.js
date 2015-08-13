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
  var designId = design.get('id')
  console.log('handling add tag to design: ', designId)
  var tagIds = design.get('tags')
  if (tagIds) console.log('TAGS BEFORE: ', tagIds.toJS())
  var tagIdSet = (tagIds ? Immutable.Set(tagIds) : Immutable.Set()).add(tagId)
  console.log('TAGS AFTER: ', tagIdSet.toJS())
  var tagsObj = {}
  tagIdSet.forEach(id => {
    console.log('id is: ', id)
    tagsObj[id] = true
  })
  console.log('Saving design tags')
  designsRef.child(designId).update({tags: tagsObj})
  var theTagSet = tagIdSet.toKeyedSeq()
  console.log('tagIdSet.toJS(): ', theTagSet.toJS())
  return design.set('tags', theTagSet)
}

var removeTagFromDesign = (tagId, design) => {
  var designId = design.get('id')
  console.log('removing tag from design: ', designId)
  console.log('TAGS BEFORE: ',design.get('tags').toJS())
  var tagIds = Immutable.Set(design.get('tags')).remove(tagId)

  var tagsObj = {}
  tagIds.forEach(id => {
    console.log('id is: ', id)
    tagsObj[id] = true
  })
  console.log('Saving design tags')
  designsRef.child(designId).update({tags: tagsObj})
  console.log('TAGS AFTER: ', tagIds.toJS())
  return design.set('tags', tagIds.toKeyedSeq())
}

var removeDesignsFromTag = (tag, designs) => {
  var currentDesigns = Immutable.Set(tag.get('designs'))
  console.log("Tags current designs: ", currentDesigns.toJS())
  console.log("DESIGNS TO REMOVE: ", designs.toJS())
  console.log('DESIGNS are now: ', currentDesigns.subtract(designs).toJS())

  return tag.set('designs', currentDesigns.subtract(designs))
}

var addDesignsToTag = (tag, designs) => {
  var currentDesigns = Immutable.Set(tag.get('designs'))
  console.log("Tags current designs: ", currentDesigns.toJS())
  console.log("DESIGNS TO ADD: ", designs.toJS())
  console.log('DESIGNS are now: ', currentDesigns.union(designs).toJS())
  return tag.set('designs', currentDesigns.union(designs))
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
      var tagId = tag.get('id')
      var existingsDesignsForTag = tag.get('designs')
      var designsToAddTagTo = data.designs
      var allDesignsMap = reactor.evaluate(['designs'])
      var updatedDesigns = Immutable.Set();
      var updatedTag = tag
      if (existingsDesignsForTag) {
        existingsDesignsForTag = Immutable.Set(existingsDesignsForTag)
        var selectedDesigns = Immutable.Set(data.designs)
        var designsIntersect = existingsDesignsForTag.intersect(selectedDesigns)
        designsToAddTagTo = selectedDesigns.subtract(designsIntersect)
        var designsToRemoveTagFrom = existingsDesignsForTag.subtract(data.designs)
        updatedDesigns = updatedDesigns.union(
          designsToRemoveTagFrom.map(d => allDesignsMap.get(d)).map(removeTagFromDesign.bind(null, tagId)))
        updatedTag = removeDesignsFromTag(tag, designsToRemoveTagFrom)
      }
      if (designsToAddTagTo.count() > 0) {
        console.log('DESIGNS to add: ', designsToAddTagTo.toJS())
        updatedDesigns = updatedDesigns.union(
          designsToAddTagTo.map(id => allDesignsMap.get(id)).map(addTagToDesign.bind(null, tagId)))
        updatedTag = addDesignsToTag(updatedTag, designsToAddTagTo)
      } else {
        console.log('NO designs to ADD')
      }
      if (updatedDesigns.count() > 0) {
        setTimeout(() => reactor.dispatch('addManyDesigns', updatedDesigns.toJS()), 100)
      }
      if (updatedTag !== tag) {
        console.log('TAG HAS CHANGES, saving to Firebase')
        var designIdsObj = {}
        updatedTag.get('designs').forEach(d => designIdsObj[d] = true)
        console.log('updatedTag.designs: ', updatedTag.get('designs').toJS())
        console.log('design id obj: ', designIdsObj)
        tagsRef.child(tagId).update({designs: designIdsObj})
      }
      return state.set(tagId, updatedTag)
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
