var config = require('config')
var Firebase = require('firebase')
var exports = {}
var fireBaseUri = config.fireBaseUri
exports.fireBaseUri = fireBaseUri
// TODO At this point, check for Firebase availability,
// Test for internet connectivity and branch on that
// to decide whether or not to use Firebase or fixtures.
exports.firebaseRef       = new Firebase(fireBaseUri)
exports.colorPalettesRef  = new Firebase(fireBaseUri + "/colorPalettes")
exports.credsRef          = new Firebase(fireBaseUri + "/creds")
exports.designsRef        = new Firebase(fireBaseUri + "/designs")
exports.errorsRef         = new Firebase(fireBaseUri + "/errors")
exports.layersRef         = new Firebase(fireBaseUri + "/layers")
exports.layerImagesRef    = new Firebase(fireBaseUri + "/layerImages")
exports.surfacesRef       = new Firebase(fireBaseUri + "/surfaces")
exports.surfaceOptionsRef = new Firebase(fireBaseUri + "/surfaceOptions")
exports.tagsRef           = new Firebase(fireBaseUri + "/tags")
exports.usersRef          = new Firebase(fireBaseUri + "/users")
export default exports
