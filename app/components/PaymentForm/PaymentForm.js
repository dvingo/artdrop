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

  render() {
    return (
      <div className="form-container">
        <form>
          <div className="field-group">
            <p style={{position:'relative'}}>
              <EmailField placeholder="Your email address" onChange={this.handleEmailChange}
                  onInvalidInput={this.onInvalidEmail}/>
              <GiftIcon />
            </p>

            <p>
              <OfferCodeField placeholder="PLace" onChange={this.handleEmailChange}
                  onInvalidInput={this.onInvalidEmail}/>
            </p>
          </div>

          <div className="field-group">
            <div className="header">
              <h2>Shipping Info</h2>
            </div>
            <p><NameField /></p>
            <p><AddressField /></p>
            <p className="exp-cv-container">
              <CityField />
              <StateField />
            </p>
            <p> <ZipcodeField /> </p>
          </div>

          <div className="field-group">
            <div className="header">
              <CCIcons />
              <PayPalButton />
            </div>
            <p><CreditCardField /></p>
            <p><NameField /></p>
            <p className="exp-cv-container">
              <ExpiryDateField />
              <CVCodeField />
            </p>
          </div>

          <p><button className="pay-button">Pay</button></p>
        </form>
      </div>
    )
  }
});
