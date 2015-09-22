var express = require('express')
var Firebase = require('firebase')
var app = express()
var bodyParser = require('body-parser')
var request = require('request')
var cors = require('cors')
var compression = require('compression')
var config = require('./server-config')
var PrintioService = require('./print-io-api/print-io-api')

var recipeId = process.env['ARTDROP_RECIPE_ID']
var firebaseUrl = process.env['ARTDROP_FIREBASE_URL']
var firebaseUsername = process.env['ARTDROP_FIREBASE_USERNAME']
var firebasePassword = process.env['ARTDROP_FIREBASE_PASSWORD']

function exitIfValMissing(val, name) {
  if (val == null) {
    console.log(name + ' is not set, exiting...')
    process.exit(1)
  }
}

exitIfValMissing(recipeId, 'Printio recipe Id')
exitIfValMissing(firebaseUrl, 'Firebase URL')
exitIfValMissing(firebaseUsername, 'Firebase username')
exitIfValMissing(firebasePassword, 'Firebase password')

app.use(bodyParser.json())

var firebaseRef = new Firebase(firebaseUrl)
firebaseRef.authWithPassword({
  email: firebaseUsername,
  password : firebasePassword
}, function(error, authData) {
  if (error) {
    console.log("Firebase login Failed!", error)
    process.exit(1)
  } else {
    console.log("Authenticated successfully with payload:", authData)

    var designsRef = new Firebase(firebaseUrl + '/designs')
    designsRef.child('-JuwTLo8mMamQgZSeBF3').once('value', function(snapshot) {
      console.log('got design snapshot: ', snapshot.val())
    }, function(err) {
      console.log('got error: ', err)
    })

    var credsRef = new Firebase(firebaseUrl + '/creds')
    credsRef.once('value', function(snapshot) {
      console.log('got creds: ', snapshot.val())
    }, function(err) {
      console.log('got creds error: ', err)
    })

    var printioService = new PrintioService({
      recipeId: recipeId,
      url: 'https://api.print.io/api/v/1/source/api/'
    })

    function s3Url(filename) {
      return [config.s3Endpoint, config.s3BucketName, filename].join('/')
    }

    app.get('/shippingPrice', cors(), function(req, res) {
      console.log('got ship price req: ', req.query)
      var query = req.query
      if ('state' in query && 'zipcode' in query && 'sku' in query &&
         query.state.length > 0 && query.zipcode.length > 0 && query.sku.length > 0) {
        var state = query.state
        var zipcode = query.zipcode
        var sku = query.sku
        console.log('in positive')
        printioService.getShipPrice(sku, zipcode, state, function(pRes) {
          if (pRes.HadError) {
            res.json({errors: pRes.Errors})
          } else {
            console.log('got price data: ', pRes)
            // TODO return all shipping options, with description (standard, expidited, etc) and let
            // the user choose one.
            var price = pRes.Result[0].ShipOptions[0].Price.Price
          console.log('PRICE IS: ', price)
            var shippingMethodId = pRes.Result[0].ShipOptions[0].MethodId
            res.json({price: price, shippingMethodId: shippingMethodId})
          }
        })
      } else {
        console.log('in negative')
        res.json({errors: [{ErrorMessage: 'Missing required parameters'}]})
      }
    })

    app.options('/orders', cors(), function(req, res) { res.json('hello') })
    app.post('/orders', cors(), function(req, res) {
      console.log('got order data: ', req.body)
      var designId = req.body.designId
      getDesign(designId, function(data) {
        get the layer selected layer image and then pass them to a phantomjs script to render as jpeg or png
      })
      res.json({success: 'got u'})
    })

    app.get('/images/:imageName', cors(), function(req, res) {
      request(s3Url(req.params.imageName)).pipe(res)
    })

    app.use(compression())
    app.use(express.static('hosted-dir'))

    app.get('/*', function(req, res) {
      res.sendFile(__dirname + '/hosted-dir/index.html')
    })

    var port = process.env.PORT || config.devPort
    var server = app.listen(port, function() {
      var host = server.address().address;
      var port = server.address().port;
      console.log('Application listening at http://%s:%s', host, port);
    })
  }
})
