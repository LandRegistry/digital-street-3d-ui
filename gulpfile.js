var path = require('path')

var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var sass = require('gulp-sass')
var postcss = require('gulp-postcss')
var cssnano = require('cssnano')
var autoprefixer = require('autoprefixer')
var rollup = require('rollup-stream')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var uglify = require('rollup-plugin-uglify')
var standard = require('gulp-standard')

var assetsPath = './flask_skeleton_ui/assets'
var sassPath = 'src/styles/*.scss'

gulp.task('sass', function () {
  return gulp.src(path.join(assetsPath, sassPath))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      cssnano()
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(assetsPath, 'static/.dist/css')))
})

gulp.task('js', function () {
  return rollup({
    entry: path.join(assetsPath, 'src/javascript/main.js'),
    sourceMap: true,
    plugins: [
      uglify()
    ]
  })
  .pipe(source('main.js', path.join(assetsPath, 'src/javascript')))         // point to the entry file.
  .pipe(buffer())                           // buffer the output. most gulp plugins, including gulp-sourcemaps, don't support streams.
  .pipe(sourcemaps.init({loadMaps: true}))  // tell gulp-sourcemaps to load the inline sourcemap produced by rollup-stream.
  // .pipe(rename('index.js'))                // if you want to output with a different name from the input file, use gulp-rename here.
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(path.join(assetsPath, 'static/.dist/javascript')))
})

gulp.task('standardjs', function () {
  return gulp.src(['**/*.js', '!node_modules/**/*.*'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: false,
      quiet: true,
      showRuleNames: true
    }))
})

gulp.task('test', ['standardjs'])

gulp.task('watch', function () {
  gulp.watch(path.join(assetsPath, sassPath), ['sass'])
  gulp.watch(path.join(assetsPath, 'src/javascript/**/*.js'), ['js', 'standardjs'])
})

gulp.task('default', ['sass', 'js'])
