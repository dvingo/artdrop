import React from 'react';
import Router from 'react-router';
import RenderLayers from './Design/RenderLayers.js';
import reactor from '../state/reactor';
import Store from '../state/main';
import getters from '../state/getters';
import {iconPath} from '../utils';
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
					<li>$75</li>
				</ul>
				<div className="form-container">
					<form action>
						<div className="envelope">
							<p className="email-p">
								<input className="first email required" name="email" placeholder="Your email address" type="email" value={value} onChange={this.handleChange.bind(null, 'email')}/>
								<a className="gift-trigger" href="#">
									<i className="icn auth gift">
										<img src={iconPath("gift_icon.svg")}/>
									</i>
									<span>Give as a gift</span>
								</a>
							</p>
							<p className="offer-code-p">
								<input className="offer_code_field" placeholder="Offer code (optional)" type="text"/>
							</p>
							<div className="gift-element soft-hidden" style={{'display': 'none'}}></div>
							<p className="gift-element soft-hidden" style={{'display': 'none'}}>
								<label for="giftee_email">Gift details:</label>
								<input className="email" name="giftee_email" placeholder="Recipient email address" type="email"/>
								<textarea name="gift_note" placeholder="A personalized message (optional)" type="text"></textarea>
							</p>
							<div className="js-shipping-information-container"></div>
							<ul id="custom-fields">
							</ul>
							<div className="js-shipping-information-container">
							</div>
						</div>

						<div className="credit_card_holder" data-form-state="new">
							<div className="flipper">
								<div className="new-card credit_card">
									<div className="stripe-card-info">
										<i className="gi gi-credit-card soft-hidden js-credit-card-icon" style={{'display': 'inline'}}>
											<img src={iconPath("cc_visa.png")}/>
										</i>
										<i className="gi gi-credit-card soft-hidden js-credit-card-icon" style={{'display': 'inline'}}>
											<img src={iconPath("cc_mastercard.png")}/>
										</i>
										<i className="gi gi-credit-card soft-hidden js-credit-card-icon" style={{'display': 'inline'}}>
											<img src={iconPath("cc_american_express.png")}/>
										</i>
										<i className="gi gi-credit-card soft-hidden js-credit-card-icon" style={{'display': 'inline'}}>
											<img src={iconPath("cc_discover.png")}/>
										</i>
										<div className="paypal soft-hidden" style={{'display': 'block'}}>
											<i className="gi gi-paypal">
												<img src={iconPath("paypal_color_icon.png")}/>
											</i>
										</div>
										<p className="or-pay-with soft-hidden" style={{'display': 'block'}}>or pay with</p>
									</div>
									<p>
										<label for="cc_number">Card Number</label>
										<span className="cc_number_security_indicator"></span>
										<span className="cc-icon soft-hidden js-cc-icon"></span>
										<span className="cc_security_blurb">We do not keep any of your sensitive credit card information on file with us unless you ask us to after this purchase is complete.</span>
										<input autocompletetype="cc-number" className="cc_number numeric-spaces required" id="cc_number" maxlength="19" pattern="\d*" placeholder="1234 5679 9012 3456" type="tel"/>
									</p>
									<p className="js-expiry_date_p expiry-date-p">
										<label for="expiry_date">Expiry Date</label>
										<input autocompletetype="cc-exp" className="expiry_date numeric required" id="expiry_date" maxlength="7" pattern="\d*" placeholder="MM / YY" type="tel"/>
									</p>
									<p className="soft-hidden js-full-name-p full-name-p" style={{'display': 'block'}}>
										<label for="full_name">Full name</label>
										<input className="required js-full-name-input" name="full_name" placeholder="John Doe" type="text"/>
									</p>
									<p className="cv_code_p">
										<label for="cv_code">CV Code</label>
										<input autocomplete="off" autocompletetype="cc-csc" className="cv_code numberic required" id="cvc" maxlength="4" pattern="\d*" placeholder="123" type="tel"/>
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
							<button className="button button-primary pay_button" data-default="Pay" data-tipsy-gravity="n">Pay</button>
						</div>
					</form>
				</div>
			</div>
		)
	}
});