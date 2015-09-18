import React from 'react'
import {iconPath} from 'utils'

export default React.createClass({
	render() {
		return (
			<article className="EditFooter edit-footer">

				<div className="EditFooter-lower-ui lower-ui">
					<span className="EditFooter-reset reset">Reset</span>
					<span className="EditFooter-save save">Save</span>
					<div className="EditFooter-share share">
						<span>
							<img src={iconPath('twitter_logo.svg')}/>
						</span>
						<span>
							<img src={iconPath('pinterest_logo.svg')}/>
						</span>
						<span>
							<img src={iconPath('facebook_logo.svg')}/>
						</span>
					</div>
				</div>

				<div className="EditFooter-lower-ui-purchase lower-ui purchase">
					<span className="EditFooter-price price">$75</span>
					<span className="Icon-buy" type="submit">BUY</span>
				</div>
			</article>
		)
	}
});