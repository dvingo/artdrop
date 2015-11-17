var config = require('../configCommon')
var serverHostname = config.serverHostname
var fireBaseUri = config.fireBaseUri

if (TEST || DEV) {
  fireBaseUri = config.fireBaseTestingUri
}

// stripePublishableKey from webpack global.
config.stripePublishableKey = stripePublishableKey
config.fireBaseUri = fireBaseUri
module.exports = config
