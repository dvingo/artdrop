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
  img.height = 400
  img.width = 400
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

  iconPath: (name) => `${srcDir}/images/icons/${name}`,
  surfacePath: (name) => `${srcDir}/images/surfaces/${name}`,
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

  renderDesignToJpegBlob(size, svgEls, compositeSvg) {
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

    if (compositeSvg) {
      ctx.globalCompositeOperation = 'multiply'
      compositeSvg.setAttribute('height', String(h))
      compositeSvg.setAttribute('width', String(w))
      let compositeSvg = svgTextToImage(compositeSvg)
      ctx.drawImage(compositeSvg, 0, 0, w, h)
    }
    //Draw a white background.
    ctx.globalCompositeOperation = "destination-over"
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, w, h)
    return dataUriToBlob(canvas.toDataURL('image/jpeg', 1.0))
  },

  renderDesignToJpegDataUrl(size, svgEls, compositeSvg) {
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

    if (compositeSvg) {
      ctx.globalCompositeOperation = 'multiply'
      compositeSvg.setAttribute('height', String(h))
      compositeSvg.setAttribute('width', String(w))
      let compositeSvg = svgTextToImage(compositeSvg)
      ctx.drawImage(compositeSvg, 0, 0, w, h)
    }
    //Draw a white background.
    ctx.globalCompositeOperation = "destination-over"
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, w, h)
    return canvas.toDataURL('image/jpeg', 1.0)
  },

  compositeTwoImages(size, baseImg, topImg) {
    baseImg.setAttribute('height', String(size))
    baseImg.setAttribute('width', String(size))
    baseImg = svgTextToImage(baseImg)
    topImg.setAttribute('height', String(size))
    topImg.setAttribute('width', String(size))
    topImg = svgTextToImage(topImg)
    var w = size, h = size
    var canvas = document.createElement('canvas')
    canvas.height = h
    canvas.width = w
    var ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'multiply'
    var bgColor = '#fff'
    ctx.drawImage(baseImg, 0, 0, w, h)
    ctx.drawImage(topImg, 0, 0, w, h)
    // Draw a white background.
    ctx.globalCompositeOperation = "destination-over"
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, w, h)
    return canvas.toDataURL('image/jpeg', 1.0)
  },

  loadSvgInline(size, imgUrl, cb) {
    var id = 'to-replace'
    var img = new Image(size, size)
    img.onload = () => {
      var idStr = '#'+id
      console.log('to replace: ', idStr)
      var domImg = document.querySelector('#'+id)
      SVGInjector(domImg, {each: (svgEl) => {
        svgEl.setAttribute('height', String(size))
        svgEl.setAttribute('width', String(size))
        var imageAsDataUri = svgTextToImage(svgEl)
        imageAsDataUri.height = String(size)
        imageAsDataUri.width = String(size)
        cb(imageAsDataUri)
      }, evalScripts:'never'});
    }
    img.src = imgUrl
    img.style.display = 'none'
    img.id = id
    var oldImg = document.querySelector('#'+id)
    if (oldImg) {
      document.body.removeChild(oldImg)
    }
    document.body.appendChild(img)
  }

}
