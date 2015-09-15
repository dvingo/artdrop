import React from 'react'
import {iconPath} from 'utils'

export default React.createClass({
	render() {
		return (
			<article className="edit-footer">

				<div className="lower-ui">
					<span className="reset">Reset</span>
					<span className="save">Save</span>
					<div className="share">
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

				<div className="lower-ui purchase">
					<span className="price">$75</span>
					<span className="buy" type="submit">BUY</span>
				</div>
			</article>
		)
	}
});