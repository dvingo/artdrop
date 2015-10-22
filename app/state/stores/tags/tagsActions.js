import reactor from 'state/reactor'
import {Set, List} from 'Immutable'
import {updateLayerOfDesign,
  dispatchHelper, idListToFirebaseObj, persistTag,
 persistLayerImageTags, persistTagObjects, persistLayer,
 persistDesignTags} from 'state/helpers'

var _addObjectsToTag = (tag, objs, type) => {
  var currentObjs = Set(tag.get(type))
  return tag.set(type, currentObjs.union(objs))
}

var _removeTagFromObject = (tagId, obj) => {
  var objId = obj.get('id')
  var tagIds = Set(obj.get('tags')).remove(tagId)
  return obj.set('tags', tagIds.toKeyedSeq())
}

var _removeObjectsFromTag = (tag, objsToRemove, type) => {
  objsToRemove = objsToRemove.map(d => d.get('id'))
  var currentObjs = Set(tag.get(type))
  return tag.set(type, currentObjs.subtract(objsToRemove))
}

var _addTagToObject = (tagId, obj) => {
  var updatedTags = Set(obj.get('tags')).add(tagId).toKeyedSeq()
  return obj.set('tags', updatedTags)
}

var updateTagAndObjects = (tag, selectedObjects, type) => {
  var allObjectsMap = reactor.evaluate([type])
  var existingObjects = Set(tag.get(type))
  var selectedObjects = Set(selectedObjects)
  var objectsToRemoveTagFrom = (
    existingObjects.subtract(selectedObjects)
      .map(d => allObjectsMap.get(d))
      .map(_removeTagFromObject.bind(null, tag.get('id'))))
  var tag = _removeObjectsFromTag(tag, objectsToRemoveTagFrom, type)

  var objectsToAddTagTo = (
    selectedObjects.subtract(
      existingObjects.intersect(selectedObjects)))

  var updatedObjects = (
    objectsToRemoveTagFrom.union(objectsToAddTagTo
     .map(id => allObjectsMap.get(id))
     .map(_addTagToObject.bind(null, tag.get('id')))))
  tag = _addObjectsToTag(tag, objectsToAddTagTo, type)
  return { updatedTag: tag, updatedObjects: updatedObjects }
}

//var updateTagAndDesigns = (tag, selectedDesigns) => {
  //var allDesignsMap = reactor.evaluate(['designs'])
  //var existingsDesigns = Set(tag.get('designs'))
  //var selectedDesigns = Set(selectedDesigns)
  //var designsToRemoveTagFrom = (
    //existingsDesigns.subtract(selectedDesigns)
      //.map(d => allDesignsMap.get(d))
      //.map(_removeTagFromDesign.bind(null, tag.get('id'))))
  //var tag = _removeDesignsFromTag(tag, designsToRemoveTagFrom)

  //var designsToAddTagTo = (
    //selectedDesigns.subtract(
      //existingsDesigns.intersect(selectedDesigns)))

  //var updatedDesigns = (
    //designsToRemoveTagFrom.union(designsToAddTagTo
     //.map(id => allDesignsMap.get(id))
     //.map(_addTagToDesign.bind(null, tag.get('id')))))
  //tag = _addDesignsToTag(tag, designsToAddTagTo)
  //return { updatedTag: tag, updatedDesigns: updatedDesigns }
//}

export default {
  loadAdminTags() { dispatchHelper('loadAdminTags') },
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

  addDesignsToTag(tag, selectedDesigns) {
    var { updatedTag, updatedObjects } = updateTagAndObjects(tag, selectedDesigns, 'designs')
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

  addLayerImagesToTag(tag, layerImages) {
    var { updatedTag, updatedObjects } = updateTagAndObjects(tag, layerImages, 'layerImages')
    updatedObjects.forEach(d => persistLayerImageTags(d))
    persistTagLayerImages(updatedTag)
    // TODO
    //reactor.dispatch('setTagImm', updatedTag)
    // Need to update the layer and design that use this layerImage....
    //reactor.dispatch('', updatedDesigns.toJS())
  }
}
