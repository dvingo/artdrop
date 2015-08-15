var path = require('path')
var webpack = require('webpack')
var srcDir = 'app'

module.exports = {
  devtool: 'eval',
  entry: './tests/tests.js',
  output: {
    path: path.join(__dirname, 'test-build'),
    filename: 'tests.js',
    publicPath: '/test/'
  },
  plugins: [new webpack.DefinePlugin({DEBUG:true,TEST:true,DEV:false})],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel'],
      include: path.join(__dirname, srcDir)
    }, {
      test: /\.scss$/,
      loader: "style!css!sass"
    }]
  }
}
