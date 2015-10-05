var hydrateDesignJustLayers = require('../hydrate_utils').hydrateDesignJustLayers
require('babel/register')
var colorPaletteUtils = require('../../common/colorPaletteUtils')
var utils = require('../utils')
var imageUrlForLayer = utils.imageUrlForLayer

function designImageView(req, res) {
  console.log("request query: ", req.query)
  var designId = req.query.design
  var height = req.query.height
  var width = req.query.width
  if (!(designId && height && width)) {
    res.json('Missing required parameters.')
    return
  }
  console.log('before hydrate')
  hydrateDesignJustLayers(designId).then(function(design) {
    var layers = JSON.stringify(design.layers)
    var rotationMap = JSON.stringify(colorPaletteUtils.rotationToColorsMapping)
    var svgLayerIds = JSON.stringify(colorPaletteUtils.svgLayerIds)
    console.log('RENDERING design.')
    res.render('designImageView', {
      height: height,
      width: width,
      layerOneImageUrl: imageUrlForLayer(design.layers[0]),
      layerTwoImageUrl: imageUrlForLayer(design.layers[1]),
      layerThreeImageUrl: imageUrlForLayer(design.layers[2]),
      layers: JSON.stringify(design.layers),
      rotationToColorsMapping: JSON.stringify(colorPaletteUtils.rotationToColorsMapping),
      svgLayerIds: JSON.stringify(colorPaletteUtils.svgLayerIds)
    })
  })
}

module.exports = designImageView
