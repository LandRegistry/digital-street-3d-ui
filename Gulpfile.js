var gulp = require('gulp')
var landregistryGulpTasks = require('landregistry-gulp-tasks')

var path = require('path')

var config = {
  'applicationPath': './flask_skeleton_ui',
  'assetsPath': 'assets',
  'sassPath': 'src/scss/*.scss',
  'localhost': 'localhost:9996'
}

// Set up context for each module
// Commonly used for modules that expect "this" to resolve to the window object
// In ES6 modules, using "this" at the top level always resolves to undefined
// hence the need to override it here
config.moduleContext = {}

try {
  // jQuery referenced here because it'll be a common one for people to trip over
  config.moduleContext[path.relative(process.cwd(), require.resolve('jquery'))] = 'window'
} catch (e) {
  // jQuery not found, no need to set up module context
}

config.assetsPath = path.join(config.applicationPath, config.assetsPath)

landregistryGulpTasks(gulp, config)
