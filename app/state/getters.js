var getters = {}

getters.designs = [['designs'], designsMap => designsMap.toList()]
getters.adminCreatedDesigns = [
  getters.designs,
  designs => designs.filter(d => d.get('adminCreated'))
]

getters.currentDesign = [
  ['currentDesignId'],
  ['designs'],
  (currentDesignId, designsMap) => designsMap.get(currentDesignId)
]

getters.colorPalettes = [['colorPalettes'],
  palettes => palettes.toList().sort((colorOne, colorTwo) => colorTwo.get('createdAt') - colorOne.get('createdAt'))]

getters.currentLayer = [
  ['currentLayerId'],
  getters.currentDesign,
  (layerId, design) => design.get('layers').find(v => v.get('id') === layerId)
]

getters.layerImages = [
  ['layerImages'], layerImages => {
    return (
      layerImages
        .toList()
        .filter(layerImage => layerImage)
        .sort((imageOne, imageTwo) => imageTwo.get('createdAt') - imageOne.get('createdAt'))
    )
  }
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
    if (layer == null) {return null}
    return (
      layer.get('layerImages')
        .map(li => layerImages.get(li))
    )
  }
]

export default getters
