var path = require('path')

module.exports = {
  'applicationPath': './flask_skeleton_ui',
  'sourcePath': './flask_skeleton_ui/assets/src',
  'destinationPath': './flask_skeleton_ui/assets/dist',
  'sassPath': 'scss/*.scss',
  'sassIncludePaths': [
    process.env.NODE_PATH,
    'node_modules'
  ],
  'localhost': 'localhost:8080'
}
