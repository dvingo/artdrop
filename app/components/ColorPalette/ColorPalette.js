import React from 'react'

export default React.createClass({
	render() {
		var palette = this.props.palette
		var currentPalette = this.props.currentPalette
		var style = {}
		
		if ((currentPalette && palette) && currentPalette.get('id') === palette.get('id')) {
			style = {border: '4px solid black'}
		}

		return (
			<div className="ColorPalette" onClick={this.props.onClick} style={style}>
				<div className="ColorPalette-single-color" style={{backgroundColor: palette.get('colorOne')}}></div>
				<div className="ColorPalette-single-color" style={{backgroundColor: palette.get('colorTwo')}}></div>
				<div className="ColorPalette-single-color" style={{backgroundColor: palette.get('colorThree')}}></div>
				<div className="ColorPalette-single-color" style={{backgroundColor: palette.get('colorFour')}}></div>
			</div>
		)
	}
})
