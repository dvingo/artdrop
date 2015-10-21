import reactor from 'state/reactor'
import {Set, List} from 'Immutable'
import {updateLayerOfDesign,
  dispatchHelper, idListToFirebaseObj, persistTag,
  persistLayer, persistDesignTags, persistTagDesigns} from 'state/helpers'

var _addDesignsToTag = (tag, designs) => {
  var currentDesigns = Set(tag.get('designs'))
  return tag.set('designs', currentDesigns.union(designs))
}

var _removeTagFromDesign = (tagId, design) => {
  var designId = design.get('id')
  var tagIds = Set(design.get('tags')).remove(tagId)
  return design.set('tags', tagIds.toKeyedSeq())
}

var _removeDesignsFromTag = (tag, designsToRemove) => {
  designsToRemove = designsToRemove.map(d => d.get('id'))
  var currentDesigns = Set(tag.get('designs'))
  return tag.set('designs', currentDesigns.subtract(designsToRemove))
}

var _addTagToDesign = (tagId, design) => {
  var updatedTags = Set(design.get('tags')).add(tagId).toKeyedSeq()
  return design.set('tags', updatedTags)
}

var updateTagAndDesigns = (tag, selectedDesigns) => {
  var allDesignsMap = reactor.evaluate(['designs'])
  var existingsDesigns = Set(tag.get('designs'))
  var selectedDesigns = Set(selectedDesigns)
  var designsToRemoveTagFrom = (
    existingsDesigns.subtract(selectedDesigns)
      .map(d => allDesignsMap.get(d))
      .map(_removeTagFromDesign.bind(null, tag.get('id'))))
  var tag = _removeDesignsFromTag(tag, designsToRemoveTagFrom)

  var designsToAddTagTo = (
    selectedDesigns.subtract(
      existingsDesigns.intersect(selectedDesigns)))

  var updatedDesigns = (
    designsToRemoveTagFrom.union(designsToAddTagTo
     .map(id => allDesignsMap.get(id))
     .map(_addTagToDesign.bind(null, tag.get('id')))))
  tag = _addDesignsToTag(tag, designsToAddTagTo)
  return { updatedTag: tag, updatedDesigns: updatedDesigns }
}

export default {
  loadAdminTags() { dispatchHelper('loadAdminTags') },
  addManyTags(tags) { reactor.dispatch('addManyTags', tags) },
  createTag(newTagName) { dispatchHelper('createTag', newTagName) },

  addDesignsToTag(tag, selectedDesigns) {
    var { updatedTag, updatedDesigns } = updateTagAndDesigns(tag, selectedDesigns)
    updatedDesigns.forEach(d => persistDesignTags(d))
    persistTagDesigns(updatedTag)
    reactor.dispatch('setTagImm', updatedTag)
    reactor.dispatch('addManyDesigns', updatedDesigns.toJS())
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
    // In memory layerImages have tags hyrdated,
    // tags just have layerImage ids
    // update these on each end and then persist
    // update these on each and then dispatch
  }
}
