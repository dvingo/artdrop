import React from 'react'
import Store from 'state/main'
var srcDir = require('config').srcDir
var SVGInjector = require('svg-injector')
var svgLayerIds = ['Layer1', 'Layer2', 'Layer3', 'Layer4']

var rotationToColorsMapping = {}
rotationToColorsMapping['0'] = {}
rotationToColorsMapping['1'] = {}
rotationToColorsMapping['2'] = {}
rotationToColorsMapping['3'] = {}

rotationToColorsMapping['0'][svgLayerIds[0]] = 'colorOne'
rotationToColorsMapping['0'][svgLayerIds[1]] = 'colorTwo'
rotationToColorsMapping['0'][svgLayerIds[2]] = 'colorThree'
rotationToColorsMapping['0'][svgLayerIds[3]] = 'colorFour'

rotationToColorsMapping['1'][svgLayerIds[0]] = 'colorFour'
rotationToColorsMapping['1'][svgLayerIds[1]] = 'colorOne'
rotationToColorsMapping['1'][svgLayerIds[2]] = 'colorTwo'
rotationToColorsMapping['1'][svgLayerIds[3]] = 'colorThree'

rotationToColorsMapping['2'][svgLayerIds[0]] = 'colorThree'
rotationToColorsMapping['2'][svgLayerIds[1]] = 'colorFour'
rotationToColorsMapping['2'][svgLayerIds[2]] = 'colorOne'
rotationToColorsMapping['2'][svgLayerIds[3]] = 'colorTwo'

rotationToColorsMapping['3'][svgLayerIds[0]] = 'colorTwo'
rotationToColorsMapping['3'][svgLayerIds[1]] = 'colorThree'
rotationToColorsMapping['3'][svgLayerIds[2]] = 'colorFour'
rotationToColorsMapping['3'][svgLayerIds[3]] = 'colorOne'

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

var setSvgColors = (svgEl, layer) => {
  var colorPalette = layer.get('colorPalette')
  var layersToColorsMap = rotationToColorsMapping[layer.get('paletteRotation')]
  svgLayerIds.forEach(id => {
    var color = colorPalette.get(layersToColorsMap[id])
    toA(svgEl.querySelectorAll(`#${id} *`)).forEach(el => el.style.fill = color)
  })
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

  setSvgColors: setSvgColors,

  replaceSvgImageWithText(containerRef, imgRef, layer) {
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
      Store.actions.layerReplacementComplete()
      if (typeof svgEl !== 'object') { return null }
      svgEl.style.height = '100%';
      svgEl.style.width = '100%';
      svgEl.style.margin  = '0 auto';
      svgEl.style.display = 'block';
      setSvgColors(svgEl, layer)
      return svgEl
    }, evalScripts:'never'});
  },

  svgTextToImage: svgTextToImage,

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
  },

  isValidCreditCardNumber(num) {
    num = num.replace(/\s/g, '')
    if (num.length !== 16) {
      return false
    }
    return true
  },

  isValidEmail(val) {
    var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,30}/i
    return re.test(val)
  },

  hasValidLength(val) {
   return val.length > 0
  }
}
