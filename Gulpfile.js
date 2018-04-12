var gulp = require('gulp')
var path = require('path')
var glob = require('glob')

var config = {
  'applicationPath': './flask_skeleton_ui',
  'sourcePath': './flask_skeleton_ui/assets/src',
  'destinationPath': './flask_skeleton_ui/assets/dist',
  'sassPath': 'scss/*.scss',
  'sassIncludePaths': [
    path.join(path.dirname(require.resolve('land-registry-elements/README.md')), 'src')
  ],
  'localhost': 'localhost:8080',
  'browsersyncPort': 3996
}

// Register all the gulp tasks from the /gulp directory
glob.sync('gulp/**/*.js').map((task) => require(path.resolve(__dirname, task))(gulp, config))
