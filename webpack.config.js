var glob = require('glob')
var path = require('path')
var webpack = require('webpack')

var config = require('./gulp/config.js')

var entryPoints = glob.sync(path.join(config.sourcePath, 'javascripts/*.js'))

module.exports = {
  bail: true,
  devtool: 'source-map',
  resolve: {
    fallback: process.env.NODE_PATH
  },
  resolveLoader: {
    fallback: process.env.NODE_PATH
  },
  entry: entryPoints.map(item => path.resolve(item)),
  output: {
    path: path.resolve(path.join(config.destinationPath, 'javascripts')),
    filename: '[name].js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: [
            [
              'env'
            ]
          ],
          plugins: [
          ]
        }
      }
    ]
  }
}
