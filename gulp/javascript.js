var glob = require('glob')
var path = require('path')
var webpack = require('webpack')

module.exports = function (gulp, config) {
  gulp.task('jquery', function () {
    return gulp
      .src(require.resolve('jquery/dist/jquery.min.js'))
      .pipe(gulp.dest(path.join(config.destinationPath, 'javascripts')))
  })

  gulp.task('js-vendor', function () {
    return gulp
      .src(path.join(config.sourcePath, 'javascripts/vendor/*'))
      .pipe(gulp.dest(path.join(config.destinationPath, 'javascripts/vendor')))
  })

  gulp.task('js', function () {
    // Loop over all our entrypoints
    var files = glob.sync(path.join(config.sourcePath, 'javascripts/*.js'))

    if (!files) {
      return
    }

    return new Promise(function (resolve, reject) {
      var entrypoints = files.reduce(function (accumlator, value) {
        var inputPath = path.resolve(value)
        var name = path.basename(value, '.js')
        accumlator[name] = inputPath
        accumlator[name + '.min'] = inputPath
        return accumlator
      }, {})

      webpack({
        bail: true,
        devtool: 'source-map',
        resolve: {
          fallback: process.env.NODE_PATH
        },
        resolveLoader: {
          fallback: process.env.NODE_PATH
        },
        entry: entrypoints,
        output: {
          path: path.resolve(path.join(config.destinationPath, 'javascripts')),
          filename: '[name].js'
        },
        plugins: [
          new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/
          })
        ],
        module: {
          loaders: [
            {
              test: /\.js$/,
              loader: 'babel-loader',
              query: {
                presets: [
                  [
                    'env',
                    {
                      loose: true // For IE8. See https://babeljs.io/docs/usage/caveats/#internet-explorer-getters-setters-8-and-below-
                    }
                  ]
                ],
                plugins: [
                  'transform-es3-property-literals',
                  'transform-es3-member-expression-literals'
                ]
              }
            }
          ]
        }
      },
      function (err, stats) {
        if (err) {
          reject(err)
        }

        resolve('Webpack finished')
      })
    })
  })
}
