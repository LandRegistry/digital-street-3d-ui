var path = require('path')

var config = {
  'applicationPath': './flask_skeleton_ui',
  'assetsPath': 'assets',
  'sassPath': 'src/scss/*.scss'
}

config.assetsPath = path.join(config.applicationPath, config.assetsPath)

module.exports = config
