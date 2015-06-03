export default {
  imageUrlForLayer(layer) {
    return layer.getIn(['selectedLayerImage', 'imageUrl'])
                .replace('/assets/images/new/', '/src/images/layers/');
  }
}
