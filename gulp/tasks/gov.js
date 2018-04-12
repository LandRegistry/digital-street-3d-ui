var path = require('path')

module.exports = function (gulp, config) {
  var govuk_template_jinja_path = path.dirname(require.resolve('govuk_template_jinja/README.md'))
  var govuk_frontend_toolkit_path = path.dirname(require.resolve('govuk_frontend_toolkit/README.md'))
  var govuk_elements_sass_path = path.dirname(require.resolve('govuk-elements-sass/README.md'))

  gulp.task('copyGovTemplate', function () {
    return gulp
      .src(path.join(govuk_template_jinja_path, 'views/layouts/**'))
      .pipe(gulp.dest(path.join(config.applicationPath, 'templates/vendor')))
  })

  gulp.task('copyGovTemplateAssets', function () {
    return gulp
      .src(path.join(govuk_template_jinja_path, 'assets/**'))
      .pipe(gulp.dest(config.destinationPath))
  })

  gulp.task('copyGovToolkitImages', function () {
    return gulp
      .src(path.join(govuk_frontend_toolkit_path, 'images/**'))
      .pipe(gulp.dest(path.join(config.destinationPath, 'images')))
  })

  gulp.task('copyGovElements', function () {
    return gulp
      .src([
        path.join(govuk_elements_sass_path, 'public/sass/**'),
        path.join(govuk_frontend_toolkit_path, 'stylesheets/**')
      ])
     .pipe(gulp.dest(path.join(config.sourcePath, 'scss/vendor/govuk-elements')))
  })

  gulp.task('copyGov', gulp.parallel([
    'copyGovTemplate',
    'copyGovTemplateAssets',
    'copyGovElements',
    'copyGovToolkitImages'
  ]))
}
