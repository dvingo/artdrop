var Nuclear = require('nuclear-js')

export default new Nuclear.Store({
  getInitialState() { return '' },

  initialize() {
    this.on('selectLayerId', (state, layerId) => layerId)
    this.on('selectDesignAndLayerId', (state, ids) => ids.layerId )
  }

})
