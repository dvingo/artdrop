var Nuclear = require('nuclear-js');
var Immutable = Nuclear.Immutable
import {designPropsToIds, defaultSurfaceOptionIdForSurface, hydrateSurfaceOptionsForSurface} from '../helpers'
import getters from '../getters'
import reactor from '../reactor'
import {uploadDesignPreview, newId, rotateColorPalette} from '../utils'
import {nonOptionKeys} from '../helpers'
import {designsRef, layersRef} from '../firebaseRefs'
var Set = require('nuclear-js').Immutable.Set
var List = require('nuclear-js').Immutable.List

var persistWithRef = (firebaseRef, id, obj) => {
  if (DEBUG) {
    console.log(`Saving to firebase ref ${firebaseRef} at id: ${id}.`)
  }
  firebaseRef.child(id).update(obj)
}

var removeNonOptionProps = (surfaceOption) => {
  return nonOptionKeys.reduce((r, k) => r.remove(k), surfaceOption)
}

var persistDesign = persistWithRef.bind(null, designsRef)
var persistLayer = persistWithRef.bind(null, layersRef)

var transitionDesignColors = (direction, state) => {
   var allPalettes = reactor.evaluate(getters.colorPalettes)
   var currentDesign = reactor.evaluate(getters.currentDesign)
   var layers = currentDesign.get('layers').map(layer => {
     var index = allPalettes.findIndex(c => c.get('id') === layer.getIn(['colorPalette', 'id']))
     var newPalette;
     if (direction === 'forward') {
       newPalette = allPalettes.get((index + 1) % allPalettes.count())
     } else if (direction === 'backward') {
       newPalette = allPalettes.get((index - 1) % allPalettes.count())
     }
     persistLayer(layer.get('id'), {'colorPalette':newPalette.get('id')})
     return layer.set('colorPalette', newPalette)
   })
   var newDesign = currentDesign.set('layers', layers)
   return state.set(newDesign.get('id'), newDesign)
}

export default new Nuclear.Store({

  getInitialState() {
    return Nuclear.toImmutable({});
  },

  initialize() {
    this.on('addDesign', (state, design) => {
      design.tags = design.tags ? Object.keys(design.tags) : []
      return state.set(design.id, Immutable.fromJS(design))
    })

    this.on('addManyDesigns', (state, designs) => {
      return designs.reduce((retVal, design) => {
        design.tags = design.tags ? Object.keys(design.tags) : []
        return retVal.set(design.id, Immutable.fromJS(design))
      }, state)
    })

    this.on('deleteDesign', (state, design) => {
      var designId = design.get('id')
      if (state.has(designId)) {
        designsRef.child(designId).remove()
        return state.remove(designId)
      }
      return state
    })

    this.on('loadAdminCreatedDesigns', function(state, design) {
      if (state.count() > 2) { return state }

      var designsQuery = designsRef.orderByChild('adminCreated').equalTo(true)
      designsQuery.on('value', snapshot => {
        var data = snapshot.val()
        var designs = Object.keys(data).map(id => {
          var obj = data[id]
          obj.id = id
          return obj
        })
        var interval = setInterval(() => {
          if (!reactor.__isDispatching) {
            clearInterval(interval)
            reactor.dispatch('addManyDesigns', designs)
          }
        }, 100)
      })
      return state
    })

    this.on('nextDesignColors', (state) => {
      return transitionDesignColors('forward', state)
    })
    this.on('previousDesignColors', (state) => {
      return transitionDesignColors('backward', state)
    })

    this.on('selectLayerImage', (state, layerImage) => {
      var currentDesign = reactor.evaluate(getters.currentDesign)
      var currentLayerId = reactor.evaluate(['currentLayerId'])
      var layers = currentDesign.get('layers')
      var i = layers.findIndex(l => l.get('id') === currentLayerId)
      var newLayers = layers.update(i, v => v.set('selectedLayerImage', layerImage))
      var newDesign = currentDesign.set('layers', newLayers)
      persistLayer(currentLayerId, {'selectedLayerImage': layerImage.get('id')})
      return state.set(newDesign.get('id'), newDesign)
    })

    this.on('toggleCurrentLayer', (state) => {
        var currentDesign = reactor.evaluate(getters.currentDesign)
        var currentLayerId = reactor.evaluate(['currentLayerId'])
        var layers = currentDesign.get('layers')
        var i = layers.findIndex(l => l.get('id') === currentLayerId)
        var currentLayer = layers.get(i)
        var newIsEnabled = !currentLayer.get('isEnabled');
        var newLayers = layers.update(i, v => v.set('isEnabled', newIsEnabled))
        var newDesign = currentDesign.set('layers', newLayers)
        persistLayer(currentLayerId, {'isEnabled': newIsEnabled})
        return state.set(newDesign.get('id'), newDesign)
    })

    this.on('selectColorPalette', (state, colorPalette) => {
      var currentDesign = reactor.evaluate(getters.currentDesign)
      var currentLayerId = reactor.evaluate(['currentLayerId'])
      var layers = currentDesign.get('layers')
      var i = layers.findIndex(l => l.get('id') === currentLayerId)
      var newLayers = layers.update(i, v => v.set('colorPalette', colorPalette).set('paletteRotation', 0))
      var newDesign = currentDesign.set('layers', newLayers)
      persistLayer(currentLayerId, {'colorPalette': colorPalette.get('id')})
      return state.set(newDesign.get('id'), newDesign)
    })

    this.on('selectSurface', (state, surface) => {
      var currentDesign = reactor.evaluate(getters.currentDesign)
      var surfaceOptions = surface.get('options')
      if (!Array.isArray(surfaceOptions.toJS())) {
        var surfaceObj = surface.toJS()
        var designObj = currentDesign.toJS()
        hydrateSurfaceOptionsForSurface(surfaceObj).then(surfaceOptions => {
          surfaceObj.options = surfaceOptions
          var surfaceOption = surfaceObj.options[0]
          designObj.surface = surfaceObj
          designObj.surfaceOption = surfaceOption
          reactor.dispatch('addSurface', surfaceObj)
          reactor.dispatch('addDesign', designObj)
          persistDesign(designObj.id, {
            surface: surfaceObj.id,
            surfaceOption: surfaceOption.id
          })
        })
        return state
      } else {
        var surfaceOption = surfaceOptions.get(0)
        var newDesign = currentDesign.set('surface', surface).set('surfaceOption', surfaceOption)
        persistDesign(newDesign.get('id'), {
          surface: surface.get('id'),
          surfaceOption: surfaceOption.get('id')
        })
        return state.set(newDesign.get('id'), newDesign)
      }
    })


    this.on('selectSurfaceOptionFromKeyValue', (state, keyValObj) => {
      var {key, value} = keyValObj
      var currentDesign = reactor.evaluate(getters.currentDesign)
      var allOptions = currentDesign.getIn(['surface', 'options']).map(removeNonOptionProps)
      var currentOption = currentDesign.get('surfaceOption')
      var toFind = removeNonOptionProps(currentOption).set(key, value)
      toFind = toFind.keySeq().reduce((retVal, key) => {
        var optionsThatMatch = retVal.filter(o => o.get(key) === toFind.get(key))
        if (optionsThatMatch.count() === 0) {
          return retVal
        }
        return optionsThatMatch
      }, allOptions).get(0)
      var found = currentDesign.getIn(['surface', 'options']).find(o => {
        return toFind.every((val, key) => o.get(key) === val)
      })

      return state.set(currentDesign.get('id'), currentDesign.set('surfaceOption', found))
    })

    this.on('rotateCurrentLayerColorPalette', (state) => {
      var currentDesign = reactor.evaluate(getters.currentDesign)
      var currentLayerId = reactor.evaluate(['currentLayerId'])
      var layers = currentDesign.get('layers')
      var i = layers.findIndex(l => l.get('id') === currentLayerId)
      var currentLayer = layers.get(i)
      var newDesign = rotateColorPalette(currentDesign, currentLayer)
      var newRotation = newDesign.getIn(['layers', i, 'paletteRotation'])
      persistLayer(currentLayerId, {'paletteRotation': newRotation})
      return state.set(newDesign.get('id'), newDesign)
    })

    this.on('saveDesign', (state, design) => {
      design.get('layers').forEach(layer => {
        var l = layer.toJS()
        l.colorPalette = l.colorPalette.id
        l.selectedLayerImage = l.selectedLayerImage.id
        layersRef.child(l.id).set(l)
      })
      var firebaseDesign = designPropsToIds(design)
      designsRef.child(design.get('id')).set(firebaseDesign.toJS())
      return state.set(design.get('id'), design)
    })

    this.on('createNewDesign', (state, newDesignData) => {
      var newDesign = newDesignData.design
      var svgEls = newDesignData.svgEls
      var title = newDesign.get('title')
      uploadDesignPreview(title, svgEls, (err, imgUrls) => {
        if (err) {
          console.log('got error: ', err)
          return
        }
        var now = new Date().getTime()
        var design = newDesign.toJS()
        var layerIds = design.layers.map((layer, i) => {
          layer.order = i
          layer.colorPalette = layer.colorPalette.id
          layer.selectedLayerImage = layer.selectedLayerImage.id
          layer.createdAt = now
          layer.updatedAt = now
          layer.layerImages = reactor.evaluate(getters.layerImageIds).toJS()
          var newLayerRef = layersRef.push(layer)
          return newLayerRef.key()
        })
        design.smallImageUrl = imgUrls.small
        design.largeImageUrl = imgUrls.large
        design.layers = layerIds
        design.surfaceOption = defaultSurfaceOptionIdForSurface(surface)
        design.surface = design.surface.id
        design.price = 2000
        design.createdAt = now
        design.updatedAt = now
        var newDesignRef = designsRef.push(design)
        design.id = newDesignRef.key()
        reactor.dispatch('addDesign', design)
      }.bind(this))

      return state
    })

    this.on('updateDesign', (state, designData) => {
      var updatedDesign = designData.design
      var svgEls = designData.svgEls
      var title = updatedDesign.get('title')
      uploadDesignPreview(title, svgEls, (err, imgUrls) => {
        if (err) {
          console.log('got error: ', err)
          return
        }
        var now = new Date().getTime()
        var design = updatedDesign.toJS()
        var layerIds = design.layers.map((layer, i) => {
          var id = layer.id
          delete layer.id
          layer.order = i
          layer.colorPalette = layer.colorPalette.id
          layer.selectedLayerImage = layer.selectedLayerImage.id
          layer.updatedAt = now
          persistLayer(id, layer)
          return id
        })
        var id = design.id
        delete design.id
        design.smallImageUrl = imgUrls.small
        design.largeImageUrl = imgUrls.large
        design.layers = layerIds
        design.surface = design.surface.id
        design.surfaceOption = design.surfaceOption.id
        design.price = 2000
        design.updatedAt = now
        designsRef.child(id).update(design)
        design.id = id
        reactor.dispatch('addDesign', design)
      })
      return state
    })

  }
})
