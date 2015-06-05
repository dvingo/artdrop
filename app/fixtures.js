export default {
  "users": [{
    "id": "userid",
    "name": "sample name",
    "email": "sample@sample.com",
    "shippingAddress": "addressId1",
    "billingAddress": "addressId2",
    "stripeToken": "token123",
    "purchasedDesigns": ["designId1", "designId2", "designId3"],
    "createdAt": "2015-05-21T12:11:35",
    "updatedAt": "2015-05-21T14:02:17",
    "isAdmin": false
  }],
  "designGroups": [{
    "id": "98sdijzcsdio",
    "name": "Design group one",
    "designs": ["designId1", "designId2", "designId3"]
  }],
  "designs": [{
    "id": "design-id1",
    "title": "sample",
    "imageUrl": "combinedImage.jpg",
    "layers": ["layer-id1", "layer-id2","layer-id3"],
    "surface": "surface-id1",
    "price": 2000,
    "designer": "userid",
    "createdAt": "2015-05-21T12:11:35",
    "updatedAt": "2015-05-21T14:02:17"
  }],
  "layerGroups": [{
    "id": "238qasdfj98j",
    "name": "theme1",
    "layers": ["layer-id1","layer-id2","layer-id3"]
  }],
  "layers": [{
    "id": "layer-id1",
    "selectedLayerImage": "layer-image1",
    "colorPalette": "colorPaletteId",
    "layerImages": ["layer-image1", "layer-image2","layer-image3","layer-image4"],
    "design": "design-id1",
    "order": 1,
    "createdAt": "2015-05-21T12:11:35",
    "updatedAt": "2015-05-21T14:02:17"
  }, {
    "id": "layer-id2",
    "selectedLayerImage": "layer-image2",
    "colorPalette": "colorPaletteId",
    "layerImages": ["layer-image1", "layer-image2","layer-image3","layer-image4"],
    "design": "design-id1",
    "order": 1,
    "createdAt": "2015-05-21T12:11:35",
    "updatedAt": "2015-05-21T14:02:17"
  }, {
    "id": "layer-id3",
    "selectedLayerImage": "layer-image3",
    "colorPalette": "colorPaletteId",
    "layerImages": ["layer-image1", "layer-image2","layer-image3","layer-image4"],
    "design": "design-id1",
    "order": 1,
    "createdAt": "2015-05-21T12:11:35",
    "updatedAt": "2015-05-21T14:02:17"
  }],
  "layerImages": [{
    "id": "layer-image1",
    "imageUrl": "src/images/badass_foreground.svg",
    "validOrders": [1, 2 ,3],
    "tags": ["tag-id1", "tag-id2"],
    "createdAt": "2015-05-21T12:11:35",
    "updatedAt": "2015-05-21T14:02:17"
  }, {
    "id": "layer-image2",
    "imageUrl": "src/images/bird_pattern_foreground.svg",
    "validOrders": [1, 2 ,3],
    "tags": [],
    "createdAt": "2015-05-21T12:11:35",
    "updatedAt": "2015-05-21T14:02:17"
  }, {
    "id": "layer-image3",
    "imageUrl": "src/images/blocks_foreground.svg",
    "validOrders": [1, 2 ,3],
    "tags": [],
    "createdAt": "2015-05-21T12:11:35",
    "updatedAt": "2015-05-21T14:02:17"
  }, {
    "id": "layer-image4",
    "imageUrl": "src/images/c-walken_foreground.svg",
    "validOrders": [1, 2 ,3],
    "tags": [],
    "createdAt": "2015-05-21T12:11:35",
    "updatedAt": "2015-05-21T14:02:17"
  }],
  "surfaces": [{
    "id": "surface-id1",
    "type": "maplewood",
    "imageUrl": "images/surfaces/maple.png",
    "createdAt": "2015-05-21T12:11:35",
    "updatedAt": "2015-05-21T14:02:17"
  }],
  "tags": [{
    "id": "tag-id1",
    "name": "tag1"
  }, {
    "id": "tag-id2",
    "name": "tag2"
  }],
  "colorPalettes": [{
    "id": "color-palette1",
    "colorOne": "ee11aa",
    "colorTwo": "8711aa",
    "colorThree": "e011aa",
    "colorFour": "ee11ef",
    "createdAt": "2015-05-21T12:11:35",
    "updatedAt": "2015-05-21T14:02:17"
  }],
  "addresses": [{
    "id": "238j9xxxx8j",
    "line1": "123 Fake street",
    "zipcode": "12345",
    "city": "Fake City",
    "state": "Fake State",
    "country": "UXA"
  }]
}
