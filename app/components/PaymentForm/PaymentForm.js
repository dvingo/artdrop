import React from 'react'
import reactor from 'state/reactor'
import Store from 'state/main'
import getters from 'state/getters'
import {isValidExpiryDate, isExpiryInPast,
  isValidEmail, hasValidLength,
  isValidMonth,
  isValidCreditCardNumber,
  iconPath} from 'utils'
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
  email: (v) => {
    if (!hasValidLength(v)) {
      return 'You must enter an email address'
    }
    return isValidEmail(v) ? '' : 'The email you entered is not valid'
  },
  offerCode: () => {},
  shippingName: (v) => hasValidLength(v) ? '' : 'You must enter a name',
  shippingAddress: (v) => hasValidLength(v) ? '' : 'You must enter an address',
  shippingCity: (v) => hasValidLength(v) ? '' : 'You must enter a city',
  shippingState: (v) => hasValidLength(v) ? '' : 'You must enter a state',
  shippingZipcode: (v) => hasValidLength(v) ? '' : 'You must enter ZIP code',
  ccNumber: (v) => {
    if (!hasValidLength(v)) {
      return 'You must enter a credit card number'
    }
   return isValidCreditCardNumber(v) ? '' : 'The credit card number is not valid'
  },
  ccName: (v) => hasValidLength(v) ? '' : 'You must enter a name',
  ccExpiryDate: (v) => {
    if (!hasValidLength(v)) { return 'You must enter an expiry date' }
    if (!isValidExpiryDate(v)) { return 'Invalid expiry date' }
    if (isExpiryInPast(v)) { return 'The date you entered is in the past' }
    if (!isValidMonth(v)) { return 'The month you entered is invalid' }
    return ''
  },
  ccCvCode: (v) => hasValidLength(v) ? '' : 'You must enter a CV Code'
}

export default React.createClass({

  getInitialState() {
    return {
      email: {value: '', isValid: true, errorMsg: ''},
      offerCode: {value: '', isValid: true, errorMsg: ''},
      shippingName: {value: '', isValid: true, errorMsg: ''},
      shippingAddress: {value: '', isValid: true, errorMsg: ''},
      shippingCity: {value: '', isValid: true, errorMsg: ''},
      shippingState: {value: '', isValid: true, errorMsg: ''},
      shippingZipcode: {value: '', isValid: true, errorMsg: ''},
      ccNumber: {value: '', isValid: true, errorMsg: ''},
      ccName: {value: '', isValid: true, errorMsg: ''},
      ccExpiryDate: {value: '', isValid: true, errorMsg: ''},
      ccCvCode: {value: '', isValid: true, errorMsg: ''}
    }
  },

  onFieldChange(field, e) {
    var val = e.target.value
    var newState = {}
    newState[field] = {
      value: val,
      isValid: true,
      errorMsg: ''
    }
    this.setState(newState)
  },

  onFieldBlur(field) {
    var validation = validations[field]
    var newState = {}
    var val = this.state[field].value
    var errorMsg = validation(val)
    var isValid = errorMsg.length === 0
    newState[field] = {value:val, isValid:isValid, errorMsg:errorMsg}
    this.setState(newState)
  },

  render() {
    var cityField = (
      <CityField
        onChange={this.onFieldChange.bind(null, 'shippingCity')}
        value={this.state.shippingCity.value}
        onBlur={this.onFieldBlur.bind(null, 'shippingCity')}
        errorMsg={this.state.shippingCity.errorMsg}
        key="cityField" />)
    var stateField = (
      <StateField
        onChange={this.onFieldChange.bind(null, 'shippingState')}
        value={this.state.shippingState.value}
        onBlur={this.onFieldBlur.bind(null, 'shippingState')}
        errorMsg={this.state.shippingState.errorMsg}
        key="stateField" />)
    return (
      <div className="PaymentForm">
        <form>
          <div className="field-group">
            <p style={{position:'relative'}}>
              <EmailField onChange={this.onFieldChange.bind(null, 'email')}
                          value={this.state.email.value}
                          key="emailField"
                          onBlur={this.onFieldBlur.bind(null, 'email')}
                          errorMsg={this.state.email.errorMsg}/>
              <GiftIcon />
            </p>

            <p>
              <OfferCodeField onChange={this.onFieldChange.bind(null, 'offerCode')} value={this.state.offerCode.value}
                       key="offerCodeField"   onBlur={this.onFieldBlur.bind(null, 'offerCode')}/>
            </p>
          </div>

          <div className="field-group">
            <div className="header">
              <h2>Shipping Info</h2>
            </div>
            <p><NameField onChange={this.onFieldChange.bind(null, 'shippingName')}
                          value={this.state.shippingName.value}
                          onBlur={this.onFieldBlur.bind(null, 'shippingName')}
                          key="shippingNameField"
                          errorMsg={this.state.shippingName.errorMsg}
                          /></p>
            <p><AddressField onChange={this.onFieldChange.bind(null, 'shippingAddress')}
                          value={this.state.shippingAddress.value}
                             onBlur={this.onFieldBlur.bind(null, 'shippingAddress')}
                             key="shippingAddressField"
                             errorMsg={this.state.shippingAddress.errorMsg}
                          /></p>

              <p>
                {cityField}
              </p>
            <p className="exp-cv-container">
              {stateField}
              <ZipcodeField onChange={this.onFieldChange.bind(null, 'shippingZipcode')}
                          value={this.state.shippingZipcode.value}
                          onBlur={this.onFieldBlur.bind(null, 'shippingZipcode')}
                          key="shippingZipcodeField"
                          errorMsg={this.state.shippingZipcode.errorMsg}
                          />
            </p>
          </div>

          <div className="field-group">
            <div className="header">
              <CCIcons />
              <PayPalButton />
            </div>
            <p><CreditCardField onChange={this.onFieldChange.bind(null, 'ccNumber')} value={this.state.ccNumber.value}
                          onBlur={this.onFieldBlur.bind(null, 'ccNumber')}
                          key="ccNumberField"
                          errorMsg={this.state.ccNumber.errorMsg}
                          /></p>
            <p><NameField onChange={this.onFieldChange.bind(null, 'ccName')}
                          value={this.state.ccName.value}
                          onBlur={this.onFieldBlur.bind(null, 'ccName')}
                          key="ccNameField"
                          errorMsg={this.state.ccName.errorMsg}
                          /></p>
            <p className="exp-cv-container">
              <ExpiryDateField onChange={this.onFieldChange.bind(null, 'ccExpiryDate')} value={this.state.ccExpiryDate.value}
                          onBlur={this.onFieldBlur.bind(null, 'ccExpiryDate')}
                          key="ccExpiryDateField"
                          errorMsg={this.state.ccExpiryDate.errorMsg}
                          />
              <CVCodeField onChange={this.onFieldChange.bind(null, 'ccCvCode')} value={this.state.ccCvCode.value}
                          onBlur={this.onFieldBlur.bind(null, 'ccCvCode')}
                          key="ccCvCodeField"
                          errorMsg={this.state.ccCvCode.errorMsg}
                          />
            </p>
          </div>

          <p><button className="pay-button">Pay</button></p>
        </form>
      </div>
    )
  }
})
