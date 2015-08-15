var path = require('path')
var webpack = require('webpack')
var srcDir = require('./config').srcDir

module.exports = {
  entry: './' + srcDir + '/index',
  output: {
    path: path.join(__dirname, 'hosted-dir'),
    filename: 'bundle.js',
    publicPath: '/' + srcDir + '/'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({DEBUG:false,TEST:false})
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      include: path.join(__dirname, srcDir)
    }, {
      test: /\.scss$/,
      loader: "style!css!sass"
    }]
  }
}
