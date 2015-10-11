var phantom = require('phantom')
var querystring = require('querystring')
var fs = require('fs')
var RSVP = require('rsvp')
var AWS = require('aws-sdk')
var config = require('./server-config')
var s3BucketName = config.s3BucketName
var ordersRef = require('./firebase_refs').ordersRef
var stripeSecretKey = require('./configWrapper').stripeSecretKey
var stripe = require('stripe')(stripeSecretKey)

function imgUrl(awsFilename) {
  var filename = awsFilename.split('/').pop()
  return 'https://' + config.hostname + '/images/' + filename
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
  return 'https://' + config.hostname + '/images/' + filename
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

function updateOrderWithPrintInfo(orderId, printerId) {
  console.log('IN updateOrderWithPrintInfo, orderId: ', orderId)
  return new RSVP.Promise(function(resolve, reject) {
    ordersRef.child(orderId).update({
      printImageUrl: s3Url(orderImageName(orderId))
    }, function(err) {
      if (err) {
        console.log('error updaing order: ' + orderId + ', ' + err)
        reject(err)
      }
      else { console.log('success updating order in Firebase '); resolve() }
    })
  })
}

function chargeCreditCard(ccToken) {
  stripe.charges.create({
     amount: 1000, // amount in cents, again
    currency: "usd",
    source: stripeToken,
    description: "Example charge"
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      // The card has been declined
    }
  })
}

module.exports = {
  renderDesignImageToFile: renderDesignImageToFile,
  uploadDesignImageToS3: uploadDesignImageToS3,
  updateOrderWithPrintInfo: updateOrderWithPrintInfo,
  imageUrlForLayer: imageUrlForLayer
}
