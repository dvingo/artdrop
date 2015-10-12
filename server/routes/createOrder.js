var hydrateDesignId = require('../hydrate_utils').hydrateDesignId
var utils = require('../utils')
var renderDesignImageToFile = utils.renderDesignImageToFile
var uploadDesignImageToS3 = utils.uploadDesignImageToS3
var updateOrderWithPrintInfo = utils.updateOrderWithPrintInfo
var chargeCreditCard = utils.chargeCreditCard

module.exports = function(app, s3Creds, req, res) {
  console.log('got order data: ', req.body)
  var designId = req.body.designId
  var orderId = req.body.orderId
  var ccToken = req.body.ccToken
  var orderTotalInCents = req.body.totalPrice
  hydrateDesignId(designId)
    .then(chargeCreditCard.bind(null, ccToken, orderTotalInCents))
    .catch(function(err) {
      console.log("Failed to charge credit card for order: " + orderId)
      throw err
    })
    .then(function(design) {
      console.log('Charged card successfully')
      res.json({success: 'Order created successfully'})
      return design
    })
    .then(renderDesignImageToFile.bind(null, app.get('host'), app.get('port')))
    .then(uploadDesignImageToS3.bind(null, s3Creds, designId, orderId))
    //.then(createPrintOrder)
    .then(updateOrderWithPrintInfo.bind(null, orderId))
    .catch(function(err) {
      console.log('Got error when creating order')
      var msg = err.message || 'Error creating order'
      res.json({error: msg})
    })
}
