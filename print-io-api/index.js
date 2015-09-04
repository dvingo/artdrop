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

function getProductVariants(p) {
  return p.ProductVariants
}

function getPrintingPrice(v) {
  return v.PriceInfo.Price * 100
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

var optionsMap = {
   acrylicBlockSize:      '226c9e02a1ce4e37bcc17ab6e229ba90',
   acrylicBlockThickness: '96b7de2821a64b47b6e7c172d3cc4e77',
   acrylicPrintSize:      '67a673fd52224aa6866aba1485508422',
   acrylicPrintThickness: '5927d683883e4b63923468d524f15a61',
   artPosterSize:         'eb0305d195c949d987ec86c4c6d57f2c',
   canvasMiniSize:        '9f9c9d1c4b704356b55a04904971a4c0',
   canvasPosterSize:      '315c04b70e67494fbb203b0ef023fe0b',
   canvasWrapSize:        '568b5efc04d54cfcbba692350bba6248',
   canvasWrapType:        '53690280519549a3bc7ed05c92607f11',
   clothNapkinSize:       '16f6b99d55b348c6bd6980fb59e929db',
   clothNapkinMaterial:   'b18b0f299aa74be192faae081d20ab8a',
   coasterSize:           'ff2e86a5f0fd4191b336b5acf7bff37a',
   coasterType:           '71050dfa2eff461fbc195a549e6eb3d0',
   coasterQuantity:       '13f0a64b7b3c449280141dbd8f17b2b8',
   duvetCoverBackColor:   'a7fc54c639384c49a255b1611eead7d3',
   duvetCoverMaterial:    '977402ea93bb4db781086e8be9ebf943',
   duvetCoverBedType:     '2ccec03491754603a51d1fa00c5649fb',
   duvetCoverSize:        '02b03365db27421b9ac451c0e5ea0638',
   flatCardsSize:         '439f4e4bb6fd412aaf4cbed2e83d50da',
   flatCardsPaperType:    '0a8204aec5b24b4cbaff249fc2106943',
   flatCardsPackSize:     '88eb54eb707942918cb5e61dc0ccc2de',
   floormatSize:          '504d3db60f2d4d29913ae9bcbad860c2',
   floormatMaterial:      '360e092fdef94b5e94ef3b417933b66e',
   foldedCardsSize:       'da46edb521d14c13b5cca8babbd31d34',
   foldedCardsPaperType:  '62c313f2ddbc4a7cb2a36b7bc9e7c59d',
   foldedCardsPackSize:   '283510fe0bea4d4ea82d378ed38bb1d7',
   foldedCardsSideType:   '0b53534cb0984ed8b0bd991caefb4dc8',
   framedCanvasSize:      '26b66c145877439ab7eb765ad5a52309',
   framedCanvasColor:     '7702d54940094ce5bbb625a816e6a56d',
   framedCanvasThickness: '7e0232ca5e604a18bbb35d192952f1a6',
}

var sizeProperties = [
  optionsMap.acrylicBlockSize,
  optionsMap.acrylicPrintSize,
  optionsMap.artPosterSize,
  optionsMap.canvasMiniSize,
  optionsMap.canvasPosterSize,
  optionsMap.canvasWrapSize,
  optionsMap.clothNapkinSize,
  optionsMap.coasterSize,
  optionsMap.duvetCoverSize,
  optionsMap.flatCardsSize,
  optionsMap.floormatSize,
  optionsMap.foldedCardsSize,
  optionsMap.framedCanvasSize,
]

var thicknessProperties = [
  optionsMap.acrylicBlockThickness,
  optionsMap.acrylicPrintThickness,
  optionsMap.framedCanvasThickness,
]

var materialOptions =  [
  optionsMap.clothNapkinMaterial,
  optionsMap.duvetCoverMaterial,
  optionsMap.floormatMaterial
]

var paperTypeOptions = [
  optionsMap.foldedCardsPaperType,
  optionsMap.flatCardsPaperType
]

var packSizeOptions = [
  optionsMap.foldedCardsPackSize,
  optionsMap.flatCardsPackSize
]

function extractAndSetOptions(options, retVal) {
  options.forEach(function(o) {
    var optionId = o.OptionId
    var name = o.Name
    if (contains(thicknessProperties, optionId)) {
      retVal.depth = extractThickness(o.Value)
    } else if (contains(sizeProperties, optionId)) {
      var vals = extractHeightWidth(o.Value)
      retVal.height = vals.height
      retVal.width = vals.width
    } else if (canvasWrapType === optionId) {
      retVal.wrapType = o.Value
    } else if (contains(materialOptions, optionId)) {
      retVal.material = o.Value
    } else if (coasterType === optionId) {
      retVal.type = o.Value
    } else if (coasterQuantity === optionId) {
      retVal.quantity = o.Value
    } else if (duvetCoverBedType === optionId) {
      retVal.bedType = o.Value
    } else if (duvetCoverBackColor === optionId) {
      retVal.backColor = o.Value
    } else if (contains(paperTypeOptions, optionId)) {
      retVal.paperType = o.Value
    } else if (contains(packSizeOptions, optionId)) {
      retVal.packSize = o.Value
    } else if (framedCanvasColor === optionId) {
      retVal.color = o.Value
    }

  })
  return retVal
}

function getBaseVals(v) {
  return {
    id: newId(),
    vendorId: v.Sku,
    printingPrice: getPrintingPrice(v),
    salePrice: getSalePrice(v)}
}

function getBaseValsWithInches(v) {
  var retVal = getBaseVals(v)
  retVal.units = 'inches'
  return retVal
}

function extractFnForRectangles(v) {
  var retVal = getBaseValsWithInches(v)
  return extractAndSetOptions(v.Options, retVal)
}

var margin = 1.4
var extractionMap = {
  'Acrylic Blocks': extractFnForRectangles,
  'Acrylic Prints': extractFnForRectangles,
  'Art Posters': extractFnForRectangles,
  'Canvas Minis': extractFnForRectangles,
  'Canvas Posters': extractFnForRectangles,
  'Canvas Wraps': extractFnForRectangles,
  'Cloth Napkins': extractFnForRectangles,
  'Coasters': extractFnForRectangles,
  'Duvet Covers': extractFnForRectangles,
  'Flat Cards': extractFnForRectangles,
  'Floormat': extractFnForRectangles,
  'Folded Cards': extractFnForRectangles,
  'Framed Canvas': function(v) {
  },
  'Framed Prints': function(v) {
  },
  'Giclee Art Prints': function(v) {
  },
  'Hoodies': function(v) {
  },
  'Layflat Photobooks': function(v) {
  },
  'Metal Prints': function(v) {
  },
  'Posters': function(v) {
  },
  'Prints': function(v) {
  },
  'Professional Prints': function(v) {
  },
  'Throw Pillows': function(v) {
  },
  'T-Shirts': function(v) {
  },
  'Wash Cloths': function(v) {
  },
  'Youth Apparel': function(v) {
  }
}

service.getProducts('us','us','usd', function(d) {
  //console.log('got d: ', d)
  async.map(
   d.Products.filter(function(p) {
     //return p.HasAvailableProductVariants
     return p.Name ===  'Framed Canvas'
   })
   .map(function(p) {
    var images = p.Images.map(function(i) { return i.Url })
    var imageUrl = images.pop()
    return {
      id: newId(),
      name: p.Name,
      description: p.ShortDescription,
      vendor: 'print.io',
      vendorId: p.Id,
      images: images,
      imageUrl: imageUrl
    }
  }),
  function(product, cb) {
    console.log('getting variants for product: ', product.name)
    service.getProductVariants('us', product.vendorId, function(variants) {
      // Here transform to the proper form.
      // And set them on product
      var fn = extractionMap[product.name]

      variants.ProductVariants.forEach(function(v) {
        v.Options.forEach(function(o) {
          console.log('option name, id: ', o.Name, ', ', o.OptionId)
          console.log('value: ', o.Value)
        })
      })
      //variants = variants.ProductVariants.map(fn)
      //console.log('variants: ', variants)
      cb(null, variants)
    })
  },
  function(err, results) {
    //console.log("got variants: ", results)
  })
})
