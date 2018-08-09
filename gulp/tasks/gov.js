const path = require('path')
const es = require('event-stream')
// const rename = require('gulp-rename')

module.exports = (gulp, config) => {
  const govukTemplatePath = path.dirname(require.resolve('govuk-frontend/README.md'))

  gulp.task('copyGovTemplates', () =>
    gulp
      .src(path.join(govukTemplatePath, '**/*.njk'))
      // .pipe(rename({
      //   extname: '.html'
      // }))
      .pipe(es.map(function(file, cb) {
        var contents = file.contents.toString()

        // Rename file
        file.path = file.path.replace('.njk', '.html')

        // Simple conversions from nunjucks/js to jinja/python
        contents = contents.replace(/true/g, 'True')
        contents = contents.replace(/false/g, 'False')
        contents = contents.replace(/\.njk/g, '.html')

        // Resolve paths to the templates as jinja does not support relative paths as nunjucks does
        contents = contents.replace(/\.\.\//g, 'app/vendor/.govuk-frontend/' + path.relative(govukTemplatePath, path.dirname(path.resolve(file.path, '..'))) + '/')
        contents = contents.replace(/\.\//g, 'app/vendor/.govuk-frontend/' + path.relative(govukTemplatePath, path.dirname(file.path)) + '/')

        file.contents = Buffer.from(contents, 'utf8')
        cb(null, file)
      }))

      .pipe(gulp.dest(path.join(config.applicationPath, 'templates/vendor/.govuk-frontend')))
  )

  gulp.task('copyGovAssets', () =>
    gulp
      .src(path.join(govukTemplatePath, 'assets/**/*.*'))
      .pipe(gulp.dest(path.join(config.destinationPath, '.govuk-frontend')))
  )

  gulp.task(
    'copyGov',
    gulp.parallel([
      'copyGovTemplates',
      'copyGovAssets'
    ])
  )
}
