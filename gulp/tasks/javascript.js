var path = require('path')
var spawn = require('child_process').spawn

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

  gulp.task('js', function (cb) {
    var webpackArgs

    if (process.argv.includes('--watch')) {
      webpackArgs = ['--watch']
    } else {
      // If we're not running in dev mode, make webpack be quiet
      webpackArgs = ['--display', 'errors-only']
    }

    var webpack = spawn('webpack', webpackArgs)

    webpack.stdout.on('data', (data) => {
      console.log(data.toString())
    })

    webpack.stderr.on('data', (data) => {
      console.log(data.toString())
    })

    return webpack
  })
}
