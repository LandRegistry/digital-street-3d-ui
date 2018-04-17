var spawn = require('child_process').spawn

module.exports = function (gulp, config) {
  var watchConfig = {
    cwd: config.sourcePath,
    usePolling: true
  }

  gulp.task('webpackWatch', function () {
    var webpackWatch = spawn('webpack', ['--watch'])

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

  gulp.task('sassWatch', function () {
    var watcher = gulp.watch('scss/**/*.scss', watchConfig, gulp.series(['sass']))

    watcher.on('change', function (path, stats) {
      console.log(path + ' changed')
    })

    watcher.on('add', function (path) {
      console.log(path + ' added')
    })

    watcher.on('unlink', function (path) {
      console.log(path + ' removed')
    })
  })

  gulp.task('watch', gulp.parallel('webpackWatch', 'sassWatch'))
}
