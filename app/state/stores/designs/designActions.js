import reactor from 'state/reactor'
import getters from 'state/getters'

export default {
  nextLayerImage(direction) {
    var currentDesign = reactor.evaluate(getters.currentDesign)
    var currentLayer = reactor.evaluate(getters.currentLayer)
    var images = reactor.evaluate(getters.layerImagesForCurrentLayer)
    var currentIndex = images.findIndex(i => i.get('id') === currentLayer.getIn(['selectedLayerImage', 'id']))
    var nextIndex = (currentIndex + direction < 0
        ? images.count() - 1
        : (currentIndex + direction) % images.count())
    console.log('current index: ', currentIndex)
    console.log('next index: ', nextIndex)
    reactor.dispatch('selectLayerImage', images.get(nextIndex))
  }
}
