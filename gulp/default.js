module.exports = function (gulp, config) {
  gulp.task('copy', [
    'copyGov',
    'jquery',
    'images'
  ])

  gulp.task('build', [
    'sass',
    'js',
    'js-vendor'
  ])

  gulp.task('default', [
    'build'
  ])
}
