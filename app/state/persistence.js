import {designsRef, layersRef, layerImagesRef,
 surfacesRef, tagsRef, ordersRef} from 'state/firebaseRefs'
import {idListToFirebaseObj} from 'state/helpers'
import RSVP from 'RSVP'
var Promise = RSVP.Promise

function ensureListIsFirebaseObj(list) {
  if (list.length === 0) { return list }
  var f = list[0]
  if (typeof f === 'string') {
    return idListToFirebaseObj(list)
  }
  if (typeof f === 'object' && f.hasOwnProperty('id')) {
    return idListToFirebaseObj(list.map(i => i['id']))
  }
  return list
}

var designPropsToIds = (design) => {
  var layerIds = design.get('layers').map(l => l.get('id'))
  var surfaceId = design.get('surface') ? design.getIn(['surface', 'id']) : null
  var surfaceOptionId = design.get('surfaceOption') ? design.getIn(['surfaceOption', 'id']) : null
  return (surfaceId
    ? design.withMutations(d => (
      d.set('layers', layerIds)
       .set('surface', surfaceId)
       .set('surfaceOption', surfaceOptionId)))
    : design.set('layers', layerIds)
  )
}

var persistWithRef = (firebaseRef, id, obj) => {
  if (DEBUG) {
    console.log(`Saving to firebase ref ${firebaseRef} at id: ${id}.`)
  }
  firebaseRef.child(id).update(obj)
}

var persistNewLayer = (layer) => {
  var l = layer.toJS()
  l.colorPalette = l.colorPalette.id
  l.selectedLayerImage = l.selectedLayerImage.id
  if (l.hasOwnProperty('tags')) {
    l.tags = ensureListIsFirebaseObj(l.tags)
  }
  layersRef.child(l.id).set(l)
}

var persistNewDesign = (design) => {
  design.get('layers').forEach(persistNewLayer)
  var firebaseDesign = designPropsToIds(design)
  return new Promise((resolve, reject) => {
    designsRef.child(design.get('id')).set(firebaseDesign.toJS(), (err) => {
      if (err) { reject() }
      else     { resolve() }
    })
  })
}

var persistNewLayerImage = (layerImage) => {
  var newLayerImageRef = layerImagesRef.push(layerImage)
  return newLayerImageRef.key()
}

var persistNewLayerJs = (layer) => {
  var newLayerRef = layersRef.push(layer)
  return newLayerRef.key()
}

var persistDeleteLayerImage = (layerImageId) => {
  layerImagesRef.child(layerImageId).remove()
}

var persistAndCreateNewOrder = (orderData) => {
  return new Promise((resolve, reject) => {
    var newOrderRef = ordersRef.push(orderData, (err) => {
      if (err) { reject() }
      else     { resolve(newOrderRef.key()) }
    })
  })
}

var persistDesign = persistWithRef.bind(null, designsRef)

var persistDesignLayers = (layers, now, opts) => {
  var isNew = opts.isNew
  var layerIds = layers.map((layer, i) => {
    var id = layer.id
    delete layer.id
    layer.order = i
    layer.colorPalette = layer.colorPalette.id
    layer.selectedLayerImage = layer.selectedLayerImage.id
    layer.updatedAt = now
    if (layer.hasOwnProperty('tags')) {
      layer.tags = idListToFirebaseObj(layer.tags.map(t => t.id))
    }
    if (isNew) {
      layer.createdAt = now
      return persistNewLayerJs(layer)
    } else {
      persistLayer(id, layer)
      return id
    }
  })
  return layerIds
}

var persistLayer = (id, propsObj) => {
  delete propsObj.selectedLayerImageIndex
  delete propsObj.orderedLayerImages
  persistWithRef(layersRef, id, propsObj)
}

var persistLayerImage = persistWithRef.bind(null, layerImagesRef)
var persistSurface = persistWithRef.bind(null, surfacesRef)
var persistTag = persistWithRef.bind(null, tagsRef)

var persistDesignTags = (design) => {
  if (TEST) { return }
  var tagsObj = {}
  design.get('tags').forEach(o => {
    var id = typeof o === 'object' ? o.get('id') : o
    tagsObj[id] = true
  })
  persistDesign(design.get('id'), {tags: tagsObj})
}

var persistLayerImageTags = (layerImage) => {
  if (TEST) { return }
  var tagsObj = {}
  layerImage.get('tags').forEach(o => {
    var id = typeof o === 'object' ? o.get('id') : o
    tagsObj[id] = true
  })
  persistLayerImage(layerImage.get('id'), {tags: tagsObj})
}

var persistTagObjects = (tag, type) => {
  if (TEST) { return }
  var idsObj = {}
  tag.get(type).forEach(id => idsObj[id] = true)
  var objToUpdate = {}
  objToUpdate[type] = idsObj
  persistTag(tag.get('id'), objToUpdate)
}

export default {
  persistDesign,
  persistDesignLayers,
  persistLayer,
  persistSurface,
  persistTag,
  persistTagObjects,
  persistAndCreateNewOrder,
  persistNewDesign,
  persistNewLayerJs,
  persistNewLayerImage,
  persistDeleteLayerImage,
  persistDesignTags,
  persistLayerImageTags
}
