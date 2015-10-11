var firebaseUrl = require('./configWrapper').firebaseUrl
var Firebase = require('firebase')
var firebaseRef       = new Firebase(firebaseUrl)
var colorPalettesRef  = new Firebase(firebaseUrl + "/colorPalettes")
var credsRef          = new Firebase(firebaseUrl + "/creds")
var designsRef        = new Firebase(firebaseUrl + "/designs")
var layersRef         = new Firebase(firebaseUrl + "/layers")
var layerImagesRef    = new Firebase(firebaseUrl + "/layerImages")
var surfacesRef       = new Firebase(firebaseUrl + "/surfaces")
var surfaceOptionsRef = new Firebase(firebaseUrl + "/surfaceOptions")
var ordersRef         = new Firebase(firebaseUrl + "/orders")

module.exports = {
  firebaseRef: firebaseRef,
   colorPalettesRef: colorPalettesRef,
   credsRef: credsRef,
   designsRef: designsRef,
   layersRef: layersRef,
   layerImagesRef: layerImagesRef,
   surfacesRef: surfacesRef,
   surfaceOptionsRef: surfaceOptionsRef,
   ordersRef: ordersRef
}
