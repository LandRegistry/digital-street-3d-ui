var gulp = require('gulp')
var path = require('path')
var glob = require('glob')

var config = require('./gulp/config.js')

// Register all the gulp tasks from the /gulp directory
glob.sync('gulp/tasks/**/*.js').map((task) => require(path.resolve(__dirname, task))(gulp, config))
