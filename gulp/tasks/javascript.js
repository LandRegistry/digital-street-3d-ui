var glob = require('glob')
var path = require('path')
var webpack = require('webpack')

var webpackConfig = require('../../webpack.config.js')

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

    return new Promise(function (resolve, reject) {
      webpack(webpackConfig,
      function (err, stats) {
        if (err) {
          reject(err)
        }

        resolve('Webpack finished')
      })
    })
  })
}
