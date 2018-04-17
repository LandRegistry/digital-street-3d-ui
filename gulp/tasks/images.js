const path = require('path')

module.exports = (gulp, config) => {
  gulp.task('appImages', () =>
    gulp
      .src(path.join(config.sourcePath, 'images/**'))
      .pipe(gulp.dest(path.join(config.destinationPath, 'images/app')))
  )

  gulp.task('patternLibraryImages', () => {
    var patternLibraryPath

    try {
      patternLibraryPath = path.dirname(require.resolve('land-registry-elements/README.md'))
    } catch (err) {
      patternLibraryPath = '.'
    }

    return gulp
      .src(path.join(patternLibraryPath, 'src/land_registry_elements/**/*.{gif,png,jpg,jpeg,svg}'))
      .pipe(gulp.dest(path.join(config.destinationPath, 'images/land_registry_elements')))
  })

  gulp.task('images', gulp.parallel(['appImages', 'patternLibraryImages']))
}
