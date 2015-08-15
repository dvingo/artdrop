var assert = require("assert")
var reactor = require('../app/state/reactor')
var Store = require('../app/state/main')
var Immutable = require('immutable')

describe('TagsStore', function() {
  var tagId = '-JwZ4CsYpdIQu_pKMXx6'
  var tag = {
    id: tagId,
    name: 'tes tag',
    designs: [],
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime()}

  designs = [{
    adminCreated:true,
    createdAt:1437679586636,
    imageUrl:"https://s3.amazonaws.com/com.artdrop.images2/fgd.jpg",
    largeImageUrl:"https://s3.amazonaws.com/com.artdrop.images2/fgd-large.jpg",
    layers:["-JuwNGK517M2crivKwZ2", "-JuwNGK8T4oN1AUvwAk8", "-JuwNGK9w6IbGtwBzsz-"],
    price:2000,
    smallImageUrl:"https://s3.amazonaws.com/com.artdrop.images2/fgd-small.jpg",
    surface:"-JkT6We0_K_YzQCT4TMA",
    title:"fgd",
    updatedAt:1437679586636,
    id:"-JuwNGKBIuLpQLTcMnSN",
    tags:[]
    }, {"adminCreated":true,
    "createdAt":1437681160041,
    "imageUrl":"https://s3.amazonaws.com/com.artdrop.images2/hjkl.jpg",
    "largeImageUrl":"https://s3.amazonaws.com/com.artdrop.images2/hjkl-large.jpg",
    "layers":["-JuwTLo22X3z1-HBMkd-",
    "-JuwTLo5xO55TnBL33tC",
    "-JuwTLo7Di35LEuEfmfK"],
    "price":2000,
    "smallImageUrl":"https://s3.amazonaws.com/com.artdrop.images2/hjkl-small.jpg",
    "surface":"-JkT6We1HXt0lARN0M2y",
    "title":"hjkl",
    "updatedAt":1437681160041,
    "id":"-JuwTLo8mMamQgZSeBF3",
    "tags":[]},
    {"adminCreated":true,
    "createdAt":1437944030574,
    "imageUrl":"https://s3.amazonaws.com/com.artdrop.images2/2.jpg",
    "largeImageUrl":"https://s3.amazonaws.com/com.artdrop.images2/2-large.jpg",
    "layers":["-JvB89KCUWvsx6cGULE-", "-JvB89KMgST0YwoLBU8l",
              "-JvB89KVO6-SdVupGyJy"],
    "price":2000,
    "smallImageUrl":"https://s3.amazonaws.com/com.artdrop.images2/2-small.jpg",
    "surface":"-JkT6We1HXt0lARN0M2z",
    "title":"2",
    "updatedAt":1437944030574,
    "id":"-JvB89K_c5GBpGsRuvXI",
    "tags":[]}
  ]
  var designIds = designs.map(function(d) { return d.id })
  it('Should add tags', function(done) {
    Store.actions.addManyTags([tag])
    Store.actions.addManyDesigns(designs)
    var tags = reactor.evaluate(Store.getters.tags)
    var firstTag = tags.get(0)
    assert.equal(tags.count(), 1)
    assert.equal(firstTag.get('id'), '-JwZ4CsYpdIQu_pKMXx6')
    Store.actions.addDesignsToTag({tag:Immutable.fromJS(tag), designs:Immutable.fromJS(designIds)})
    reactor.observe(['designs'], function(updatedDesigns) {
      updatedDesigns.forEach(function(d) {
        assert.equal(d.getIn(['tags', 0]), tagId)
      })
      firstTag.get('designs').forEach(function(d) {
        assert(designIds.indexOf(d) !== -1, 'The tag should contain the design: ' + d)
      })
      done()
    })
  })
})
