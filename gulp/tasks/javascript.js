var glob = require('glob')
var path = require('path')
var gulp = require('gulp')
var rollup = require('rollup-stream')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var uglify = require('rollup-plugin-uglify')
var sourcemaps = require('gulp-sourcemaps')
var nodeResolve = require('rollup-plugin-node-resolve')
var commonjs = require('rollup-plugin-commonjs')

var config = require('../config')

gulp.task('js', function () {
  var promises = []

  // Loop over all our entrypoints
  var entrypoints = glob.sync(path.join(config.assetsPath, 'src/javascripts/*.js'))

  if (!entrypoints) {
    return
  }

  entrypoints.forEach(function (entrypoint) {
    var name = path.basename(entrypoint)

    promises.push(new Promise(function (resolve, reject) {
      rollup({
        entry: entrypoint,
        sourceMap: true,
        legacy: true,
        moduleContext: config.moduleContext,
        plugins: [
          nodeResolve(),
          commonjs({
            include: 'node_modules/**'
          }),
          uglify({
            compress: {
              screw_ie8: false
            },
            mangle: {
              screw_ie8: false
            },
            output: {
              screw_ie8: false
            }
          })
        ],
        format: 'iife'
      })
      .pipe(source(name, path.join(config.assetsPath, 'src/javascripts')))
      .pipe(buffer())                           // buffer the output. most gulp plugins, including gulp-sourcemaps, don't support streams.
      .pipe(sourcemaps.init({loadMaps: true}))  // tell gulp-sourcemaps to load the inline sourcemap produced by rollup-stream.
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(path.join(config.assetsPath, 'dist/javascripts')))
      .on('end', resolve)
    }))
  })

  return Promise.all(promises)
})
