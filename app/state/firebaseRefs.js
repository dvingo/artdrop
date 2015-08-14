var config = require('../../config')
var Firebase = require('firebase')
var exports = {}
var fireBaseUri = config.fireBaseUri
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
exports.tagsRef          = new Firebase(fireBaseUri + "/tags")
exports.credsRef         = new Firebase(fireBaseUri + "/creds")
export default exports
