var path = require('path')

module.exports = function (gulp, config) {
  gulp.task('watch', function () {
    gulp.watch(path.join(config.sourcePath, 'scss/**/*.scss'), ['sass'])
    gulp.watch(path.join(config.sourcePath, 'javascripts/**/*.js'), ['js'])

    console.log('Watching...')
  })
}
