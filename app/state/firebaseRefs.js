var exports = {}
var fireBaseUri = "https://glaring-fire-8101.firebaseio.com"
exports.fireBaseUri = fireBaseUri
exports.firebaseRef      = new Firebase(fireBaseUri)
exports.designsRef       = new Firebase(fireBaseUri + "/designs")
exports.layersRef        = new Firebase(fireBaseUri + "/layers")
exports.layerImagesRef   = new Firebase(fireBaseUri + "/layerImages")
exports.surfacesRef      = new Firebase(fireBaseUri + "/surfaces")
exports.colorPalettesRef = new Firebase(fireBaseUri + "/colorPalettes")
export default exports
