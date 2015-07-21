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

var svgTextToImage = (svgEl) => {
  var svgString = (new window.XMLSerializer()).serializeToString(svgEl)
  var imageString = 'data:image/svg+xml;base64,' + window.btoa(svgString)
  var img = new Image()
  img.src = imageString
  return img
}

var dataUriToBlob = (dataUri) => {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString = (
    (dataUri.split(',')[0].indexOf('base64') >= 0)
    ? atob(dataUri.split(',')[1])
    : unescape(dataUri.split(',')[1])
  )
  // separate out the mime component
  var mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0]
  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length)
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ia], {type:mimeString});
}

export default {

  iconPath: (name) => `/${srcDir}/images/icons/${name}`,
  surfacePath: (name) => `/${srcDir}/images/surfaces/${name}`,
  toA: toA,
  svgLayerIds: svgLayerIds,

  isInvalidEditStep: (validSteps, step, layerStep) => {
    var retVal = false
    if (step == null) {
      if (layerStep != null &&
          !(layerStep === 'images' || layerStep === 'colors')) {
        retVal = true
      }
    } else {
      if (!validSteps.contains(step)) { retVal = true }
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
    SVGInjector(imgClone, {each: function(svgEl) {
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
    }, evalScripts:'never'});
  },

  svgTextToImage: svgTextToImage,

  renderDesignToImage(size, svgEls) {
    var w = size, h = size
    var canvas = document.createElement('canvas')
    canvas.height = h
    canvas.width = w
    var svgs = (
      toA(svgEls).map(svg => {
        svg.setAttribute('height', String(h))
        svg.setAttribute('width', String(w))
        return svg
      })
      .map(svgTextToImage)
    )

    var ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, w, h)
    var bgColor = '#fff'
    svgs.forEach(svg => {
      ctx.drawImage(svg, 0, 0, w, h)
    })
    //Draw a white background.
    ctx.globalCompositeOperation = "destination-over"
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, w, h)
    return dataUriToBlob(canvas.toDataURL('image/jpeg', 1.0))
  }
}
