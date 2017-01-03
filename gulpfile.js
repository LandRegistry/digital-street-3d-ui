var path = require('path')

var gulp = require('gulp')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps');

var assetsPath = './flask_skeleton_ui/assets'
var sassPath = 'src/styles/*.scss'

gulp.task('sass', function () {
  return gulp.src(path.join(assetsPath, sassPath))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('sourcemaps'))
    .pipe(gulp.dest(path.join(assetsPath, 'static/.dist/css')))
});

gulp.task('watch', function () {
  gulp.watch(path.join(assetsPath, sassPath), ['sass'])
})

gulp.task('default', ['sass'])
