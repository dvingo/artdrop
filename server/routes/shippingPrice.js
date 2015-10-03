function requestHasRequiredParams(req) {
  var query = req.query
  return (
    'state'   in query &&
    'zipcode' in query &&
    'sku'     in query &&
    query.state.length   > 0 &&
    query.zipcode.length > 0 &&
    query.sku.length     > 0
  )
}

module.exports = function(printioService, req, res) {
  console.log('got ship price req: ', req.query)
  if (!requestHasRequiredParams(req)) {
    res.json({errors: [{ErrorMessage: 'Missing required parameters'}]})
    return
  }
  var state = req.query.state
  var zipcode = req.query.zipcode
  var sku = req.query.sku
  printioService.getShipPrice(sku, zipcode, state, function(pRes) {
    if (pRes.HadError) {
      res.json({errors: pRes.Errors})
    } else {
      // TODO return all shipping options, with description (standard, expidited, etc) and let
      // the user choose one.
      var price = pRes.Result[0].ShipOptions[0].Price.Price
      var shippingMethodId = pRes.Result[0].ShipOptions[0].MethodId
      res.json({price: price, shippingMethodId: shippingMethodId})
    }
  })
}
