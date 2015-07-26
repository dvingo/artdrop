var express = require('express')
var app = express()
var request = require('request')
var cors = require('cors')
var config = require('./config')

function s3Url(filename) {
  return [config.s3Endpoint, config.s3BucketName, filename].join('/')
}

//var corsRequest = request.defaults({
  //headers: {
    //"Access-Control-Allow-Origin": "*",
    //"Access-Control-Allow-Headers": "X-Requested-With, Content-Length",
    //"Access-Control-Expose-Headers": "Content-Length"
  //}
//})

app.get('/images/:imageName', cors(), function(req, res) {
  request(s3Url(req.params.imageName)).pipe(res)
})

app.use(express.static('hosted-dir'))

app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/hosted-dir/index.html')
})

var port = process.env.PORT || config.devPort
var server = app.listen(port, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Application listening at http://%s:%s', host, port);
})
