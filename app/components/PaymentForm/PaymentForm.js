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
import PhoneField  from './PhoneField/PhoneField'
import OfferCodeField from './OfferCodeField/OfferCodeField'
import PayPalButton from './PayPalButton/PayPalButton'
import StateField from './StateField/StateField'
import ZipcodeField from './ZipcodeField/ZipcodeField'
import validations from './validations'
import classNames from 'classnames'
import config from 'config'
var RSVP = require('rsvp')

function monthAndYearFromDate(date) {
  var vals = date.match(/(\d{1,2})\s*\/\s*(\d{2})/)
  if (!vals) { return }
  return {month: vals[1], year: '20' + vals[2]}
}

function getStripeToken(state, onComplete) {
  var { ccNumber, ccExpiryDate, ccCvCode } = state
  var { month, year } = monthAndYearFromDate(ccExpiryDate.value)
  var data = { number:ccNumber.value, cvc:ccCvCode.value, exp_month:month, exp_year: year }
  Stripe.createToken(data, (status, resp) => {
    if (resp.error) {
      onComplete("Error submitting credit card.")
    } else {
      onComplete(null, resp.id)
    }
  })
}

var fieldsNeededToCalculateShipping = [
  'shippingState', 'shippingZipcode'
]

function areShippingFieldsValid(state) {
  return fieldsNeededToCalculateShipping.every(
      f => validations[f](state[f].value) === '')
}

function calculateShippingIfUpdated(nextState, currentState) {
  var fieldsDidChange = fieldsNeededToCalculateShipping.some(field => {
    return ((validations[field](nextState[field].value) === '') &&
        nextState[field].value !== currentState[field].value)
  })
  if (fieldsDidChange && areShippingFieldsValid(nextState)) {
    Store.actions.getShipPrice({
      zipcode: nextState.shippingZipcode.value,
      state: nextState.shippingState.value
    })
  }
}

function areAllFieldsValid(state) {
  var fields = ['email', 'shippingFirstName', ,'shippingLastName',
    'shippingPhoneNumber', 'shippingAddress', 'shippingCity',
    'shippingState', 'shippingZipcode', 'ccNumber', 'ccName', 'ccExpiryDate',
    'ccCvCode' ]
  return fields.every(f => validations[f](state[f].value) === '')
}

export default React.createClass({

  getInitialState() {
    return {
      email:               {value: '', isValid: false, errorMsg: ''},
      offerCode:           {value: '', isValid: false, errorMsg: ''},
      shippingFirstName:   {value: '', isValid: false, errorMsg: ''},
      shippingLastName:    {value: '', isValid: false, errorMsg: ''},
      shippingPhoneNumber: {value: '', isValid: false, errorMsg: ''},
      shippingAddress:     {value: '', isValid: false, errorMsg: ''},
      shippingCity:        {value: '', isValid: false, errorMsg: ''},
      shippingState:       {value: '', isValid: false, errorMsg: ''},
      shippingZipcode:     {value: '', isValid: false, errorMsg: ''},
      ccNumber:            {value: '', isValid: false, errorMsg: ''},
      ccName:              {value: '', isValid: false, errorMsg: ''},
      ccExpiryDate:        {value: '', isValid: false, errorMsg: ''},
      ccCvCode:            {value: '', isValid: false, errorMsg: ''}
    }
  },

  onFieldChange(field, e) {
    var newState = {}
    var isValid = validations[field](e.target.value) === ''
    newState[field] = { value:e.target.value, isValid:isValid, errorMsg:'' }
    this.setState(newState)
  },

  onFieldBlur(field) {
    var validation = validations[field]
    var val = this.state[field].value
    var errorMsg = validation(val)
    var isValid = errorMsg.length === 0
    var newState = {}
    newState[field] = { value:val, isValid:isValid, errorMsg:errorMsg }
    this.setState(newState)
  },

  componentWillMount() {
    Stripe.setPublishableKey(config.stripePublishableKey)
  },

  componentWillUpdate(nextProps, nextState) {
    calculateShippingIfUpdated(nextState, this.state)
  },

  getShipPrice(e) {
    e.preventDefault()
    Store.actions.getShipPrice({
      zipcode: this.state.shippingZipcode.value,
      state: this.state.shippingState.value
    })
  },

  onPayButtonClick(e) {
    e.preventDefault()
    if (!areAllFieldsValid(this.state)) { return }

    getStripeToken(this.state, (err, token) => {
      let { shippingFirstName, shippingLastName, shippingPhoneNumber,
        shippingAddress, shippingCity,
        shippingState, shippingZipcode, email } = this.state

      if (err) {
        Store.actions.createError(err)
        return
      }

      Store.actions.createOrder({
        shippingFirstName:   shippingFirstName.value,
        shippingLastName:    shippingLastName.value,
        shippingPhoneNumber: shippingPhoneNumber.value,
        shippingAddress:     shippingAddress.value,
        shippingCity:        shippingCity.value,
        shippingState:       shippingState.value,
        shippingZipcode:     shippingZipcode.value,
        ccToken:             token,
        email:               email.value
      })
    })
  },

  render() {
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
              <OfferCodeField
                onChange={this.onFieldChange.bind(null, 'offerCode')}
                value={this.state.offerCode.value}
                key="offerCodeField"
                onBlur={this.onFieldBlur.bind(null, 'offerCode')}/>
            </p>
          </div>

          <div className="field-group">
            <div className="header">
              <h2>Shipping Info</h2>
            </div>

            <p className="multifield-line">
              <NameField
                onChange={this.onFieldChange.bind(null, 'shippingFirstName')}
                label="first name"
                placeholder="John"
                className="firstName"
                value={this.state.shippingFirstName.value}
                onBlur={this.onFieldBlur.bind(null, 'shippingFirstName')}
                key="shippingFirstNameField"
                errorMsg={this.state.shippingFirstName.errorMsg} />

              <NameField
                onChange={this.onFieldChange.bind(null, 'shippingLastName')}
                label="last name"
                placeholder="McCarthy"
                className="lastName"
                value={this.state.shippingLastName.value}
                onBlur={this.onFieldBlur.bind(null, 'shippingLastName')}
                key="shippingLastNameField"
                errorMsg={this.state.shippingLastName.errorMsg} />
            </p>

            <p>
              <PhoneField
                onChange={this.onFieldChange.bind(null, 'shippingPhoneNumber')}
                value={this.state.shippingPhoneNumber.value}
                onBlur={this.onFieldBlur.bind(null, 'shippingPhoneNumber')}
                key="shippingPhoneNumber"
                errorMsg={this.state.shippingPhoneNumber.errorMsg} />
            </p>

            <p>
              <AddressField
                onChange={this.onFieldChange.bind(null, 'shippingAddress')}
                value={this.state.shippingAddress.value}
                onBlur={this.onFieldBlur.bind(null, 'shippingAddress')}
                key="shippingAddressField"
                errorMsg={this.state.shippingAddress.errorMsg} />
            </p>

            <p>
              <CityField
                onChange={this.onFieldChange.bind(null, 'shippingCity')}
                value={this.state.shippingCity.value}
                onBlur={this.onFieldBlur.bind(null, 'shippingCity')}
                errorMsg={this.state.shippingCity.errorMsg}
                key="cityField" />
            </p>

            <p className="multifield-line">
              <StateField
                onChange={this.onFieldChange.bind(null, 'shippingState')}
                value={this.state.shippingState.value}
                onBlur={this.onFieldBlur.bind(null, 'shippingState')}
                errorMsg={this.state.shippingState.errorMsg}
                key="stateField" />
              <ZipcodeField
                onChange={this.onFieldChange.bind(null, 'shippingZipcode')}
                value={this.state.shippingZipcode.value}
                onBlur={this.onFieldBlur.bind(null, 'shippingZipcode')}
                key="shippingZipcodeField"
                errorMsg={this.state.shippingZipcode.errorMsg} />
            </p>
          </div>

          <div className="field-group">

            <div className="header">
              <CCIcons />
              <PayPalButton />
            </div>

            <p>
              <CreditCardField
                onChange={this.onFieldChange.bind(null, 'ccNumber')}
                value={this.state.ccNumber.value}
                onBlur={this.onFieldBlur.bind(null, 'ccNumber')}
                key="ccNumberField"
                errorMsg={this.state.ccNumber.errorMsg}/>
            </p>

            <p>
              <NameField
                onChange={this.onFieldChange.bind(null, 'ccName')}
                value={this.state.ccName.value}
                onBlur={this.onFieldBlur.bind(null, 'ccName')}
                key="ccNameField"
                errorMsg={this.state.ccName.errorMsg} />
            </p>

            <p className="multifield-line">
              <ExpiryDateField
                onChange={this.onFieldChange.bind(null, 'ccExpiryDate')}
                value={this.state.ccExpiryDate.value}
                onBlur={this.onFieldBlur.bind(null, 'ccExpiryDate')}
                key="ccExpiryDateField"
                errorMsg={this.state.ccExpiryDate.errorMsg} />
              <CVCodeField
                onChange={this.onFieldChange.bind(null, 'ccCvCode')}
                value={this.state.ccCvCode.value}
                onBlur={this.onFieldBlur.bind(null, 'ccCvCode')}
                key="ccCvCodeField"
                errorMsg={this.state.ccCvCode.errorMsg} />
            </p>
          </div>

          <p>
            <button className={classNames("pay-button",
              {disabled: !areAllFieldsValid(this.state)})}
              onClick={this.onPayButtonClick}>Pay</button>
          </p>
          { areShippingFieldsValid(this.state) ?
            <p><button className="pay-button" onClick={this.getShipPrice}>Update Shipping Price</button></p>
            : null }
        </form>
      </div>
    )
  }
})
