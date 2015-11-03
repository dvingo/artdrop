import {designsRef, layersRef, layerImagesRef,
colorPalettesRef, surfacesRef,
surfaceOptionsRef, tagsRef, ordersRef} from 'state/firebaseRefs'
import reactor from 'state/reactor'
import getters from 'state/getters'
import {Map, List} from 'Immutable'
var RSVP = require('RSVP')
var Promise = RSVP.Promise

var nonOptionKeys = ['id', 'printingPrice', 'salePrice', 'units',
  'vendorId', 'height', 'width', 'depth', 'printingImageWidth', 'printingImageHeight']

function setSizeOnSurfaceOption(option) {
  var units = option.get('units')
  var height = option.get('height')
  var width = option.get('width')
  var depth = option.get('depth')
  if (!(height && width)) { return option }
  if (depth) {
    return option.set('size: height, width, depth', `${height} x ${width} x ${depth} ${units}`)
  }
  return option.set('size: height, width', `${height} x ${width} ${units}`)
}

var dispatchHelper = function() {
  var args = arguments
  var interval = setInterval(() => {
    if (!reactor.__isDispatching) {
      clearInterval(interval)
      reactor.dispatch.apply(reactor, args)
    }
  }, 100)
}

var defaultSurfaceOptionIdForSurface = (surfaceObj) => {
  if (Array.isArray(surfaceObj.options)) {
    return surfaceObj.options[0].id
  }
  return Object.keys(surfaceObj.options)[0]
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

function nestedHydrateLayer(layerId) {
  return hydrateLayer(layerId).then(layer => {
    return hydrateLayerImage(layer.selectedLayerImage).then(layerImage => {
      layerImage.id = layer.selectedLayerImage
      layerImage.tags = populateTags(layerImage)
      reactor.dispatch('setLayerImage', layerImage)
      layer.selectedLayerImage = layerImage
      layer.id = layerId
      layer.tags = populateTags(layer)
      return hydrateColorPalette(layer.colorPalette).then(colorPalette => {
        colorPalette.id = layer.colorPalette
        layer.colorPalette = colorPalette
        reactor.dispatch('addColorPalette', colorPalette)
        return layer
      })
    })
  })
}

function hydrateSurfaceOption(surfaceOptionId) {
  return (
    hydrateObj(surfaceOptionsRef, surfaceOptionId)
    .then(surfaceOption => {
      surfaceOption.id = surfaceOptionId
      return setSizeOnSurfaceOption(Map(surfaceOption)).toJS()
    })
  )
}

function addIdsToData(data) {
  return Object.keys(data).map(id => {
    var obj = data[id]
    obj.id = id
    return obj
  })
}

function hydrateTagsIfMissing() {
  return new Promise((resolve, reject) => {
    var existingTags = reactor.evaluate(getters.tags)
    if (existingTags.count() > 0) { resolve() }
    else {
      tagsRef.once('value', snapshot => {
        var data = snapshot.val()
        var dataToDispatch = addIdsToData(data)
        reactor.dispatch('addManyTags', dataToDispatch)
        resolve()
      })
    }
  })
}

function populateTags(obj) {
  if (obj.hasOwnProperty('tags')) {
    var tagsMap = reactor.evaluate(['tags'])
    return List(Object.keys(obj.tags).map(id => tagsMap.get(id)))
  }
  return List()
}

var hydrateDesign = (design) => {
  return hydrateTagsIfMissing().then(() => {
    var layers = design.layers.map(nestedHydrateLayer)
    return RSVP.all(layers).then(layers => {
      design.layers = layers;
      return hydrateSurface(design.surface)
    }).then(surface => {
      return (
        hydrateSurfaceOptionsForSurface(surface)
        .then(surfaceOptions => {
          surface.id = design.surface
          surface.options = surfaceOptions
          design.surface = surface
          design.tags = populateTags(design)
          design.surfaceOption = surface.options.filter(o => o.id === design.surfaceOption)[0]
          reactor.dispatch('addSurface', surface)
          reactor.dispatch('addDesign', design)
        })
      )
    }).catch(e => console.error("Got Error: ", e))
  })
}

function hydrateSurfaceOptionsForSurface (surface) {
  return RSVP.all(Object.keys(surface.options).map(hydrateSurfaceOption))
}

var hydrateObj = (ref, id) => {
  return new RSVP.Promise((resolve, reject) => {
    ref.child(id).once('value',
      o => resolve(o.val()),
      e => reject(e))
  })
}

var hydrateAndDispatchData = (dbRef, dispatchMsg, tx) => {
  dbRef.once('value', snapshot => {
    var data = snapshot.val()
    var dataToDispatch = addIdsToData(data)
    reactor.dispatch(dispatchMsg, dataToDispatch)
  })
}

var hydrateLayer = hydrateObj.bind(null, layersRef)
var hydrateLayerImage = hydrateObj.bind(null, layerImagesRef)
var hydrateColorPalette = hydrateObj.bind(null, colorPalettesRef)
var hydrateSurface = hydrateObj.bind(null, surfacesRef)

var hydrateAndDispatchLayerImages = () => {
  hydrateTagsIfMissing().then(() => {
    layerImagesRef.once('value', snapshot => {
      var data = snapshot.val()
      var dataToDispatch = addIdsToData(data)
      dataToDispatch.forEach(li => li.tags = populateTags(li).toJS())
      reactor.dispatch('addManyLayerImages', dataToDispatch)
    })
  })
}

var hydrateAdminDesignsOnlyTags = () => {
  return new Promise((resolve, reject) => {
    hydrateTagsIfMissing().then(() => {
      var designsQuery = designsRef.orderByChild('adminCreated').equalTo(true)
      designsQuery.once('value', snapshot => {
        var designs = addIdsToData(snapshot.val())
        designs.forEach(d => d.tags = populateTags(d).toJS())
        resolve(designs)
      })
    })
  })
}

var hydrateAndDispatchSurfaces = hydrateAndDispatchData.bind(null, surfacesRef, 'addManySurfaces')
var hydrateAndDispatchTags = hydrateAndDispatchData.bind(null, tagsRef, 'addManyTags')
var hydrateAndDispatchColorPalettes = hydrateAndDispatchData.bind(null, colorPalettesRef, 'addManyColorPalettes')

var updateLayerOfDesign = (layer, design, updateFn) => {
  var layers = design.get('layers')
  var i = layers.findIndex(l => l.get('id') === layer.get('id'))
  return design.set('layers', layers.update(i, v => updateFn(v)))
}

var updateCurrentLayerOfDesign = (updater) => {
  var currentDesign = reactor.evaluate(getters.currentDesign)
  var currentLayer = reactor.evaluate(getters.currentLayer)
  return updateLayerOfDesign(currentLayer, currentDesign, updater)
}

var idListToFirebaseObj = (list) => {
  var retVal = {}
  list.forEach(i => retVal[i] = true)
  return retVal
}

var persistWithRef = (firebaseRef, id, obj) => {
  if (DEBUG) {
    console.log(`Saving to firebase ref ${firebaseRef} at id: ${id}.`)
  }
  firebaseRef.child(id).update(obj)
}

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
  return new RSVP.Promise((resolve, reject) => {
    designsRef.child(design.get('id')).set(firebaseDesign.toJS(), (err) => {
      if (err) { reject() }
      else     { resolve() }
    })
  })
}

var persistAndCreateNewOrder = (orderData) => {
  return new RSVP.Promise((resolve, reject) => {
    var newOrderRef = ordersRef.push(orderData, (err) => {
      if (err) { reject() }
      else     { resolve(newOrderRef.key()) }
    })
  })
}

var persistDesign = persistWithRef.bind(null, designsRef)
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
  nonOptionKeys,
  idListToFirebaseObj,
  updateLayerOfDesign,
  updateCurrentLayerOfDesign,
  dispatchHelper,
  defaultSurfaceOptionIdForSurface,
  persistDesign,
  persistLayer,
  persistSurface,
  persistTag,
  persistTagObjects,
  persistAndCreateNewOrder,
  persistNewDesign,
  persistDesignTags,
  persistLayerImageTags,
  hydrateDesign,
  hydrateAndDispatchLayerImages,
  hydrateAndDispatchSurfaces,
  hydrateAndDispatchTags,
  hydrateAndDispatchColorPalettes,
  hydrateSurfaceOptionsForSurface,
  hydrateAdminDesignsOnlyTags
}
