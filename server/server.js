var phantom = require('phantom')
var express = require('express')
var mustacheExpress = require('mustache-express')
var firebaseRefs = require('./firebase_refs')
var firebaseRef = firebaseRefs.firebaseRef
var credsRef = firebaseRefs.credsRef
var app = express()
var bodyParser = require('body-parser')
var request = require('request')
var cors = require('cors')
var compression = require('compression')
var config = require('../server-config')
var hydrateDesign = require('./hydrate_utils').hydrateDesign
var hydrateDesignId = require('./hydrate_utils').hydrateDesignId
var PrintioService = require('../print-io-api/print-io-api')
var querystring = require('querystring')
try {
  var configVars = require('./.server_settings')
} catch(e) { }

configVars = configVars || {}
var recipeId = configVars.recipeId || process.env['ARTDROP_RECIPE_ID']
var firebaseUrl = configVars.firebaseUrl || process.env['ARTDROP_FIREBASE_URL']
var firebaseUsername = configVars.firebaseUsername || process.env['ARTDROP_FIREBASE_USERNAME']
var firebasePassword = configVars.firebasePassword || process.env['ARTDROP_FIREBASE_PASSWORD']
var designsRef = require('./firebase_refs').designsRef
var host, port;

var webshot = require('webshot')

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
    console.log("Authenticated successfully with payload:", authData)

  var designId = '-JuwTLo8mMamQgZSeBF3'
    designsRef.child(designId).once('value', function(snapshot) {
      var d = snapshot.val()
      console.log('got design snapshot: ', d)
      d.id = designId

      hydrateDesign(d).then(function(design) {
        console.log('hydrated: ', design.layers[0].selectedLayerImage)
      })

    }, function(err) {
      console.log('got error: ', err)
    })

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

    function renderDesignImage(design) {
      console.log('render design: ', design.id)
      phantom.create(function(ph) {
        ph.createPage(function(page) {
          var url = 'http://' + host + ':' + port + '/renderDesignImage'

          var width = design.surfaceOption.printingImageWidth
          var height = design.surfaceOption.printingImageHeight
          var layerOneUrl = design.layers[0].selectedLayerImage.imageUrl
          var layerTwoUrl = design.layers[1].selectedLayerImage.imageUrl
          var layerThreeUrl = design.layers[2].selectedLayerImage.imageUrl
          var query = { width:width, height:height, layerImgOne:layerImgOne,
          layerImgTwo:layerImgTwo, layerImgThree:layerImgThree }
          var qs = querystring.stringify(query)
          page.viewportSize = { width: width, height: height }
          var endpoint = url + '/?' + qs
          console.log('making req to endpoint: ', endpoint)
          page.open(endpoint, function(status) {
            console.log('status: ' + status)
            if (status === 'success') {
              var interval = setInterval(function() {
                page.evaluate(function() {
                  return document.querySelectorAll('svg').length === 3
                }, function(done) {
                  console.log('not done')
                  if (done) {
                    clearInterval(interval)
                    page.render('example.jpeg', function() {
                      //res.json({success: true})
                      ph.exit()
                    })
                  }
                })
              }, 800)
            }
          })
        })
      })
    }

    app.options('/orders', cors(), function(req, res) { res.json('hello') })
    app.post('/orders', cors(), function(req, res) {
      console.log('got order data: ', req.body)
      var designId = req.body.designId
      hydrateDesign(designId)
        .then(renderDesignImage)
        .then(uploadDesignImageToS3)
        .then(createPrintOrder)
        .then(persistDesign)
        .then(function() {
          res.json({success: 'Order created successfully'})
        })
        .catch(function() {
          res.json({error: 'Error creating order'})
        })
    })

    app.get('/images/:imageName', cors(), function(req, res) {
      request(s3Url(req.params.imageName)).pipe(res)
    })

    // TODO app renderDesign endpoint that takes just a design id
    app.post('/renderDesign/:designId', cors(), function(req, res) {
      hydrateDesignId(req.params.designId).then(function(design) {
        console.log('rendering')
        renderDesignImage(design)
        res.json('success')
      })
    })

    app.get('/renderDesignImage', cors(), function(req, res) {
      var layerOneUrl = req.query.layerOneUrl
      var layerTwoUrl = req.query.layerTwoUrl
      var layerThreeUrl = req.query.layerThreeUrl
      var height = req.query.height
      var width = req.query.width
      console.log('layerOneUrl: ', layerOneUrl)
      console.log('layerTwoUrl: ', layerTwoUrl)
      console.log('layerThreeUrl: ', layerThreeUrl)
      console.log('height : ', height)
      console.log('width: ', width)
      if (!(layerOneUrl && layerTwoUrl && layerThreeUrl && height && width)) {
        res.json('Missing required parameters.')
        return
      }
      res.render('svg-test', {
        height: height,
        width: width,
        layerOneUrl: layerOneUrl,
        layerTwoUrl: layerTwoUrl,
        layerThreeUrl: layerThreeUrl
      })
    })

    app.post('/produce-img', cors(), function(req, res) {
      phantom.create(function(ph) {
        ph.createPage(function(page) {
          var url = 'http://localhost:3000/renderDesignImage'
          page.viewportSize = { width: 2400, height: 2400}
          page.open(url, function(status) {
            console.log('status: ' + status)
            if (status === 'success') {
              var interval = setInterval(function() {
                page.evaluate(function() {
                  return document.querySelectorAll('svg').length === 3
                }, function(done) {
                  if (done) {
                    clearInterval(interval)
                    page.render('example.jpeg', function() {
                      res.json({success: true})
                      ph.exit()
                    })
                  }
                })
              }, 800)
            }
          })
        })
      })
    })

    app.get('/*', function(req, res) {
      res.sendFile('index.html', {root: __dirname + '/../hosted-dir/'})
    })

    var port = process.env.PORT || config.devPort
    var server = app.listen(port, function() {
      host = server.address().address;
      port = server.address().port;
      console.log('Application listening at http://%s:%s', host, port);
    })
  }
})
