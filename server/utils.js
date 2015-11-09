var phantom = require('phantom')
var querystring = require('querystring')
var fs = require('fs')
var RSVP = require('rsvp')
var AWS = require('aws-sdk')
var config = require('../configCommon')
var s3BucketName = config.s3BucketName
var ordersRef = require('./firebase_refs').ordersRef
var configVars = require('./configWrapper')
var printerBillingKey = configVars.printerBillingKey
var stripeSecretKey = configVars.stripeSecretKey
var stripe = require('stripe')(stripeSecretKey)

function imgUrl(awsFilename) {
  var filename = awsFilename.split('/').pop()
  return 'https://' + config.serverHostname + '/images/' + filename
}

function imgUrlForOrderId(orderId) {
  return s3Url(orderImageName(orderId))
}

function renderDesignImageToFile(host, port, design) {
  return new RSVP.Promise(function(resolve, reject) {
    phantom.create(function(ph) {
      ph.createPage(function(page) {
        var url = 'http://' + host + ':' + port + '/designImageView'
        var width = design.surfaceOption.printingImageWidth
        var height = design.surfaceOption.printingImageHeight
        var qs = querystring.stringify({
          width: width,
          height: height,
          design: design.id
        })
        var endpoint = url + '/?' + qs
        console.log('hitting endpoint: ', endpoint)
        page.viewportSize = { width: width, height: height }
        page.open(endpoint, function(status) {
          if (status === 'success') {
            var interval = setInterval(function() {
              page.evaluate(function() {
                return document.querySelectorAll('svg').length === 3
              }, function(done) {
                if (done) {
                  clearInterval(interval)
                  console.log('got 3 svgs')
                  var outputFilename = filenameForDesignId(design.id)
                  page.render(outputFilename, function() {
                    console.log('done rendering')
                    ph.exit()
                    resolve()
                  })
                }
              })
            }, 500)
          } else {
            reject()
            ph.exit()
          }
        })
      })
    })
  })
}

function imageUrlForLayer(layer) {
  var filename = layer.selectedLayerImage.imageUrl.split('/').pop()
  return 'https://' + config.serverHostname + '/images/' + filename
}

function s3Url(filename) {
  return [config.s3Endpoint, config.s3BucketName, filename].join('/')
}

function filenameForDesignId(designId) {
  return designId + '.jpeg'
}

function orderImageName(orderId) {
  return 'order' + orderId + '.jpg'
}

function uploadDesignImageToS3(s3Creds, designId, orderId) {
  var s3AccessKey = s3Creds.s3AccessKey
  var s3SecretKey = s3Creds.s3SecretKey
  var s3 = new AWS.S3({
    accessKeyId: s3AccessKey,
    secretAccessKey: s3SecretKey
  })
  var filename = filenameForDesignId(designId)
  return new RSVP.Promise(function(resolve, reject) {
    fs.readFile(filename, function(err, fileData) {
      if (err) {
        console.log('Error reading image file: ' + filename)
        reject(err)
        return
      }
      var objectKey = orderImageName(orderId)
      var params = {
        Bucket: s3BucketName,
        Key: objectKey,
        ACL: 'public-read',
        CacheControl: 'max-age: 45792000',
        ContentType: 'image/jpeg',
        Body: fileData
      }
      console.log('uploading image to s3: ', objectKey)
      s3.putObject(params, function(err, success) {
        if (err) {
          console.log("got error uploading to s3: ", err)
          reject(err)
        } else {
          console.log('got success uploading to s3: ', success)
          resolve()
        }
      })
    })
  })
}

function updateOrderWithChargeInfo(orderId, design) {
  return new RSVP.Promise(function(resolve, reject) {
    ordersRef.child(orderId).update({
      state: 'chargedCreditCard'
    }, function(err) {
      if (err) {
        console.log('error updaing order: ' + orderId + ', ' + err)
        reject(err)
      }
      else { console.log('success updating order in Firebase '); resolve(design) }
    })
  })
}

function updateOrderWithPrintInfo(orderId, printerOrderId) {
  return new RSVP.Promise(function(resolve, reject) {
    ordersRef.child(orderId).update({
      printImageUrl: s3Url(orderImageName(orderId)),
      state: 'sentToPrinter'
    }, function(err) {
      if (err) {
        console.log('error updaing order: ' + orderId + ', ' + err)
        reject(err)
      }
      else { console.log('success updating order in Firebase '); resolve() }
    })
  })
}

function chargeCreditCard(ccToken, amountInCents, design) {
  return new RSVP.Promise((resolve, reject) => {
    stripe.charges.create({
      amount: amountInCents,
      currency: "usd",
      source: ccToken
    }, function(err, charge) {
      if (err) {
        console.log("Got Stripe error: ", err)
        var msg = (err.type === 'StripeCardError'
          ? 'Your card was declined'
          : 'Unable to charge your credit card.')
          reject(new Error(msg))
      } else {
        resolve(design)
      }
    })
  })
}

function createPrintOrder(printService, orderParams) {
  var artdropOrderId = orderParams.orderId
  var shippingAddress = {
    FirstName: orderParams.shippingFirstName,
    LastName: orderParams.shippingLastName,
    Line1: orderParams.shippingAddress,
    Line2: '',
    City: orderParams.shippingCity,
    State: orderParams.shippingState,
    CountryCode: 'US',
    PostalCode: orderParams.shippingZipcode,
    IsBusinessAddress: false,
    Phone: orderParams.shippingPhoneNumber,
    Email: orderParams.email
  }

  var vendorParams = {
    ShippingAddress: shippingAddress,
    BillingAddress: shippingAddress,
    Items: [{
      Quantity: 1,
      SKU: orderParams.vendorProductId,
      ShipCarrierMethod: orderParams.shippingMethodId,
      Images: [{ Url: imgUrlForOrderId(orderParams.orderId) }],
      SourceId: artdropOrderId
    }],
    Payment: { PartnerBillingKey: printerBillingKey }
  }

  return new RSVP.Promise((resolve, reject) => {
    printService.createOrder(vendorParams, function(err, vendorOrderId) {
      if (err) { reject(err) }
      else     { resolve(vendorOrderId) }
    })
  })
}

module.exports = {
  renderDesignImageToFile: renderDesignImageToFile,
  uploadDesignImageToS3: uploadDesignImageToS3,
  updateOrderWithPrintInfo: updateOrderWithPrintInfo,
  updateOrderWithChargeInfo: updateOrderWithChargeInfo,
  imageUrlForLayer: imageUrlForLayer,
  chargeCreditCard: chargeCreditCard,
  s3Url:s3Url
}
