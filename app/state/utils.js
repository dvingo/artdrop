import {credsRef} from 'state/firebaseRefs'
var config = require('config')
var pako = require('pako')
var srcDir = config.srcDir
var s3Endpoint = config.s3Endpoint
var designPreviewSize = config.designPreviewSize
var designDetailSize = config.designDetailSize
var s3BucketName = config.s3BucketName
var hostname = config.hostname
var window;
var scheme = window ? window.location.protocol : ''
hostname = scheme + '//' + hostname
/**
 * From: https://gist.github.com/mikelehen/3596a30bd69384624c11
 * Fancy ID generator that creates 20-character string identifiers with the following properties:
 *
 * 1. They're based on timestamp so that they sort *after* any existing ids.
 * 2. They contain 72-bits of random data after the timestamp so that IDs won't
 *    collide with other clients' IDs.
 * 3. They sort *lexicographically* (so the timestamp is converted to characters that will sort properly).
 * 4. They're monotonically increasing.  Even if you generate more than one in the same timestamp, the
 *    latter ones will sort after the former ones.  We do this by using the previous random bits
 *    but "incrementing" them by 1 (only in the case of a timestamp collision).
 */
var generateFirebaseID = (function() {
  // Modeled after base64 web-safe chars, but ordered by ASCII.
  var PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

  // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
  var lastPushTime = 0;

  // We generate 72-bits of randomness which get turned into 12 characters and appended to the
  // timestamp to prevent collisions with other clients.  We store the last characters we
  // generated because in the event of a collision, we'll use those same characters except
  // "incremented" by one.
  var lastRandChars = [];

  return function() {
    var now = new Date().getTime();
    var duplicateTime = (now === lastPushTime);
    lastPushTime = now;

    var timeStampChars = new Array(8);
    for (var i = 7; i >= 0; i--) {
      timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
      // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
      now = Math.floor(now / 64);
    }
    if (now !== 0) throw new Error('We should have converted the entire timestamp.');

    var id = timeStampChars.join('');

    if (!duplicateTime) {
      for (i = 0; i < 12; i++) {
        lastRandChars[i] = Math.floor(Math.random() * 64);
      }
    } else {
      // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
      for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
        lastRandChars[i] = 0;
      }
      lastRandChars[i]++;
    }
    for (i = 0; i < 12; i++) {
      id += PUSH_CHARS.charAt(lastRandChars[i]);
    }
    if(id.length != 20) throw new Error('Length should be 20.');

    return id;
  };
}())

var toA = (list) => Array.prototype.slice.call(list, 0)

var dataUriToBlob = (dataUri) => {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString = (
    (dataUri.split(',')[0].indexOf('base64') >= 0)
    ? atob(dataUri.split(',')[1])
    : unescape(dataUri.split(',')[1])
  )
  // separate out the mime component
  var mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0]
  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length)
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ia], {type:mimeString});
}

var svgTextToImage = (svgEl) => {
  var svgString = (new window.XMLSerializer()).serializeToString(svgEl)
  var imageString = 'data:image/svg+xml;base64,' + window.btoa(svgString)
  var img = new Image()
  img.height = 400
  img.width = 400
  img.src = imageString
  return img
}

var renderDesignToJpegBlob = (size, svgEls, compositeSvg) => {
  var w = size, h = size
  var canvas = document.createElement('canvas')
  canvas.height = h
  canvas.width = w
  var svgs = (
    toA(svgEls).map(svg => {
      svg.setAttribute('height', String(h))
      svg.setAttribute('width', String(w))
      return svg
    })
    .map(svgTextToImage)
  )

  var ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, w, h)
  var bgColor = '#fff'
  svgs.forEach(svg => {
    ctx.drawImage(svg, 0, 0, w, h)
  })

  if (compositeSvg) {
    ctx.globalCompositeOperation = 'multiply'
    compositeSvg.setAttribute('height', String(h))
    compositeSvg.setAttribute('width', String(w))
    let compositeSvg = svgTextToImage(compositeSvg)
    ctx.drawImage(compositeSvg, 0, 0, w, h)
  }
  //Draw a white background.
  ctx.globalCompositeOperation = "destination-over"
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, w, h)
  return dataUriToBlob(canvas.toDataURL('image/jpeg', 1.0))
}

var urlForImage = (title, type) => {
  var retVal = hostname + '/images/' + title
  if (type) { retVal += '.' + type }
  return retVal
}

var s3UrlForImage = (filename) => {
  return `${s3Endpoint}/${s3BucketName}/${filename}`
}

var imageUrlForLayerImage = (layerImage) => {
  var filename = (layerImage.has('filename')
      ? layerImage.get('filename')
      : layerImage.get('imageUrl').split('/').pop())
  return urlForImage(filename)
}

var uploadImgToS3 = (file, filename, imgType, onComplete) => {
  var body = file
  if (imgType === 'image/svg+xml') {
    body = pako.gzip(file)
  }
  credsRef.once('value', snapshot => {
    var creds = snapshot.val()
    AWS.config.credentials = {
      accessKeyId: creds.s3AccessKey,
      secretAccessKey: creds.s3SecretKey}
    var params = {
      Bucket: s3BucketName,
      Key: filename,
      ACL: 'public-read',
      CacheControl: 'max-age: 45792000',
      ContentType: imgType,
      Body: body}

    if (imgType === 'image/svg+xml') {
      params.ContentEncoding = 'gzip'
    }
    var s3 = new AWS.S3()
    s3.putObject(params, (err, d) => {
      if (err) {
        console.log('got error: ',err)
        onComplete(new Error('Failed to upload to s3.'))
      } else {
        onComplete(null, s3UrlForImage(filename))
      }
    })
  })
}

export default {
  imageUrlForDesign(design, size) {
    if (size === 'small') {
      return design.get('smallImageUrl')
    }
    if (size === 'large') {
      return design.get('largeImageUrl')
    }

    var filename = (design.has('title')
        ? design.get('title')
        : design.get('imageUrl').split('/').pop())
    return urlForImage(filename + '-' + size, 'jpg')
  },

  imageUrlForLayer(layer) {
    return imageUrlForLayerImage(layer.get('selectedLayerImage'))
  },
  compositeImageUrlForLayer(layer) {
    return layer.getIn(['selectedLayerImage', 'compositeImageUrl'])
                .replace('/assets/images/new/', '/' + srcDir + '/images/layers/')
  },
  imageUrlForLayerImage: imageUrlForLayerImage,

  imageUrlForSurface(surface) {
    if (surface == null) { return null }
    return surface.get('imageUrl')
                .replace('/assets/surfaces/', '/' + srcDir + '/images/surfaces/')
  },
  newId: generateFirebaseID,

  s3UrlForImage: s3UrlForImage,

  uploadImgToS3: uploadImgToS3,

  uploadDesignPreview(title, svgEls, onComplete) {
    var designJpgBlobSmall = renderDesignToJpegBlob(designPreviewSize, svgEls)
    var designJpgBlobLarge = renderDesignToJpegBlob(designDetailSize, svgEls)
    var smallImageFilename = title + '-small' + '.jpg'
    var largeImageFilename = title + '-large' + '.jpg'
    uploadImgToS3(designJpgBlobSmall, smallImageFilename, 'image/jpeg', (err, smallImgUrl) => {
      if (err) {
        console.log('got error: ',err)
        onComplete(new Error('Failed to upload ' + smallImgUrl + ' to s3.'))
        return
      }
      uploadImgToS3(designJpgBlobLarge, largeImageFilename, 'image/jpeg', (err, largeImgUrl) => {
        if (err) {
          console.log('got error: ',err)
          onComplete(new Error('Failed to upload ' + largeImgUrl + ' to s3.'))
          return
        }
        onComplete(null, {small: smallImgUrl, large: largeImgUrl})
      })
    })
  },

  rotateColorPalette(design, layer, layerIndex) {
    var layers = design.get('layers')
    var index = layerIndex || layers.findIndex(l => l.get('id') === layer.get('id'))
    var currentRotation = layer.get('paletteRotation')
    // 0 - 3
    var nextRotation = (currentRotation + 1) % 4
    var newLayers = layers.update(index, v => v.set('paletteRotation', nextRotation))
    return design.set('layers', newLayers)
  },

  makeDesignCopy(design) {
    // the design will have a new id and the layers will have a new id
    return design.update(d => {
      var newLayers = d.get('layers').map(l => l.set('id', generateFirebaseID()))
      var now = new Date().getTime()
      return d.withMutations(d2 => {
        d2.set('id', generateFirebaseID())
          .set('adminCreated', false)
          .set('layers', newLayers)
          .set('createdAt', now)
          .set('updatedAt', now)
      })
    })
  }
}
