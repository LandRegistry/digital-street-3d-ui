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

        // Quoting dict keys, because nunjucks doesn't require them but jinja does
        contents = contents.replace(/^([ ]*)([^"#\r\n:]+?)\s*:/gm, "$1'$2':")

        // Gov template uses .items, which is a reserved word in python
        contents = contents.replace(/\.items/g, "['items']")

        // Python doesn't like inline ifs that don't have elses
        // See phase banner for example
        contents = contents.replace(/\b(.+) if \1(?! else)/g, "$1 if $1 else ''")

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
