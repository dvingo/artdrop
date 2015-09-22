var Firebase = require('firebase')
var firebaseUrl = process.env['ARTDROP_FIREBASE_URL']
if (firebaseUrl == null) {
  console.log('Firebase url not set in ' + __dirname + ', exiting...')
  process.exit(1)
}
var firebaseRef       = new Firebase(firebaseUrl)
var colorPalettesRef  = new Firebase(firebaseUrl + "/colorPalettes")
var credsRef          = new Firebase(firebaseUrl + "/creds")
var designsRef        = new Firebase(firebaseUrl + "/designs")
var layersRef         = new Firebase(firebaseUrl + "/layers")
var layerImagesRef    = new Firebase(firebaseUrl + "/layerImages")
var surfacesRef       = new Firebase(firebaseUrl + "/surfaces")
var surfaceOptionsRef = new Firebase(firebaseUrl + "/surfaceOptions")
module.exports = {
  firebaseRef: firebaseRef,
   colorPalettesRef: colorPalettesRef,
   credsRef:        credsRef,
   designsRef:      designsRef,
   layersRef:       layersRef,
   layerImagesRef:  layerImagesRef,
   surfacesRef:     surfacesRef,
   surfaceOptionsRef: surfaceOptionsRef
}
