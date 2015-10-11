var firebaseUri = 'https://artrop.firebaseio.com/';
var serverHostname = 'obscure-headland-1710.herokuapp.com'
if (TEST || DEV) {
  firebaseUri = 'https://artdrop-testing3.firebaseio.com/'
  var port = process.env.PORT || 8080
  serverHostname = 'localhost:' + port
}
module.exports = {
  srcDir: 'app',
  designPreviewSize: 180,
  designDetailSize: 334,
  s3Endpoint: 'https://s3.amazonaws.com',
  //s3BucketName: 'com.artdrop.test1',
  s3BucketName: 'com.artdrop.images2',
  //s3BucketName: 'test-dvingo-1',
  fireBaseUri: firebaseUri,
  hostname: 'obscure-headland-1710.herokuapp.com',
  serverHostname: serverHostname,
  stripePublishableKey: stripePublishableKey
}
