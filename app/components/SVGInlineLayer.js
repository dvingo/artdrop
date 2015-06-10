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
    var container = React.findDOMNode(this.refs.container)
    var img = React.findDOMNode(this.refs.imgRef)
    var imgClone = img.cloneNode()
    imgClone.removeAttribute('data-reactid')
    var currentSvg = container.querySelector('svg')
    if (currentSvg != null) {
      container.removeChild(currentSvg)
    }
    container.appendChild(imgClone)
    SVGInjector(imgClone, {"each": function(svgEl) {
      svgEl.style.height = '100%';
      svgEl.style.width = '100%';
      svgEl.style.margin = '0 auto';
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
