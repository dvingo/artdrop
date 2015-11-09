var hydrateDesignId = require('../hydrate_utils').hydrateDesignId
var utils = require('../utils')
var renderDesignImageToFile = utils.renderDesignImageToFile
var uploadDesignImageToS3 = utils.uploadDesignImageToS3
var updateOrderWithPrintInfo = utils.updateOrderWithPrintInfo
var updateOrderWithChargeInfo = utils.updateOrderWithChargeInfo
var chargeCreditCard = utils.chargeCreditCard
var createPrintOrder = utils.createPrintOrder

module.exports = function(app, s3Creds, printioService, req, res) {
  console.log('')
  console.log('Got order data: ', req.body.orderId)
  var designId = req.body.designId
  var orderId = req.body.orderId
  var ccToken = req.body.ccToken
  var orderTotalInCents = req.body.totalPrice
  var hydratedDesign
  hydrateDesignId(designId)
    .then(function(design) {
      hydratedDesign = design
      return design
    })
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
    .then(updateOrderWithChargeInfo.bind(null, orderId))
    .then(renderDesignImageToFile)
    .then(uploadDesignImageToS3.bind(null, s3Creds, designId, orderId))
    .then(function() {
      var orderParams = req.body
      orderParams.vendorProductId = hydratedDesign.surfaceOption.vendorId
      return createPrintOrder(printioService, orderParams)
    })
    .then(updateOrderWithPrintInfo.bind(null, orderId))
    .catch(function(err) {
      console.log('Got error when creating order: ', err)
      var msg = err.message || 'Error creating order'
      res.json({error: msg})
    })
}
