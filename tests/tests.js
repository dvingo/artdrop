var assert = require("assert")
var reactor = require('../app/state/reactor')
var Store = require('../app/state/main')
var Immutable = require('immutable')

describe('TagsStore', function() {
  afterEach(function() {
    reactor.reset()
  })
  var tagId = '-JwZ4CsYpdIQu_pKMXx6'
  var tag = {
    id: tagId,
    name: 'tes tag',
    designs: [],
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime()}

  var design1Id = "-JuwNGKBIuLpQLTcMnSN"
  var design2Id = "-JuwTLo8mMamQgZSeBF3"
  var design3Id = "-JvB89K_c5GBpGsRuvXI"
  var designs = [{
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
    id:design1Id,
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
    id:design2Id,
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
    "id":design3Id,
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

  it('Should remove tags', function(done) {
    Store.actions.addManyTags([tag])
    Store.actions.addManyDesigns(designs)
    Store.actions.addDesignsToTag({tag:Immutable.fromJS(tag), designs:Immutable.fromJS(designIds)})
    reactor.observe(['designs'], function() {
      var tags = reactor.evaluate(Store.getters.tags)
      var firstTag = tags.get(0)
      var selectedDesigns = [design2Id, design3Id]
      var interval = setInterval(function() {
        if (!reactor.__isDispatching) {
          clearInterval(interval)
          Store.actions.addDesignsToTag({tag:firstTag,
            designs:Immutable.fromJS(selectedDesigns)})
        }
      }, 50)
      reactor.observe(['designs'], function(updatedDesigns) {
        var design1 = updatedDesigns.get(design1Id)
        var design2 = updatedDesigns.get(design2Id)
        var design3 = updatedDesigns.get(design3Id)
        assert(design1.get('tags').count() === 0, 'Design 1 should have no tags')
        assert(design2.getIn(['tags', 0]) === tagId, 'Design 2 should have the tag')
        assert(design3.getIn(['tags', 0]) === tagId, 'Design 3 should have the tag')
        var tags = reactor.evaluate(Store.getters.tags)
        var firstTag = tags.get(0)
        var designs = Immutable.Set(firstTag.get('designs'))
        assert(designs.includes(design2Id), 'Design 2 should have the tag')
        assert(designs.includes(design3Id), 'Design 3 should have the tag')
        assert(!designs.includes(design1Id), 'Design 1 should not have the tag')
        done()
      })
    })
  })
})
