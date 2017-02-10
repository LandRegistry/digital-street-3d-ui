var gulp = require('gulp')
var path = require('path')

var config = require('../config')

gulp.task('copyGovTemplate', ['clean'], function () {
  return gulp
    .src('node_modules/govuk_template_jinja/views/layouts/**')
    .pipe(gulp.dest(path.join(config.applicationPath, 'templates/vendor')))
})

gulp.task('copyGovTemplateAssets', ['clean'], function () {
  return gulp
    .src('node_modules/govuk_template_jinja/assets/**')
    .pipe(gulp.dest(path.join(config.assetsPath, '/dist')))
})

gulp.task('copyGovToolkitImages', ['clean'], function () {
  return gulp
    .src('node_modules/govuk_frontend_toolkit/images/**')
    .pipe(gulp.dest(path.join(config.assetsPath, 'dist/images')))
})

gulp.task('copyGovElements', ['clean'], function () {
  return gulp
    .src([
      'node_modules/govuk-elements-sass/public/sass/**',
      'node_modules/govuk_frontend_toolkit/stylesheets/**'
    ])
   .pipe(gulp.dest(path.join(config.assetsPath, 'src/scss/vendor/govuk-elements')))
})

gulp.task('copyGov', [
  'copyGovTemplate',
  'copyGovTemplateAssets',
  'copyGovElements',
  'copyGovToolkitImages'
])
