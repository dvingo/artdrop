var srcDir = require('../../config').srcDir
export default {
  imageUrlForLayer(layer) {
    return layer.getIn(['selectedLayerImage', 'imageUrl'])
                .replace('/assets/images/new/', '/' + srcDir + '/images/layers/')
  },

  imageUrlForSurface(surface) {
    return surface.get('imageUrl')
                .replace('/assets/images/new/', '/' + srcDir + '/images/surfaces/')
  }
}
