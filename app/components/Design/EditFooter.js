import React from 'react';
import {iconPath} from '../../utils';

export default React.createClass({
	render() {
		return (
			<article class="edit-footer">

				<div class="lower-ui">
					<span class="reset">Reset</span>
					<span class="save">Save</span>

				    <div class="share">
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

			  <div class="lower-ui purchase">
			    <span class="price">$75</span>
			    <span class="buy" type="submit">BUY</span>
			  </div>
			</article>
		)
	}
});