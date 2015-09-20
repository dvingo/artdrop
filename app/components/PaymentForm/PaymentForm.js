import React from 'react'
import reactor from 'state/reactor'
import Store from 'state/main'
import getters from 'state/getters'
import {isValidEmail, hasValidLength, isValidCreditCardNumber, iconPath} from 'utils'
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
import classNames from 'classnames'

var validations = {
  email: isValidEmail,
  offerCode: hasValidLength,
  shippingName: hasValidLength,
  shippingAddress: hasValidLength,
  shippingCity: hasValidLength,
  shippingState: hasValidLength,
  shippingZipcode: hasValidLength,
  ccNumber: isValidCreditCardNumber,
  ccName: hasValidLength,
  ccExpiryDate: hasValidLength,
  ccCvCode: hasValidLength
}

export default React.createClass({

  getInitialState() {
    return {
      email: {value: '', isValid: true},
      offerCode: {value: '', isValid: true},
      shippingName: {value: '', isValid: true},
      shippingAddress: {value: '', isValid: true},
      shippingCity: {value: '', isValid: true},
      shippingState: {value: '', isValid: true},
      shippingZipcode: {value: '', isValid: true},
      ccNumber: {value: '', isValid: true},
      ccName: {value: '', isValid: true},
      ccExpiryDate: {value: '', isValid: true},
      ccCvCode: {value: '', isValid: true}
    }
  },

  onFieldChange(field, e) {
    var val = e.target.value
    var newState = {}
    newState[field] = {value:val, isValid:this.state[field].isValid}
    this.setState(newState)
  },

  onFieldBlur(field) {
    var validation = validations[field]
    var newState = {}
    var val = this.state[field].value
    newState[field] = {value:val, isValid: validation(val)}
    this.setState(newState)
  },

  render() {
    return (
      <div className="form-container">
        <form>
          <div className="field-group">
            <p style={{position:'relative'}}>
              <EmailField onChange={this.onFieldChange.bind(null, 'email')}
                          value={this.state.email.value}
                          onBlur={this.onFieldBlur.bind(null, 'email')}/>
              <GiftIcon />
            </p>

            <p>
              <OfferCodeField onChange={this.onFieldChange.bind(null, 'offerCode')} value={this.state.offerCode.value}
                          onBlur={this.onFieldBlur.bind(null, 'offerCode')}/>
            </p>
          </div>

          <div className="field-group">
            <div className="header">
              <h2>Shipping Info</h2>
            </div>
            <p><NameField onChange={this.onFieldChange.bind(null, 'shippingName')} value={this.state.shippingName.value}
                          onBlur={this.onFieldBlur.bind(null, 'shippingName')}
                          /></p>
            <p><AddressField onChange={this.onFieldChange.bind(null, 'shippingAddress')} value={this.state.shippingAddress.value}
                             onBlur={this.onFieldBlur.bind(null, 'shippingAddress')}
                          /></p>
            <p className={classNames("exp-cv-container", {error: !(this.state.shippingCity.isValid && this.state.shippingState.isValid)})}>
              <CityField onChange={this.onFieldChange.bind(null, 'shippingCity')} value={this.state.shippingCity.value}
                          onBlur={this.onFieldBlur.bind(null, 'shippingCity')}
                          />
              <StateField onChange={this.onFieldChange.bind(null, 'shippingState')} value={this.state.shippingState.value}
                          onBlur={this.onFieldBlur.bind(null, 'shippingState')}
                          />
            </p>
            <p> <ZipcodeField onChange={this.onFieldChange.bind(null, 'shippingZipcode')} value={this.state.shippingZipcode.value}
                          onBlur={this.onFieldBlur.bind(null, 'shippingZipcode')}
                          /> </p>
          </div>

          <div className="field-group">
            <div className="header">
              <CCIcons />
              <PayPalButton />
            </div>
            <p><CreditCardField onChange={this.onFieldChange.bind(null, 'ccNumber')} value={this.state.ccNumber.value}
                          onBlur={this.onFieldBlur.bind(null, 'ccNumber')}
                          /></p>
            <p><NameField  onChange={this.onFieldChange.bind(null, 'ccName')} value={this.state.ccName.value}
                          onBlur={this.onFieldBlur.bind(null, 'ccName')}
                          /></p>
            <p className="exp-cv-container">
              <ExpiryDateField onChange={this.onFieldChange.bind(null, 'ccExpiryDate')} value={this.state.ccExpiryDate.value}
                          onBlur={this.onFieldBlur.bind(null, 'ccExpiryDate')}
                          />
              <CVCodeField onChange={this.onFieldChange.bind(null, 'ccCvCode')} value={this.state.ccCvCode.value}
                          onBlur={this.onFieldBlur.bind(null, 'ccCvCode')}
                          />
            </p>
          </div>

          <p><button className="pay-button">Pay</button></p>
        </form>
      </div>
    )
  }
})
