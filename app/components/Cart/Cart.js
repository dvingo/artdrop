import React from 'react'
import RenderLayers from 'components/Design/RenderLayers/RenderLayers'
import Router from 'react-router'
import reactor from 'state/reactor'
import Store from 'state/main'
import {imageUrlForSurface} from 'state/utils'
import PaymentForm from 'components/PaymentForm/PaymentForm'
import Errors from 'components/Errors/Errors'

export default React.createClass({
  mixins: [reactor.ReactMixin, Router.Navigation],

  getDataBindings() {
    return {
      design: Store.getters.currentDesign,
      designPrice: Store.getters.currentDesignPrice,
      shippingPrice: Store.getters.shippingPrice,
      cartTotalPrice: Store.getters.cartTotalPrice,
      orderWasCreatedSuccessfuly: Store.getters.orderWasCreatedSuccessfuly,
      orderCreatedId: Store.getters.orderCreatedId
    }
  },

  componentWillMount() {
    Store.actions.selectDesignId(this.props.params.designId);
  },

  componentWillUpdate(nextProps, nextState) {
    if (nextState.orderWasCreatedSuccessfuly) {
      setTimeout(() => {
        this.transitionTo('paymentConfirmation', {orderId: this.state.orderCreatedId})
      }, 0)
    }
  },

  render() {
    var design = this.state.design
    if (design == null) { return null }

    var hasShippingPrice = this.state.shippingPrice != null
    var shippingPrice = (this.state.shippingPrice
      ? '$' + this.state.shippingPrice
      : 'Shipping will be calculated after you enter an address.')
    var total = this.state.cartTotalPrice
    return (
      <div className="Cart cart">
        <div className="Cart-left">
          <RenderLayers layers={design.get('layers')}/>

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

        <PaymentForm />

        <Errors />
      </div>
    )
  }
})
