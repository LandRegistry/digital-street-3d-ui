module.exports = function (gulp, config) {
  var watchConfig = {
    cwd: config.sourcePath,
    usePolling: true
  }

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

  gulp.task('watch', gulp.parallel('sassWatch'))
}
