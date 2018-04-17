var path = require('path')
var exec = require('child_process').exec

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
    exec('webpack', function (err, stdout, stderr) {
      console.log(stdout)
      console.log(stderr)
      cb(err)
    })
  })
}
