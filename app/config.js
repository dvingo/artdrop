var firebaseUri = 'https://artrop.firebaseio.com/'
// TODO cleanup configs, should just use one that's same as server.
var serverHostname = 'obscure-headland-1710.herokuapp.com'
if (TEST || DEV) {
  //firebaseUri = 'https://artdrop-testing3.firebaseio.com/'
  firebaseUri = 'https://artrop.firebaseio.com/'
  var port = process.env.PORT || 8080
  serverHostname = 'localhost:' + port
}
module.exports = {
  srcDir: 'app',
  designPreviewSize: 180,
  designDetailSize: 334,
  s3Endpoint: 'https://s3.amazonaws.com',
  s3BucketName: 'com.artdrop.images2',
  fireBaseUri: firebaseUri,
  hostname: 'obscure-headland-1710.herokuapp.com',
  serverHostname: serverHostname,
  stripePublishableKey: stripePublishableKey
}
