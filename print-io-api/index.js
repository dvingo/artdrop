var Service = require('./print-io-api')
var async = require('async')
var newId = require('./utils').generateFirebaseID

if (process.argv.length === 2) {
  console.log('You must provide a recipe ID as the only argument.')
  process.exit(1)
}

var recipeId = process.argv[2]
var service = new Service({
  recipeId: recipeId,
  url: 'https://api.print.io/api/v/1/source/api/'
})

service.getProducts('us','us','usd', function(d) {
  console.log('got d: ', d)
  async.map(
   d.Products.map(function(p) {
    return {
      id: newId(),
      name: p.Name,
      description: p.ShortDescription,
      vendor: 'print.io',
      vendorId: p.Id,
      images: p.Images.map(function(i) { return i.Url }),
      printingPrice: p.PriceInfo.Price * 100,
      hasVariants: p.HasAvailableProductVariants
    }
  }),
  function(product, cb) {
    service.getProductVariants('us', product.id, function(v) {
      // Here transform to the proper form.
      cb(null, v)
    })
  },
  function(err, results) {
    console.log("got variants: ", results)
  })
})
