var getters = {}

getters.designs = [['designs'], designsMap => designsMap.toList()]

getters.currentDesign = [
  ['currentDesignId'],
  ['designs'],
  (currentDesignId, designsMap) => designsMap.get(currentDesignId)
]

getters.colorPalettes = [['colorPalettes'], palettes => palettes.toList()]

getters.currentLayer = [
  ['currentLayerId'],
  getters.currentDesign,
  (layerId, design) => design.get('layers').find(v => v.get('id') === layerId)
]

getters.layerImages = [
  ['layerImages'], layerImages => layerImages.toList()
]

getters.layerImageIds = [
  getters.layerImages, layerImages => layerImages.map(li => li.get('id'))
]

getters.surfaces = [
  ['surfaces'], surfaces => surfaces.toList()
]

getters.layerImageOptions = [
  getters.currentLayer,
  ['layerImages'],
  (layer, layerImages) => {
    if (layer == null) return null
    var lis = layer.get('layerImages')
    return lis.keySeq().map(li =>  {
        var x  = layerImages.get(li)
      return x
    })
  }
]

export default getters
