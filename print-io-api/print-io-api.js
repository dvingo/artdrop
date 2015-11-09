// https://github.com/printdotio/printio-api-site-ex/blob/master/lib/printioservice.js
var req = require('request'),
  async = require('async')

var PrintioService = function(config) {
  this._config = config
}

PrintioService.prototype._get = function(endpoint, obj, cb) {
  var url = this._config.url
  var final = ''
  obj = obj || {}
  obj.recipeId = this._config.recipeId
  final = url + endpoint
  console.log('Making get req to: ', final)
  return req.get(final, {qs:obj, json:true}, cb)
}

PrintioService.prototype._post = function(endpoint, obj, cb) {
  obj = obj || {}
  var url = this._config.url + endpoint + '/?recipeId=' + this._config.recipeId
  console.log('Making post req to: ', url)
  return req.post(url, {body: obj, json:true}, cb)
}

PrintioService.prototype.getUserInfo = function(ip,cb){
  var defaults = {
    "LanguageCode": "en",
    "CountryCode": "us",
    "CountryName": "United States",
    "CurrencyFormat": "${1}",
    "CurrencyCode": "USD",
    "CurrencyName": "United States dollar"
  }
  return this._get("userinfo", {ip: ip}, function(err,res,body) {
    if(err) {
      return cb(defaults)
    }
    return cb(body)
  })
}

PrintioService.prototype.getProducts = function(countryCode, languageCode, currencyCode, cb) {
  return this._get("products", {
    countryCode:countryCode,
    languageCode:languageCode,
    currencyCode:currencyCode
  },function(err,res,body){
    if(err) throw err
    return cb(body)
  })
}

PrintioService.prototype.getProductVariants = function(countryCode, productId, cb) {
  return this._get('productvariants', {
    countryCode: countryCode,
    productId: productId,
    all: false
  }, function(err, res, body){
    if(err) { throw err }
    return cb(body)
  })
}

PrintioService.prototype.getShipEstimate = function(productId, countryCode, currencyCode, cb) {
  return this._get("shippriceestimate", {
    countryCode:countryCode,
    productId:productId,
    currencyCode:currencyCode
  },function(err,res,body){
    if(err) throw err
    return cb(body)
  })
}

PrintioService.prototype.getShipPrice = function(sku, zip, state, cb) {
  return this._post('shippingprices', {
    ShipToPostalCode: zip,
    ShipToCountry: "US",
    ShipToState: state,
    CurrencyCode: "USD",
    LanguageCode: "en",
    Items: [
      { SKU: sku,
        Quantity: 1
      }
    ]
  }, function(err,res,body){
    if(err) throw err
    return cb(body)
  })
}

PrintioService.prototype.getProductTemplate = function(sku, cb) {
  return this._get('producttemplates', {
    countryCode:'US',
    languageCode:'en',
    sku:sku,
  }, function(err, res, body) {
    if(err) throw err
    return cb(body)
  })
}

PrintioService.prototype.getProduct = function(name, countryCode, languageCode, currencyCode, cb) {
  return this.getProducts(countryCode, languageCode, currencyCode, function(prods) {
    return cb(prods.Products.filter(function(p){
      var n1 = name.toLowerCase(),
        n2 = p.Name.toLowerCase()
      return n1===n2 || n1 === n2.replace(/\s/g,"-")
    })[0])
  })
}

PrintioService.prototype.createOrder = function(orderParams, cb) {
  orderParams.IsPreSubmit = false
  return this._post('orders', orderParams, function(err, res, body) {
    if(err || !body.hasOwnProperty('Id')) {
      console.log('Got printio err from createOrder: ', err)
      return cb(err)
    }
    return cb(null, body.Id)
  })
}

module.exports = PrintioService
