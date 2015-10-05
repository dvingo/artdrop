var toA = (list) => Array.prototype.slice.call(list, 0)
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

var setSvgColors = (svgEl, layer) => {
  var colorPalette = layer.get('colorPalette')
  var layersToColorsMap = rotationToColorsMapping[layer.get('paletteRotation')]
  svgLayerIds.forEach(id => {
    var color = colorPalette.get(layersToColorsMap[id])
    toA(svgEl.querySelectorAll(`#${id} *`)).forEach(el => el.style.fill = color)
  })
}

var setSvgColorsJs = (svgEl, layer) => {
  var colorPalette = layer.colorPalette
  var layersToColorsMap = rotationToColorsMapping[layer.paletteRotation]
  svgLayerIds.forEach(id => {
    var color = colorPalette[layersToColorsMap[id]]
    toA(svgEl.querySelectorAll(`#${id} *`)).forEach(el => el.style.fill = color)
  })
}

module.exports = {
  toA: toA,
  setSvgColors: setSvgColors,
  setSvgColorsJs: setSvgColorsJs,
  svgLayerIds: svgLayerIds,
  rotationToColorsMapping
}
