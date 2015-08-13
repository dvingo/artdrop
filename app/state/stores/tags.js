var Nuclear = require('nuclear-js');
var Immutable = Nuclear.Immutable
import reactor from '../reactor'
import {tagsRef, designsRef} from '../firebaseRefs'
import {hydrateAndDispatchTags} from '../helpers'
var hydrateTags = (state) => {
  hydrateAndDispatchTags(state)
  return state
}

var addTagToDesignTags = (tagId, design) => {
  var designId = design.get('id')
  console.log('handling design: ', designId)
  var tagIds = design.get('tags')
  if (tagIds) console.log('tagIds.toJS(): ', tagIds.toJS())
  var tagIdSet = (tagIds ? Immutable.Set(tagIds) : Immutable.Set()).add(tagId)
  //var tagsObj = {}
  //tagIdSet.forEach(id => {
    //console.log('id is: ', id)
    //tagsObj[id] = true
  //})
  //designsRef.child(designId).update({tags: tagsObj})
  var theTagSet = tagIdSet.toKeyedSeq()
  console.log('tagIdSet.toJS(): ', theTagSet.toJS())
  return design.set('tags', theTagSet)
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
      var existingsDesignsForTag = tag.get('designs')
      console.log('DESIGNS: ', data.designs.toJS())
      var designsToAddTagTo ;
      if (existingsDesignsForTag) {
        existingsDesignsForTag = Immutable.Set(existingsDesignsForTag)
        console.log('existingsDesignsForTagSEt : ', existingsDesignsForTag.toJS())
        // This is the designs that are already in the tag.designs
        var designsIntersect = existingsDesignsForTag.intersect(data.designs)
        designsToAddTagTo = designsIntersect.subtract(data.designs)
        console.log('designs TO ADD: ', designsToAddTagTo.toJS())
        var designsToRemoveTagFrom = existingsDesignsForTag.subtract(data.designs)
        console.log('designs to REMOVE TAG FROM: ', designsToRemoveTagFrom.toJS())
      } else {
        console.log('NO EXISTING DESIGNS FOR TAg')
        var allDesignsMap = reactor.evaluate(['designs'])
        designsToAddTagTo = data.designs.map(designId => allDesignsMap.get(designId))
      }
      // TODO THIS could be empty
      var updatedDesigns = designsToAddTagTo.map(addTagToDesignTags.bind(null, tagId))
      var existingTagDesigns = tag.get('designs')
      var designIdSet = existingTagDesigns ? Immutable.Set(existingTagDesigns) : Immutable.Set()
      designIdSet = updatedDesigns.reduce((retVal, d) => retVal.add(d.get('id')), designIdSet)
      var designIdsObj = designIdSet.reduce((retVal, id) => {
        retVal[id] = true
        return retVal
      }, {})
      //tagsRef.child(tagId).update({designs: designIdsObj})

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
