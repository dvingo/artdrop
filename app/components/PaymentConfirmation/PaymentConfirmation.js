import React from 'react'
import RenderLayers from 'components/Design/RenderLayers/RenderLayers'
import reactor from 'state/reactor'
import Store from 'state/main'
import {imageUrlForSurface} from 'state/utils'
import Errors from 'components/Errors/Errors'

export default React.createClass({
  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {
      design: Store.getters.currentDesign,
      designPrice: Store.getters.currentDesignPrice,
      shippingPrice: Store.getters.shippingPrice,
      cartTotalPrice: Store.getters.cartTotalPrice
    }
  },

  render() {
    var design = this.state.design
    if (design == null) { return null }

    var shippingPrice = this.state.shippingPrice
    var total = this.state.cartTotalPrice
    return (
      <div className="PaymentConfirmation">
        <h2>Your order was placed!</h2>
        <div className="Cart-canvas-flex-wrapper">
          <span>
            <RenderLayers layers={design.get('layers')}/>
          </span>
        </div>

        <div className="Cart-surface-info">
          <h2>Printed on: <span className="val">{design.getIn(['surface', 'name'])}</span></h2>
          <img src={imageUrlForSurface(design.get('surface'))}/>
        </div>

        <div className="Cart-price-info">
          <h2>Shipping Price: <span className="val">{shippingPrice}</span></h2>
          <h2>Item Price: <span className="val">${this.state.designPrice}</span></h2>
          <h2>Total: <span className="val">${total}</span></h2>
        </div>

      </div>
    )
  }
})
