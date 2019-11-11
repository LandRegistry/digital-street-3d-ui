var config = {
  'applicationPath': './digital_street_3d_ui',
  'sourcePath': './digital_street_3d_ui/assets/src',
  'destinationPath': './digital_street_3d_ui/assets/dist',
  'sassPath': 'scss/*.scss',
  'sassIncludePaths': [
    'node_modules'
  ],
  'localhost': 'localhost:8080',
  'nodePath': [
    'node_modules'
  ]
}

if ('NODE_PATH' in process.env) {
  config['nodePath'].push(process.env.NODE_PATH)
  config['sassIncludePaths'].push(process.env.NODE_PATH)
}

module.exports = config
