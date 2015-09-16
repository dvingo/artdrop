var Service = require('./print-io-api')
var fs = require('fs')
var async = require('async')
var newId = require('./utils').generateFirebaseID
var margin = 1.4
var productData = require('./productData')
var optionsMap           = productData.optionsMap
var sizeProperties       = productData.sizeProperties
var thicknessProperties  = productData.thicknessProperties
var materialOptions      = productData.materialOptions
var paperTypeOptions     = productData.paperTypeOptions
var packSizeOptions      = productData.packSizeOptions
var colorOptions         = productData.colorOptions
var typeOptions          = productData.typeOptions
var paperFinishOptions   = productData.paperFinishOptions
var printLocationOptions = productData.printLocationOptions
var genderOptions        = productData.genderOptions
var clothingSizeOptions  = productData.clothingSizeOptions
var brandOptions         = productData.brandOptions

if (process.argv.length === 3) {
  console.log('You must provide a recipe ID and output file as arguments.')
  process.exit(1)
}

var recipeId = process.argv[2]
var outputFile = process.argv[3]
var service = new Service({
  recipeId: recipeId,
  url: 'https://api.print.io/api/v/1/source/api/'
})

function getProductVariants(p) {
  return p.ProductVariants
}

function getPrintingPrice(v) {
  return Math.round(v.PriceInfo.Price * 100)
}

function getSalePrice(v) {
  return Math.round(v.PriceInfo.Price * 100 * margin)
}

function extractThickness(val) {
  var m = val.match(/(.+) inch/)
  if (!m) { m = val.match(/(.+)in/) }
  var fraction = m[1].match(/(.+)\/(.+)/)
  var retVal = m[1]
  if (fraction) {
    retVal = Number(fraction[1]) / Number(fraction[2])
  }
  return retVal
}

function extractHeightWidth(val) {
  var m = val.match(/(.+)x(.+) inch/)
  return {height: Number(m[1]), width: Number(m[2])}
}

function contains(arr, val) {
  return arr.indexOf(val) !== -1
}

function extractAndSetOptions(options, retVal) {
  options.forEach(function(o) {
    var optionId = o.OptionId
    if (contains(thicknessProperties, optionId)) {
      retVal.depth = extractThickness(o.Value)
    } else if (contains(sizeProperties, optionId)) {
      var vals = extractHeightWidth(o.Value)
      retVal.height = vals.height
      retVal.width = vals.width
    } else if (optionsMap.canvasWrapType === optionId) {
      retVal.wrapType = o.Value
    } else if (contains(materialOptions, optionId)) {
      retVal.material = o.Value
    } else if (contains(typeOptions, optionId)) {
      retVal.type = o.Value
    } else if (optionsMap.coasterQuantity === optionId) {
      retVal.quantity = o.Value
    } else if (optionsMap.duvetCoverBedType === optionId) {
      retVal.bedType = o.Value
    } else if (optionsMap.duvetCoverBackColor === optionId) {
      retVal.backColor = o.Value
    } else if (contains(paperTypeOptions, optionId)) {
      retVal.paperType = o.Value
    } else if (contains(packSizeOptions, optionId)) {
      retVal.packSize = o.Value
    } else if (contains(colorOptions, optionId)) {
      retVal.color = o.Value
    } else if (optionsMap.framedPrintMatSize === optionId) {
      retVal.matSize = o.Value
    } else if (contains(clothingSizeOptions, optionId)) {
      retVal.size = o.Value
    } else if (contains(brandOptions, optionId)) {
      retVal.brand = o.Value
    } else if (contains(genderOptions, optionId)) {
      retVal.gender = o.Value
    } else if (contains(printLocationOptions, optionId)) {
      retVal.printLocation = o.Value
    } else if (optionsMap.photoBookPageCount === optionId) {
      retVal.pageCount = o.Value
    } else if (optionsMap.photoBookCoverType === optionId) {
      retVal.coverType = o.Value
    } else if (contains(paperFinishOptions, optionId)) {
      retVal.paperFinish = o.Value
    } else if (optionsMap.metalPrintBackType === optionId) {
      retVal.backingType = o.Value
    } else if (optionsMap.metalPrintFinish === optionId) {
      retVal.finish = o.Value
    }
  })
  return retVal
}

function getBaseVals(v) {
  return {
    id: newId(),
    vendorId: v.Sku,
    printingPrice: getPrintingPrice(v),
    salePrice: getSalePrice(v),
    units: 'inches'
  }
}

function setOptions(v) {
  return extractAndSetOptions(v.Options, getBaseVals(v))
}

// - 'Acrylic Blocks'
// - 'Acrylic Prints'
// - 'Art Posters'
// - 'Canvas Minis'
// - 'Canvas Posters'
// - 'Canvas Wraps'
// - 'Cloth Napkins'
// - 'Coasters'
// - 'Duvet Covers'
// - 'Flat Cards'
// - 'Floormat'
// - 'Folded Cards'
// - 'Framed Canvas'
// - 'Framed Prints'
// - 'Giclee Art Prints'
// - 'Hoodies'
// - 'Layflat Photobooks'
// - 'Metal Prints'
// - 'Posters'
// - 'Prints'
// - 'Professional Prints'
// - 'Throw Pillows'
// - 'T-Shirts'
// - 'Wash Cloths'
// - 'Youth Apparel'

function constructProductFromPrintIo(p) {
  var images = p.Images.map(function(i) { return i.Url })
  var imageUrl = images.pop()
  return {
    id : newId(),
    name: p.Name,
    description: p.ShortDescription,
    vendorName: p.Name,
    vendorDescription: p.ShortDescription,
    vendor: 'print.io',
    vendorId: p.Id,
    images: images,
    imageUrl: imageUrl
  }
}

function firebaseListFromArray(arr) {
  return arr.reduce(function(rv, o) {
    rv[o.id] = true
    return rv
  }, {})
}

function setOptionsInFirebaseFormat(returnObj, options) {
  return options.reduce(function(rv, co) {
    var optionId = co.id
    delete co.id
    rv[optionId] = co
    return rv
  }, returnObj)
}

function transformProducts(data, cback) {
  async.map(
    data.Products.map(constructProductFromPrintIo),
    //data.Products.filter(function(x) { return x.Name === 'Floormat'}).map(constructProductFromPrintIo),
    function(product, cb) {
      service.getProductVariants('us', product.vendorId, function(variants) {
        product.options = variants.ProductVariants.map(setOptions)
        cb(null, product)
      })
    },
    function(err, products) {
      var r = products.reduce(function(retVal, cur) {
        var options = cur.options
        var optionsObj = firebaseListFromArray(options)
        cur.options = optionsObj
        retVal.productOptions = setOptionsInFirebaseFormat(retVal.productOptions, options)
        var prodId = cur.id
        delete cur.id
        retVal.products[prodId] = cur
        return retVal
      }, {products:{}, productOptions:{}})
      cback(r)
    }
  )
}

service.getProducts('us','us','usd', function(d) {
  transformProducts(d, function(results) {
    fs.writeFile(outputFile, JSON.stringify(results, null, '  '), function(err) {
      if (err) { return console.log('Got error: ', err) }
      console.log('Output results to file: ', outputFile)
    })
  })
})
