var assert = require("assert")
var reactor = require('../app/state/reactor')
var Store = require('../app/state/main')

describe('TagsStore', function() {
  var tag = {
    id: '-JwZ4CsYpdIQu_pKMXx6',
    name: 'tes tag',
    designs: {'-JvCSGWGPtfhL6IKPMOt': true},
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime()
  }
  Store.actions.addManyTags([tag])
  it('Should add tags', function(done) {
    var tags = reactor.evaluate(Store.getters.tags)
    var firstTag = tags.get(0)
    assert.equal(tags.count(), 1)
    assert.equal(firstTag.get('id'), '-JwZ4CsYpdIQu_pKMXx6')
    assert.equal(firstTag.getIn(['designs', 0]), '-JvCSGWGPtfhL6IKPMOt')
    done()
  })
})
