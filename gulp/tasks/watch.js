var path = require('path')
var spawn = require('child_process').spawn

module.exports = function (gulp, config) {
  gulp.task('watch', function () {

    // TODO: SASS NOT WORKING

    gulp.watch(path.join(config.sourcePath, 'scss/**/*.scss'), gulp.series(['sass']))

    var webpackWatch = spawn('webpack', ['--watch', '--color'])

    webpackWatch.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })

    webpackWatch.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`)
    })

    webpackWatch.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
    })
  })
}
