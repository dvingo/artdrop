import React from 'react'
import {imageUrlForLayer} from '../state/utils'
import {toA} from '../utils'
var SVGInjector = require('svg-injector')

var layersToColors = {
  'Layer_1': 'colorOne',
  'Layer_2': 'colorTwo',
  'Layer_3': 'colorThree',
  'Layer_4': 'colorFour'}
var svgLayerIds = Object.keys(layersToColors)

export default React.createClass({

  replaceImageWithText() {
    var self = this;
    var container = React.findDOMNode(this.refs.container)
    var img = React.findDOMNode(this.refs.imgRef)
    var imgClone = img.cloneNode()
    var width = this.props.width || '100%'
    var height = this.props.height || '100%'
    imgClone.removeAttribute('data-reactid')
    var currentSvg = container.querySelector('svg')
    if (currentSvg != null) {
      container.removeChild(currentSvg)
    }
    container.appendChild(imgClone)
    SVGInjector(imgClone, {"each": function(svgEl) {
      svgEl.style.height  = height;
      svgEl.style.width   = width;
      svgEl.style.margin  = '0 auto';
      svgEl.style.display = 'block';
      svgLayerIds.forEach(id => {
        var color = self.props.layer.get('colorPalette').get(layersToColors[id])
        toA(svgEl.querySelectorAll(`#${id} *`)).forEach(el => el.style.fill = color)
      })
      return svgEl
    }});
  },

  componentDidMount() {
    this.replaceImageWithText()
  },

  componentDidUpdate() {
    this.replaceImageWithText()
  },

  render() {
    return (
      <div ref="container" className="layer-container">
        <img src={imageUrlForLayer(this.props.layer)}
             style={{display:'none'}}
             ref="imgRef"/>
      </div>
    )
  }
})
