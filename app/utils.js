import React from 'react'
var srcDir = require('../config').srcDir
var SVGInjector = require('svg-injector')
var layersToColors = {
  'Layer_1': 'colorOne',
  'Layer_2': 'colorTwo',
  'Layer_3': 'colorThree',
  'Layer_4': 'colorFour'}
var svgLayerIds = Object.keys(layersToColors)

var toA = (list) => Array.prototype.slice.call(list, 0)
export default {

  iconPath: (name) => `/${srcDir}/images/icons/${name}`,

  surfacePath: (name) => `/${srcDir}/images/surfaces/${name}`,

  toA: toA,

  isInvalidEditStep: (validSteps, step, layerStep) => {
    var retVal = false
    if (!validSteps.contains(step)) { retVal = true}
    if (layerStep != null &&
        (layerStep !== 'images' || layerStep !== 'colors')) {
      retVal = true
    }
    return retVal
  },

  replaceSvgImageWithText(containerRef, imgRef, colorPalette) {
    if (containerRef == null || imgRef == null) { return }
    var container = React.findDOMNode(containerRef)
    var img = React.findDOMNode(imgRef)
    var imgClone = img.cloneNode()
    imgClone.removeAttribute('data-reactid')
    var currentSvg = container.querySelector('svg')
    if (currentSvg != null) {
      container.removeChild(currentSvg)
    }
    container.appendChild(imgClone)
    SVGInjector(imgClone, {"each": function(svgEl) {
      console.log('svgEl: ', svgEl)
      svgEl.style.height = '100%';
      svgEl.style.width = '100%';
      svgEl.style.margin  = '0 auto';
      svgEl.style.display = 'block';
      if (colorPalette) {
        svgLayerIds.forEach(id => {
          var color = colorPalette.get(layersToColors[id])
          toA(svgEl.querySelectorAll(`#${id} *`)).forEach(el => el.style.fill = color)
        })
      }
      return svgEl
    }});
  }

}
