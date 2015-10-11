var express = require('express')
var mustacheExpress = require('mustache-express')
var firebaseRefs = require('./firebase_refs')
var firebaseRef = firebaseRefs.firebaseRef
var credsRef = firebaseRefs.credsRef
var bodyParser = require('body-parser')
var request = require('request')
var cors = require('cors')
var compression = require('compression')
var config = require('./server-config')
var hydrateDesign = require('./hydrate_utils').hydrateDesign
var hydrateDesignId = require('./hydrate_utils').hydrateDesignId
var PrintioService = require('../print-io-api/print-io-api')
var shippingPriceRoute = require('./routes/shippingPrice')
var designImageViewRoute = require('./routes/designImageView')
var utils = require('./utils')
var renderDesignImageToFile = utils.renderDesignImageToFile
var uploadDesignImageToS3 = utils.uploadDesignImageToS3
var updateOrderWithPrintInfo = utils.updateOrderWithPrintInfo
var chargeCreditCard = utils.chargeCreditCard
var s3Url = utils.s3Url
var configVars = require('./configWrapper')
var recipeId = configVars.recipeId
var firebaseUrl = configVars.firebaseUrl
var firebaseUsername = configVars.firebaseUsername
var firebasePassword = configVars.firebasePassword

var app = express()

app.use(bodyParser.json())
app.use(compression())
app.use(express.static(__dirname + '/../hosted-dir'))
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache')
app.set('views', './views');

firebaseRef.authWithPassword({
  email: firebaseUsername,
  password : firebasePassword
}, function(error, authData) {
  if (error) {
    console.log("Firebase login Failed!", error)
    process.exit(1)
  } else {
    console.log("Authenticated successfully")
    credsRef.once('value', function(snapshot) {
      var s3Creds = snapshot.val()
      var printioService = new PrintioService({
        recipeId: recipeId,
        url: 'https://api.print.io/api/v/1/source/api/'
      })

      app.get('/shippingPrice', cors(), shippingPriceRoute.bind(null, printioService))

      app.options('/orders', cors(), function(req, res) { res.json('hello') })

      app.post('/orders', cors(), function(req, res) {
        console.log('got order data: ', req.body)
        var designId = req.body.designId
        var orderId = req.body.orderId
        var ccToken = req.body.ccToken
        hydrateDesignId(designId)
          .then(chargeCreditCard.bind(null, ccToken))
          .catch(function(err) {
            console.log("Failed to charge credit card for order: " + orderId)
            throw new Error('There was a problem charging your credit card.')
          })
          .then(renderDesignImageToFile.bind(null, app.get('host'), app.get('port')))
          .then(uploadDesignImageToS3.bind(null, s3Creds, designId, orderId))
          //.then(createPrintOrder)
          .then(updateOrderWithPrintInfo.bind(null, orderId))
          .then(function() {
            console.log('Got success when creating order')
            res.json({success: 'Order created successfully'})
          })
          .catch(function(err) {
            console.log('Got error when creating order')
            var msg = err.message || 'Error creating order'
            res.json({error: msg})
          })
      })

      app.get('/images/:imageName', cors(), function(req, res) {
        request(s3Url(req.params.imageName)).pipe(res)
      })

      app.post('/renderDesign/:designId', cors(), function(req, res) {
        hydrateDesignId(req.params.designId).then(function(design) {
          renderDesignImageToFile(design)
          res.json('success')
        })
      })

      app.get('/designImageView', cors(), designImageViewRoute)

      app.get('/*', function(req, res) {
        res.sendFile('index.html', {root: __dirname + '/../hosted-dir/'})
      })

      var port = process.env.PORT || config.devPort
      var server = app.listen(port, function() {
        host = server.address().address;
        port = server.address().port;
        app.set('host', host)
        app.set('port', port)
        console.log('Application listening at http://%s:%s', host, port);
      })
    }, function(err) {
      console.log('Got creds error: ', err)
    })
  }
})
