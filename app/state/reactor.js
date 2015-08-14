var {env} = require('../../config')
var Nuclear = require('nuclear-js');
var debug = env === 'prod' ? false : true
module.exports = new Nuclear.Reactor({debug:debug});
