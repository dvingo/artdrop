import reactor from 'state/reactor'
import {Map, Set, List} from 'Immutable'
import {updateLayerOfDesign,
  dispatchHelper, idListToFirebaseObj, persistTag,
 persistLayerImageTags, persistTagObjects, persistLayer,
 hydrateAndDispatchTags, persistDesignTags} from 'state/helpers'
import {tagsRef} from 'state/firebaseRefs'

var _addObjectsToTag = (tag, objs, type) => {
  var currentObjs = Set(tag.get(type))
  return tag.set(type, currentObjs.union(objs))
}

// Objects' tags property is hydrated.
// tags.objects property is just ids.
var _removeTagFromObject = (tag, obj) => {
  var tags = Set(obj.get('tags').map(t => t.get('id'))).remove(tag.get('id'))
  return obj.set('tags', tags.toList())
}

var _removeObjectsFromTag = (tag, objsToRemove, type) => {
  objsToRemove = objsToRemove.map(d => d.get('id'))
  var currentObjs = Set(tag.get(type))
  return tag.set(type, currentObjs.subtract(objsToRemove))
}

function tagIdsToObjs(ids) {
  var tagsMap = reactor.evaluate(['tags'])
  return ids.map(id => tagsMap.get(id))
}
var _addTagToObject = (tag, obj) => {
  var updatedTags = Set(obj.get('tags').map(t => t.get('id'))).add(tag.get('id'))
  updatedTags = tagIdsToObjs(updatedTags)
  return obj.set('tags', updatedTags)
}

// Objects' tags property is hydrated.
// tags.objects property is just ids.
var updateTagAndObjects = (tag, selectedObjectIds, type) => {
  var allObjectsMap = reactor.evaluate([type])
  var existingObjectIds = Set(tag.get(type))
  var selectedObjectIds = Set(selectedObjectIds)

  var objectsToRemoveTagFrom = (
    existingObjectIds.subtract(selectedObjectIds)
      .map(d => allObjectsMap.get(d))
      .map(_removeTagFromObject.bind(null, tag)))

  var updatedTag = _removeObjectsFromTag(tag, objectsToRemoveTagFrom, type)

  var objectsToAddTagTo = (
    selectedObjectIds.subtract(
      existingObjectIds.intersect(selectedObjectIds)))

  updatedTag = _addObjectsToTag(updatedTag, objectsToAddTagTo, type)

  var fullObjects = objectsToAddTagTo
        .map(id => allObjectsMap.get(id))
  var objsWithTagAdded = fullObjects.map(_addTagToObject.bind(null, updatedTag))

  var updatedObjects = objectsToRemoveTagFrom.union(objsWithTagAdded)
  updatedObjects = updatedObjects.toList()
  return { updatedTag: updatedTag, updatedObjects: updatedObjects }
}

export default {
  addManyTags(tags) { reactor.dispatch('addManyTags', tags) },

  createTag(newTagName) {
    var now = new Date().getTime()
    var newTag = {
      name: newTagName,
      createdAt: now,
      updatedAt: now
    }
    var newTagRef = tagsRef.push(newTag)
    newTag.id = newTagRef.key()
    reactor.dispatch('setTag', newTag)
  },

  addDesignsToTag(tag, selectedDesignIds) {
    if (DEV && typeof selectedDesignIds.toList().get(0) !== 'string') {
      throw new Error('SelectedDesignIds should be ids')
    }
    var { updatedTag, updatedObjects } = updateTagAndObjects(tag, selectedDesignIds, 'designs')
    updatedObjects.forEach(d => persistDesignTags(d))
    persistTagObjects(updatedTag, 'designs')
    reactor.dispatch('setTagImm', updatedTag)
    reactor.dispatch('addManyDesigns', updatedObjects.toJS())
  },

  addTagToLayer(tag, layer, design) {
    var tagId = tag.get('id')
    var layerId = layer.get('id')
    var layerIds = List(tag.get('layers')).push(layerId)
    var tags = Set(layer.get('tags')).add(tag)
    var tagIds = tags.map(t => t.get('id'))
    var updatedDesign = updateLayerOfDesign(layer, design, l => l.set('tags', tags))
    persistTag(tagId, {layers: idListToFirebaseObj(layerIds)})
    persistLayer(layerId, {tags: idListToFirebaseObj(tagIds)})
    reactor.dispatch('addDesign', updatedDesign.toJS())
    var updatedTag = tag.set('layers', layerIds)
    reactor.dispatch('setTagImm', updatedTag)
  },

  removeTagFromLayer(tag, layer, design) {
    var tagId = tag.get('id')
    var layerId = layer.get('id')
    var layerIds = Set(tag.get('layers')).remove(layerId)
    var tags = Set(layer.get('tags')).remove(tag)
    var tagIds = tags.map(t => t.get('id'))
    var updatedDesign = updateLayerOfDesign(layer, design, l => l.set('tags', tags))
    persistTag(tagId, {layers: idListToFirebaseObj(layerIds)})
    persistLayer(layerId, {tags: idListToFirebaseObj(tagIds)})
    reactor.dispatch('addDesign', updatedDesign.toJS())
    var updatedTag = tag.set('layers', layerIds)
    reactor.dispatch('setTagImm', updatedTag)
  },

  addLayerImagesToTag(tag, layerImageIds) {
    if (DEV && typeof layerImageIds.toList().get(0) !== 'string') {
      throw new Error('LayerImageIds should be ids')
    }
    var { updatedTag, updatedObjects } = updateTagAndObjects(tag, layerImageIds, 'layerImages')
    updatedObjects.forEach(d => persistLayerImageTags(d))
    persistTagObjects(updatedTag, 'layerImages')
    reactor.dispatch('setManyImmLayerImages', updatedObjects)
    reactor.dispatch('setTagImm', updatedTag)
  },

  loadAdminTags() {
    hydrateAndDispatchTags()
  }
}
