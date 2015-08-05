import React from 'react'
import {iconPath} from '../utils'
import reactor from '../state/reactor'
import Store from '../state/main'
import {setSvgColors, replaceSvgImageWithText} from '../utils'
var classNames = require('classnames')

export default React.createClass({
	mixins: [reactor.ReactMixin],

	getDataBindings() {
	  return {currentLayer: Store.getters.currentLayer}
	},

	getInitialState() {
		return {
			rotatingColorPalette: null
		}
	},

	componentDidMount() {
		if (this.state.currentLayer) {
			replaceSvgImageWithText(this.refs.container, this.refs.imgRef,
			  this.state.currentLayer.get('colorPalette'))

			this.setState({rotatingColorPalette: this.state.currentLayer.get('colorPalette')});
		}
	},

	componentDidUpdate(prevProps, prevState) {
		var container = React.findDOMNode(this.refs.container)
		var svgEl = container.querySelector('svg')
		var colorPalette = this.state.currentLayer.get('colorPalette');

		if (prevState.currentLayer && colorPalette !== prevState.currentLayer.get('colorPalette')) {
			this.setState({rotatingColorPalette: colorPalette});	
		} else {
			colorPalette = this.state.rotatingColorPalette;
		}

		if (svgEl) {
		  setSvgColors(svgEl, colorPalette)
		}
	},

	rotateColors() {
		console.log(this.state.rotatingColorPalette.toJS());

		var palette = this.state.rotatingColorPalette;
		var newPalette = (
			palette.set('colorOne', palette.get('colorFour'))
			.set('colorTwo', palette.get('colorOne'))
			.set('colorThree', palette.get('colorTwo'))
			.set('colorFour', palette.get('colorThree'))
		)
		this.setState({rotatingColorPalette: newPalette});

	},

  render() {
    return (
      <span ref="container" style={{width: 60}} onClick={this.rotateColors}>
        <img style={{display:'none'}} src={iconPath('shuffle.svg')}
             ref="imgRef"/>
      </span>
    )
  }
});