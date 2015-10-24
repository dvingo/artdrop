var path = require('path')
var webpack = require('webpack')
var srcDir = 'app'
var stripePublishableKey = '"' + process.env['ARTDROP_STRIPE_PUBLISHABLE_KEY'] + '"'

if (!stripePublishableKey) {
  console.log('Stripe publishable key is not set.\n')
}

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
    new webpack.DefinePlugin({
      DEBUG:false,TEST:false,DEV:false,
      stripePublishableKey:stripePublishableKey
    })
  ],
  resolve: {
    root: __dirname + '/' + srcDir,
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: path.join(__dirname, 'node_modules')
    }, {
      test: /\.scss$/,
      loader: "style!css!sass"
    }]
  }
}
