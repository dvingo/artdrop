var Nuclear = require('nuclear-js');
import reactor from 'state/reactor'
import getters from 'state/getters'
import {persistAndCreateNewOrder, persistNewDesign} from '../helpers'
import {makeDesignCopy} from 'state/utils'
import request from 'superagent'
import {serverHostname} from 'config'
var shippingPriceUrl = `${window.location.protocol}//${serverHostname}/shippingPrice`
var createOrderUrl = `${window.location.protocol}//${serverHostname}/orders`

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
      request.get(shippingPriceUrl)
        .query({ zipcode, state, sku })
        .end((err, res) => {
          if (err || res.errors) { return storeState }
          reactor.dispatch('setShippingPriceAndMethod', res.body)
        })
      return storeState
    })

    this.on('createOrder', (state, orderData) => {
      // Need to create a copy of the design that is forever
      // immutable so we can always reference it from the order
      // need to create an order object in firebase.
      var design = makeDesignCopy(reactor.evaluate(getters.currentDesign)).set('isImmutable', true)
      persistNewDesign(design).then(() => {
        var sku = design.getIn(['surfaceOption', 'vendorId'])
        orderData.sku = sku
        orderData.designId = design.get('id')
        orderData.shippingMethodId = state.get('shippingMethodId')
        persistAndCreateNewOrder(orderData).then((orderId) => {
          reactor.dispatch('orderCreatedSuccessfully')
          orderData.orderId = orderId
          request.post(createOrderUrl)
            .send(orderData)
            .end((err, res) => {
              if (err || res.errors) {
                reactor.dispatch('createError', 'Error sending your order, please try again.')
                return state
              }
              console.log('got creat order res: ', res)
          })
        })
      }).catch(() => {
        reactor.dispatch('createError', 'Error sending your order, please try again.')
      })
      return state
    })
  }
})
