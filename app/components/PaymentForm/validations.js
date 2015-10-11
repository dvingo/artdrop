import {
  isValidExpiryDate,
  isExpiryInPast,
  isValidEmail,
  hasValidLength,
  isValidMonth,
  isValidCreditCardNumber,
  hasValidZipcodeLength,

} from 'utils'

export default {
  email: (v) => {
    if (!hasValidLength(v)) {
      return 'You must enter an email address'
    }
    return isValidEmail(v) ? '' : 'The email you entered is not valid'
  },
  offerCode: () => {},
  shippingFirstName: (v) => hasValidLength(v) ? '' : 'You must enter a first name',
  shippingLastName: (v) => hasValidLength(v) ? '' : 'You must enter a last name',
  shippingPhoneNumber: (v) => hasValidLength(v) ? '' : 'You must enter a phone number',
  shippingAddress: (v) => hasValidLength(v) ? '' : 'You must enter an address',
  shippingCity: (v) => hasValidLength(v) ? '' : 'You must enter a city',
  shippingState: (v) => v.length === 2 ? '' : 'You must enter a state',
  shippingZipcode: (v) => hasValidZipcodeLength(v) ? '' : 'You must enter ZIP code',
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
