var assert = require('assert')
var reactor = require('state/reactor')
var Store = require('state/main')
var Immutable = require('Immutable')
var designs = require('./fixtures/designs')
var getters = require('state/getters')
var dispatchHelper = require('state/helpers')

describe('DesignsGroupedByTag', function() {
  afterEach(function() { reactor.reset() })

  var tagId = '-JwZ4CsYpdIQu_pKMXx6'
  var tag = {
    id: tagId,
    name: 'tes tag',
    designs: [],
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime()
  }

  var designIds = designs.map(function(d) { return d.id })

  it('Should have all designs', function(done) {
    Store.actions.addManyTags([tag])
    Store.actions.addManyDesigns(designs)
    var tags = reactor.evaluate(Store.getters.tags)
    var designsFromReactor = reactor.evaluate(Store.getters.designs)
    assert.equal(designsFromReactor.count(), 3)
    var firstTag = tags.get(0)
    assert.equal(tags.count(), 1)
    assert.equal(firstTag.get('id'), '-JwZ4CsYpdIQu_pKMXx6')

    var designsSortedByGroup = reactor.evaluate(getters.designsGroupedByTag)
    assert.equal(designsSortedByGroup.count(), 3, 'There should be 3 designs')
    console.log('designsSortedByGroup: ', designsSortedByGroup.toJS())
    done()
  })
})
