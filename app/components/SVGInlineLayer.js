import React from 'react'
import {imageUrlForLayer} from '../state/utils'
var SVGInjector = require('svg-injector')

var layersToColors = {
  'Layer_1': 'colorOne',
  'Layer_2': 'colorTwo',
  'Layer_3': 'colorThree',
  'Layer_4': 'colorFour'}
var svgLayerIds = Object.keys(layersToColors)

var toA = (list) => Array.prototype.slice.call(list, 0)
export default React.createClass({

  replaceImageWithText() {
    var self = this;
    var img = React.findDOMNode(this.refs.imgRef)
    SVGInjector(img, {"each": function(svgEl) {
      svgEl.style.height = '100%';
      svgEl.style.width = '100%';
      svgEl.style.margin = '0 auto';
      svgEl.style.display = 'block';
      svgLayerIds.forEach(id => {
        if (self.props.layer.get('colorPalette') != null) {
          var color = self.props.layer.get('colorPalette').get(layersToColors[id])
          console.log('FILLING COLOR: ', color);
          toA(svgEl.querySelectorAll(`#${id} *`)).forEach(el => { el.style.fill = color })
        }
      })
      return svgEl
    }});
  },

  componentDidMount() {
    this.replaceImageWithText()
  },

  componentWillReceiveProps() {
    this.replaceImageWithText()
  },

  render() {
    return (
      <img src={imageUrlForLayer(this.props.layer)}
           width={this.props.width}
           height={this.props.height}
           ref="imgRef"/>
    )
  }
})
