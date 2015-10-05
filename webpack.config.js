var path = require('path')
var webpack = require('webpack')
var srcDir = 'app'

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './' + srcDir + '/index'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/' + srcDir + '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({DEBUG:true,TEST:false,DEV:true})
  ],
  resolve: {
    root: __dirname + '/app',
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel'],
      exclude: path.join(__dirname, 'node_modules')
    }, {
      test: /\.scss$/,
      loader: "style!css!sass"
    }]
  }
}
