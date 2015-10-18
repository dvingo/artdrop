import reactor from 'state/reactor'
var {Set, List} = require('nuclear-js').Immutable
import {updateLayerOfDesign,
  dispatchHelper, idListToFirebaseObj, persistTag,
  persistLayer} from 'state/helpers'

export default {
  loadAdminTags() { dispatchHelper('loadAdminTags') },
  addManyTags(tags) { dispatchHelper('addManyTags', tags) },
  createTag(newTagName) { dispatchHelper('createTag', newTagName) },
  addDesignsToTag(data) { dispatchHelper('addDesignsToTag', data) },

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
    console.log("layer ids before: ", Set(tag.get('layers')).toJS())
    var layerIds = Set(tag.get('layers')).remove(layerId)
    console.log("layer ids after: ", layerIds.toJS())
    var tags = Set(layer.get('tags')).remove(tag)
    var tagIds = tags.map(t => t.get('id'))
    var updatedDesign = updateLayerOfDesign(layer, design, l => l.set('tags', tags))
    persistTag(tagId, {layers: idListToFirebaseObj(layerIds)})
    persistLayer(layerId, {tags: idListToFirebaseObj(tagIds)})
    reactor.dispatch('addDesign', updatedDesign.toJS())
    var updatedTag = tag.set('layers', layerIds)
    reactor.dispatch('setTagImm', updatedTag)
  },
}
