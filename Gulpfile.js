var gulp = require('gulp')
var path = require('path')
var landRegistryGulpTasks = require('land-registry-gulp-tasks')

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

// Register all the gulp tasks provided by the land registry module
// If you don't want to do this, you could opt not to register some of the tasks
// Also, if you want more tasks than this, you are free to use the gulp variable
// and register custom tasks below
for (var task in landRegistryGulpTasks) {
  landRegistryGulpTasks[task](gulp, config)
}
