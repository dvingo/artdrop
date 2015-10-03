var phantom = require('phantom')
var querystring = require('querystring')
var fs = require('fs')
var RSVP = require('rsvp')
var AWS = require('aws-sdk')
var config = require('./server-config')
var s3BucketName = config.s3BucketName

function imgUrl(awsFilename) {
  var filename = awsFilename.split('/').pop()
  return 'https://' + config.hostname + '/images/' + filename
}

function renderDesignImageToFile(host, port, design) {
  console.log('Rendering design to image: ', design)
  return new RSVP.Promise(function(resolve, reject) {
    phantom.create(function(ph) {
      ph.createPage(function(page) {
        var url = 'http://' + host + ':' + port + '/renderDesignImage'
        var width = design.surfaceOption.printingImageWidth
        var height = design.surfaceOption.printingImageHeight
        var qs = querystring.stringify({
          width: width,
          height: height,
          layerOneUrl: imgUrl(design.layers[0].selectedLayerImage.imageUrl),
          layerTwoUrl: imgUrl(design.layers[1].selectedLayerImage.imageUrl),
          layerThreeUrl: imgUrl(design.layers[2].selectedLayerImage.imageUrl)
        })
        var endpoint = url + '/?' + qs
        page.viewportSize = { width: width, height: height }
        page.open(endpoint, function(status) {
          if (status === 'success') {
            var interval = setInterval(function() {
              page.evaluate(function() {
                return document.querySelectorAll('svg').length === 3
              }, function(done) {
                if (done) {
                  clearInterval(interval)
                  var outputFilename = filenameForDesignId(design.id)
                  page.render(outputFilename, function() {
                    resolve()
                    ph.exit()
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

function filenameForDesignId(designId) {
  return designId + '.jpeg'
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
      var objectKey = 'order' + orderId + '.jpeg'
      var params = {
        Bucket: sourceBucket,
        Key: objectKey,
        ACL: 'public-read',
        CacheControl: 'max-age: 45792000',
        ContentType: 'image/jpeg',
        Body: fileData
      }
      s3.putObject(params, function(err, success) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  })
}

module.exports = {
  renderDesignImageToFile: renderDesignImageToFile,
  uploadDesignImageToS3: uploadDesignImageToS3
}
