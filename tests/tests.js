var assert = require("assert")
var reactor = require('../app/state/reactor')
var Store = require('../app/state/main')

console.log('got store: ', Store)

describe('Stores', function() {
  var tag = {
    id: '-JwZ4CsYpdIQu_pKMXx6',
    name: 'tes tag',
    designs: ['-JvCSGWGPtfhL6IKPMOt'],
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime()
  }
  Store.actions.addManyTags([tag])
  //reactor.dispatch('addTag', tag)
  console.log('got here')
  it('yada yada', function(done) {
    setTimeout(function() {
      var tags = reactor.evaluate(['tags'])
      console.log('tags: ', tags)
      done()
    }, 100)
  })
})

