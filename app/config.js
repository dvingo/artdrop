var config = require('../configCommon')
var serverHostname = config.serverHostname
var fireBaseUri = config.fireBaseUri

if (TEST || DEV) {
  fireBaseUri = config.fireBaseTestingUri
  var port = process.env.PORT || 8080
  serverHostname = 'localhost:' + port
}

// stripePublishableKey from webpack global.
config.stripePublishableKey = stripePublishableKey
config.serverHostname = serverHostname
config.fireBaseUri = fireBaseUri
module.exports = config
