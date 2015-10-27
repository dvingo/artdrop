import React from 'react'
import {imageUrlForSurface} from 'state/utils'
import EditableLabel from 'components/EditableLabel/EditableLabel'

export default React.createClass({

	render () {
		var {surface} = this.props
		var imgUrl = imageUrlForSurface(surface)

		return (
			<div className="SurfaceDetail">
				<div className="SurfaceDetail-text">
					<p>Vendor Name: <em>{surface.get('vendorName')}</em></p>
					<p>Vendor Description: <em>{surface.get('vendorDescription')}</em></p>
					<div className="SurfaceDetail-text-container">
						<EditableLabel value={surface.get('name')}
							labelTag='h1' onChange={this.props.onNameChange}/>


						<EditableLabel value={surface.get('description')}
							editTag='textarea'
							onChange={this.props.onDescriptionChange}/>
					</div>
				</div>

				<div className="SurfaceDetail-image-container">
					<img src={imgUrl}/>
				</div>
			</div>
		)
	}
})