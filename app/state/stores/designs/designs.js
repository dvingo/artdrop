import Nuclear from 'nuclear-js'
import Immutable from 'Immutable'
import {persistNewDesign,
  defaultSurfaceOptionIdForSurface,
  hydrateSurfaceOptionsForSurface,
  persistDesign, persistLayer, nonOptionKeys,
  idListToFirebaseObj,
  hydrateAdminDesignsOnlyTags, dispatchHelper,
} from 'state/helpers'
import getters from 'state/getters'
import actions from 'state/actions'
import reactor from 'state/reactor'
import {uploadDesignPreview, newId, rotateColorPalette} from 'state/utils'
import {designsRef} from 'state/firebaseRefs'

function l() {
  console.log.apply(console, Array.prototype.slice.call(arguments))
}

var removeNonOptionProps = (surfaceOption) => {
  return nonOptionKeys.reduce((r, k) => r.remove(k), surfaceOption)
}

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

    this.on('setDesignImm', (state, design) => (
      state.set(design.get('id'), design)
    ))

    this.on('addManyDesigns', (state, designs) => {
      return designs.reduce((retVal, design) => {
        if (design.hasOwnProperty('tags')) {
          if(!Array.isArray(design.tags)) {
            design.tags = Object.keys(design.tags)
          }
        } else {
          design.tags = []
        }
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
      if (state.count() > 1) { return state }
      hydrateAdminDesignsOnlyTags().then( designsJs => {
        dispatchHelper('addManyDesigns', designsJs)
      })
      return state
    })

    this.on('nextDesignColors', (state) => {
      return transitionDesignColors('forward', state)
    })
    this.on('previousDesignColors', (state) => {
      return transitionDesignColors('backward', state)
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
        var optionsThatMatch = retVal.filter(o => {
          return o.get(key) === (typeof o.get(key) === 'number'
            ? parseInt(toFind.get(key))
            : toFind.get(key))
        })
        return (optionsThatMatch.count() === 0 ? retVal : optionsThatMatch)
      }, allOptions).get(0)
      var found = currentDesign.getIn(['surface', 'options']).find(o => {
        return toFind.every((val, key) => o.get(key) === val)
      })
      return state.set(currentDesign.get('id'), currentDesign.set('surfaceOption', found))
    })

    this.on('saveDesign', (state, design) => {
      persistNewDesign(design)
      return state.set(design.get('id'), design)
    })
  }
})
