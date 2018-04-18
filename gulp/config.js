var path = require('path')

module.exports = {
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
