var exports = {}
var fireBaseUri = "https://glaring-fire-8101.firebaseio.com"
exports.fireBaseUri = fireBaseUri
// TODO At this point, check for Firebase availability,
// or bundle it into the local build.
// Test for internet connectivity and branch on that
// to decide whether or not to use Firebase or fixtures.
exports.firebaseRef      = new Firebase(fireBaseUri)
exports.usersRef         = new Firebase(fireBaseUri + "/users")
exports.designsRef       = new Firebase(fireBaseUri + "/designs")
exports.layersRef        = new Firebase(fireBaseUri + "/layers")
exports.layerImagesRef   = new Firebase(fireBaseUri + "/layerImages")
exports.surfacesRef      = new Firebase(fireBaseUri + "/surfaces")
exports.colorPalettesRef = new Firebase(fireBaseUri + "/colorPalettes")
export default exports
