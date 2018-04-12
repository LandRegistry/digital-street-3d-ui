var path = require('path')
var sourcemaps = require('gulp-sourcemaps')
var sass = require('gulp-sass')
var postcss = require('gulp-postcss')
var cssnano = require('cssnano')
var autoprefixer = require('autoprefixer')

module.exports = function (gulp, config) {
  gulp.task('sass', function () {
    var sassOptions = {
      outputStyle: 'compressed',
      includePaths: config.sassIncludePaths ? config.sassIncludePaths : []
    }

    return gulp.src(path.join(config.sourcePath, config.sassPath))
      .pipe(sourcemaps.init())
      .pipe(sass(sassOptions).on('error', sass.logError))
      .pipe(postcss([
        autoprefixer(),
        cssnano()
      ]))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(path.join(config.destinationPath, 'stylesheets')))
  })
}
