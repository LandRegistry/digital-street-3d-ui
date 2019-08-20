var config = {
  'applicationPath': './search_index_map_ui',
  'sourcePath': './search_index_map_ui/assets/src',
  'destinationPath': './search_index_map_ui/assets/dist',
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
