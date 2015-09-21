var Nuclear = require('nuclear-js');
import reactor from 'state/reactor'
import getters from 'state/getters'
import request from 'superagent'
import {serverHostname} from 'config'

function persistSurfaceImm(surface) {
  var s = surface.toJS()
  var surfaceId = s.id
  delete s.id
  persistSurface(surfaceId, s)
}

export default new Nuclear.Store({
  getInitialState() {
    return Nuclear.toImmutable({ shippingPrice: 0 })
  },

  initialize() {

    this.on('setShippingPriceAndMethod', (store, shippingData) => {
      return (store.set('shippingPrice', shippingData.price)
                   .set('shippingMethodId', shippingData.shippingMethodId))
    })

    this.on('getShipPrice', (storeState, shipData) => {
      console.log('got ship price action')
      var { zipcode, state } = shipData

      var sku = reactor.evaluate(getters.currentDesign)
                       .getIn(['surfaceOption', 'vendorId'])

      console.log('hostname is: ', serverHostname)
      var url = `${window.location.protocol}//${serverHostname}/shippingPrice`
    console.log('url is: ', url)
      request
        .get(url)
        .query({ zipcode, state, sku })
        .end((err, res) => {
          if (err) { return storeState }
          // TODO error handling and checking here.
          reactor.dispatch('setShippingPriceAndMethod', res.body)
          console.log('got ship price: ', res)
        })
      return storeState.set('shippingPrice', 0)
    })
  }
})

