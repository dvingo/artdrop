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
			<div className="SurfaceImageOption" 
				onClick={this.props.onClick}>
				<div className="SurfaceImageOption-image">
					<img ref="img" src={this.props.imgUrl}/>
				</div>
				<div className="SurfaceImageOption-info">
					<p>{width}</p>x
					<p>{height}</p>
				</div>
			</div>
		)
	}
})
