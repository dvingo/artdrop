import React from 'react'
import reactor from 'state/reactor'
import Store from 'state/main'
import getters from 'state/getters'
import {iconPath} from 'utils'
import AddressField  from './AddressField/AddressField'
import CityField from './CityField/CityField'
import CCIcons from './CCIcons/CCIcons'
import CreditCardField  from './CreditCardField/CreditCardField'
import CVCodeField from './CVCodeField/CVCodeField'
import EmailField from './EmailField/EmailField'
import ExpiryDateField  from './ExpiryDateField/ExpiryDateField'
import GiftIcon from './GiftIcon/GiftIcon'
import NameField  from './NameField/NameField'
import OfferCodeField from './OfferCodeField/OfferCodeField'
import PayPalButton from './PayPalButton/PayPalButton'
import StateField from './StateField/StateField'
import ZipcodeField from './ZipcodeField/ZipcodeField'

export default React.createClass({

  getInitialState() {
    return {
      email: '',
      offerCode: '',
      shippingName: '',
      shippingAddress: '',
      shippingCity: '',
      shippingState: '',
      shippingZipcode: '',
      ccNumber: '',
      ccName: '',
      ccExpiryDate: '',
      ccCvCode: ''
    }
  },

  onFieldChange(field, e) {
    var newState = {}
    newState[field] = e.target.value
    this.setState(newState)
  },

  render() {
    return (
      <div className="form-container">
        <form>
          <div className="field-group">
            <p style={{position:'relative'}}>
              <EmailField onChange={this.onFieldChange.bind(null, 'email')} value={this.state.email}/>
              <GiftIcon />
            </p>

            <p>
              <OfferCodeField  onChange={this.onFieldChange.bind(null, 'offerCode')} value={this.state.offerCode}/>
            </p>
          </div>

          <div className="field-group">
            <div className="header">
              <h2>Shipping Info</h2>
            </div>
            <p><NameField onChange={this.onFieldChange.bind(null, 'shippingName')} value={this.state.shippingName}/></p>
            <p><AddressField onChange={this.onFieldChange.bind(null, 'shippingAddress')} value={this.state.shippingAddress}/></p>
            <p className="exp-cv-container">
              <CityField onChange={this.onFieldChange.bind(null, 'shippingCity')} value={this.state.shippingCity}/>
              <StateField onChange={this.onFieldChange.bind(null, 'shippingState')} value={this.state.shippingState}/>
            </p>
            <p> <ZipcodeField onChange={this.onFieldChange.bind(null, 'shippingZipcode')} value={this.state.shippingZipcode}/> </p>
          </div>

          <div className="field-group">
            <div className="header">
              <CCIcons />
              <PayPalButton />
            </div>
            <p><CreditCardField onChange={this.onFieldChange.bind(null, 'ccNumber')} value={this.state.ccNumber}/></p>
            <p><NameField  onChange={this.onFieldChange.bind(null, 'ccName')} value={this.state.ccName}/></p>
            <p className="exp-cv-container">
              <ExpiryDateField onChange={this.onFieldChange.bind(null, 'ccExpiryDate')} value={this.state.ccExpiryDate}/>
              <CVCodeField onChange={this.onFieldChange.bind(null, 'ccCvCode')} value={this.state.ccCvCode}/>
            </p>
          </div>

          <p><button className="pay-button">Pay</button></p>
        </form>
      </div>
    )
  }
});
