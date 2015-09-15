var Nuclear = require('nuclear-js');
var Immutable = Nuclear.Immutable
import reactor from 'state/reactor'
import getters from 'state/getters'
import {colorPalettesRef, layersRef} from 'state/firebaseRefs'
import {hydrateAndDispatchColorPalettes} from 'state/helpers'

export default new Nuclear.Store({
  getInitialState() {
    return Nuclear.toImmutable({});
  },

  initialize() {
   this.on('addColorPalette', function(state, colorPalette) {
     return state.set(colorPalette.id, Immutable.fromJS(colorPalette));
   })

   this.on('deleteColorPalette', (state, colorPalette) => {
     var colorPalettes = reactor.evaluate(getters.colorPalettes)
     var replacementColorPalette = colorPalettes.find(color => color.get('id') !== colorPalette.get('id'))
     layersRef.orderByChild('colorPalette').equalTo(colorPalette.get('id')).on('value', snapshot => {
       var layers = snapshot.val()
       if (layers) {
         Object.keys(layers).forEach(layerId => {
           layersRef.child(layerId).update({colorPalette: replacementColorPalette.get('id')})
         })
       }
     })
     colorPalettesRef.child(colorPalette.get('id')).remove()
     return state.remove(colorPalette.get('id'))
   })

   this.on('loadAdminCreateDesignData', state => {
     hydrateAndDispatchColorPalettes(state)
     return state
   })

   this.on('loadAdminColorPalettes', state => {
     hydrateAndDispatchColorPalettes(state)
     return state
   })

   this.on('addManyColorPalettes', (state, colorPalettes) => {
     return colorPalettes.reduce((retVal, colorPalette) => {
       return retVal.set(colorPalette.id, Immutable.fromJS(colorPalette))
     }, state)
   })

   this.on('loadCurrentDesignEditResources', state => {
     hydrateAndDispatchColorPalettes(state)
     return state
   })

   this.on('saveColorPalette', (state, colorPalette) => {
     var now = new Date().getTime()
     colorPalettesRef.child(colorPalette.get('id'))
       .update({
         colorOne: colorPalette.get('colorOne'),
         colorTwo: colorPalette.get('colorTwo'),
         colorThree: colorPalette.get('colorThree'),
         colorFour: colorPalette.get('colorFour'),
         updatedAt: now
       })
     return state.set(colorPalette.get('id'), colorPalette.set('updatedAt', now))
   })

   this.on('createNewColorPalette', (state, colorPalette) => {
     var now = new Date().getTime()
     var newColorObj = {
       colorOne: colorPalette.get('colorOne'),
       colorTwo: colorPalette.get('colorTwo'),
       colorThree: colorPalette.get('colorThree'),
       colorFour: colorPalette.get('colorFour'),
       createdAt: now,
       updatedAt: now
     }
     var newColorRef = colorPalettesRef.push(newColorObj)
     newColorObj.id = newColorRef.key()
     setTimeout(()=> reactor.dispatch('addColorPalette', newColorObj), 50)
     return state
   })

 }
})
