import { dispatchHelper } from 'state/helpers'

export default {
  loadAdminTags() { dispatchHelper('loadAdminTags') },
  addManyTags(tags) { dispatchHelper('addManyTags', tags) },
  createTag(newTagName) { dispatchHelper('createTag', newTagName) },
  addDesignsToTag(data) { dispatchHelper('addDesignsToTag', data) },
  addTagToLayer(tag, layer, design) { dispatchHelper('addTagToLayer', {tag, layer, design}) },
  removeTagFromLayer(tag, layer, design) { dispatchHelper('removeTagFromLayer', {tag, layer, design}) },
}
