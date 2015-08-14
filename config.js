var env = 'prod'
if (process) {
  env = process.env.NODE_ENV
}
module.exports = {
  env: env,
  srcDir: 'app',
  designPreviewSize: 180,
  designDetailSize: 334,
  s3Endpoint: 'https://s3.amazonaws.com',
  //s3BucketName: 'com.artdrop.test1',
  s3BucketName: 'com.artdrop.images2',
  //s3BucketName: 'test-dvingo-1',
  //fireBaseUri: 'https://artrop.firebaseio.com/',
  fireBaseUri: 'https://artdrop-testing3.firebaseio.com/',
  //fireBaseUri: "https://glaring-fire-8101.firebaseio.com",
  hostname: 'obscure-atoll-2694.herokuapp.com'
}
