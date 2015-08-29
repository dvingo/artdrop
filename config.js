var firebaseUri = 'https://artrop.firebaseio.com/';
if (TEST || DEV) {
 firebaseUri = 'https://artdrop-testing3.firebaseio.com/'
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
  hostname: 'obscure-headland-1710.herokuapp.com'
}
