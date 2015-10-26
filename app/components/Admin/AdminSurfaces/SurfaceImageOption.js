import React from 'react'

export default React.createClass({
	getInitialState () {
		return {
			width: null,
			height: null
		}
	},

	componentDidMount () {
		var img = React.findDOMNode(this.refs.img)

		if (img.naturalWidth === 0) {
			img.onload = () => {
				this.setState({
					width: img.naturalWidth,
					height: img.naturalHeight
				})
			}
		}
	},

	render () {
		const {width, height} = this.state

		return (
			<div className="AdminSurfaces-surface-images" 
				onClick={this.props.onClick}>
				<img ref="img" src={this.props.imgUrl}/>
				<p>{width}</p>
				<p>{height}</p>
			</div>
		)
	}
})
