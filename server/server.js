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
var createOrderRoute = require('./routes/createOrder')
var utils = require('./utils')
var renderDesignImageToFile = utils.renderDesignImageToFile
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
      app.post('/orders', cors(), createOrderRoute.bind(null, app, s3Creds))

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
        var host = server.address().address;
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
