var glob = require('glob')
var path = require('path')

var config = require('./gulp/config.js')

var entryPoints = glob.sync(path.join(config.sourcePath, 'javascripts/*.js'))

module.exports = {
  mode: 'production',
  bail: true,
  devtool: 'source-map',
  entry: entryPoints.map(item => path.resolve(item)),
  output: {
    path: path.resolve(path.join(config.destinationPath, 'javascripts')),
    filename: '[name].js'
  },
  resolve: {
    modules: [
      process.env.NODE_PATH,
      'node_modules'
    ]
  },
  resolveLoader: {
    modules: [
      process.env.NODE_PATH,
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env']
          }
        }
      }
    ]
  }
}
