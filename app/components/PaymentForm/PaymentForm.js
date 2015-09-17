import React from 'react'
import Router from 'react-router'
import RenderLayers from 'components/Design/RenderLayers/RenderLayers'
import reactor from 'state/reactor'
import Store from 'state/main'
import getters from 'state/getters'
import {iconPath} from 'utils'
import EmailField from './EmailField/EmailField'
import OfferCodeField from './OfferCodeField/OfferCodeField'
import CCIcons from './CCIcons/CCIcons'

export default React.createClass({

  render() {
    return (
      <div className="form-container">
        <form>
          <div className="envelope">
            <p>
              <EmailField placeholder="Your email address" onChange={this.handleEmailChange}
                  onInvalidInput={this.onInvalidEmail}/>

              <a className="gift-trigger" href="#">
                <i className="icn auth gift">
                  <img src={iconPath("gift_icon.svg")}/>
                </i>
                <span>Give as a gift</span>
              </a>
            </p>

            <p>
              <OfferCodeField placeholder="PLace" onChange={this.handleEmailChange}
                  onInvalidInput={this.onInvalidEmail}/>
            </p>
            <div className="gift-element " style={{'display': 'none'}}></div>
            <p className="gift-element " style={{'display': 'none'}}>
              <label htmlFor="giftee_email">Gift details:</label>
              <input className="email" name="giftee_email" placeholder="Recipient email address" type="email"/>
              <textarea name="gift_note" placeholder="A personalized message (optional)" type="text"></textarea>
            </p>
            <div className="js-shipping-information-container"></div>
            <ul id="custom-fields">
            </ul>
            <div className="js-shipping-information-container">
            </div>
          </div>

          <div className="credit_card_holder">
            <div className="flipper">
              <div className="new-card credit_card">
                <div className="stripe-card-info">
                  <CCIcons />
                  <div className="paypal" style={{'display': 'block'}}>
                    <i className="gi-paypal">
                      <img src={iconPath("paypal_color_icon.png")}/>
                    </i>
                  </div>
                  <p className="or-pay-with " style={{'display': 'block'}}>or pay with</p>
                </div>
                <p>
                  <label>Card Number</label>
                  <span className="cc_number_security_indicator"></span>
                  <span></span>
                  <span className="cc_security_blurb">We do not keep any of your sensitive credit card information on file with us unless you ask us to after this purchase is complete.</span>
                  <input className="cc_number" maxLength="19" pattern="\d*" placeholder="1234 5679 9012 3456" type="tel"/>
                </p>
                <p className="label">
                  <label htmlFor="expiry_date">Expiry Date</label>
                  <input className="expiry_date" maxLength="7" pattern="\d*" placeholder="MM / YY" type="tel"/>
                </p>
                <p className="full-name-p" style={{'display': 'block'}}>
                  <label for="full_name">Full name</label>
                  <input name="full_name" placeholder="John Doe" type="text"/>
                </p>
                <p className="cv_code_p">
                  <label for="cv_code">CV Code</label>
                  <input autocomplete="off" className="cv_code numberic required" id="cvc" maxLength="4" pattern="\d*" placeholder="123" type="tel"/>
                </p>
              </div>
              <div className="pay-by-paypal credit_card">
                <div className="stripe-card-info">
                  <i className="gi gi-paypal"></i>
                  <i className="gi gi-crdit-card js-cancel-pay-with-paypal-trigger"></i>
                  <p className="or-pay-with">or pay with</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pay_button_container">
            <button className="button button-primary pay_button" data-tipsy-gravity="n">Pay</button>
          </div>
        </form>
      </div>
    )
  }
});
