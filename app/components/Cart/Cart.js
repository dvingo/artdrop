import React from 'react'
import Router from 'react-router'
import RenderLayers from 'components/Design/RenderLayers/RenderLayers'
import reactor from 'state/reactor'
import Store from 'state/main'
import getters from 'state/getters'
import {iconPath} from 'utils'
import PaymentForm from 'components/PaymentForm/PaymentForm'
var Route = Router.Route;

export default React.createClass({
  getInitialState() {
    return {
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      cardNumber: '',
      fullName: '',
      expiry: '',
      cvc: ''
    }
  },

  mixins: [reactor.ReactMixin],

  getDataBindings() {
    return {design: Store.getters.currentDesign}
  },

  componentWillMount() {
    Store.actions.selectDesignId(this.props.params.designId);
  },

  handleChange(name, event) {
    this.setState({name: event.target.value})
  },

  handleEmailChange(newEmail) {
    console.log('got email: ', newEmail)
  },

  onInvalidEmail(val) {
    console.log('got invalid email: ', val)
  },

  render() {
    var currentDesign = reactor.evaluate(getters.currentDesign)
    if (currentDesign == null) { return null }

    var value = this.state.value;
    return (
      <div className="cart">
        <div className="canvas-flex-wrapper">
          <span>
            <RenderLayers layers={this.state.design.get('layers')}/>
          </span>
        </div>

        <ul>
          <li>Total:</li>
          <li>${this.state.design.getIn(['surfaceOption', 'salePrice']) / 100}</li>
        </ul>

        <PaymentForm />
      </div>
    )
  }
});
