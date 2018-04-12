var gulp = require('gulp')
var path = require('path')
var glob = require('glob')

var config = require('./gulp/config.js')

// Register all the gulp tasks from the /gulp directory
// glob.sync('gulp/tasks/**/*.js').map((task) => require(path.resolve(__dirname, task))(gulp, config))
require('./gulp/tasks/clean.js')(gulp, config)
require('./gulp/tasks/gov.js')(gulp, config)
require('./gulp/tasks/images.js')(gulp, config)
require('./gulp/tasks/javascript.js')(gulp, config)
require('./gulp/tasks/linting.js')(gulp, config)
require('./gulp/tasks/sass.js')(gulp, config)
require('./gulp/tasks/watch.js')(gulp, config)
require('./gulp/tasks/default.js')(gulp, config)
