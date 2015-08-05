var Nuclear = require('nuclear-js');
export default new Nuclear.Store({
  getInitialState() { return false },

  initialize() {
   this.on('layerReplacementComplete', () => false)

   this.on('selectLayerImage', () => true)
  }
})
