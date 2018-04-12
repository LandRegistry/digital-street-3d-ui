var del = require('del')
var path = require('path')

module.exports = function (gulp, config) {
  gulp.task('clean', ['cleanDist', 'cleanGov'])

  gulp.task('cleanDist', function () {
    return del(config.destinationPath)
  })

  gulp.task('cleanGov', function () {
    return del(path.join(config.sourcePath, 'scss/vendor/govuk-elements'))
  })
}
