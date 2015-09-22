var Nuclear = require('nuclear-js');
import reactor from 'state/reactor'
import getters from 'state/getters'
import request from 'superagent'
import {serverHostname} from 'config'

export default new Nuclear.Store({

  getInitialState() {
    return Nuclear.toImmutable({ shippingPrice: null })
  },

  initialize() {

    this.on('setShippingPriceAndMethod', (store, shippingData) => {
      return (store.set('shippingPrice', shippingData.price)
                   .set('shippingMethodId', shippingData.shippingMethodId))
    })

    this.on('getShipPrice', (storeState, shipData) => {
      var { zipcode, state } = shipData
      var sku = reactor.evaluate(getters.currentDesign)
                       .getIn(['surfaceOption', 'vendorId'])
      var url = `${window.location.protocol}//${serverHostname}/shippingPrice`
      request
        .get(url)
        .query({ zipcode, state, sku })
        .end((err, res) => {
          if (err || res.errors) { return storeState }
          reactor.dispatch('setShippingPriceAndMethod', res.body)
        })
      return storeState
    })
  }
})

