import fixtures from './fixtures';
var Nuclear = require('nuclear-js');

var layersStr = 'layers';
var layerImagesStr = 'layerImages';
var designsStr = 'designs';

var byId = (prop, id) => {
  let item = fixtures[prop].filter(i => i.id === id);
  return item.length > 0 ? item[0] : null;
}

export default {

  getDesigns() { return fixtures.designs },

  imageForLayer(layerId) {
    let layer = byId(layersStr, layerId);
    let layerImage = byId(layerImagesStr, layer.selectedLayerImage);
    return layerImage.imageUrl;
  },

  designForId(id) {
   return Nuclear.toImmutable(byId(designsStr, id));
  }

}
