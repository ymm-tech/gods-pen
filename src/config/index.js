const defaultConfig = require('./default')

let config = Object.assign(defaultConfig, require('./' + (process.env.CODE_ENV || 'local')))
config.HOST = (config.HOST || '/').replace(/\/*$/, '/')

;['VIEW_PATH', 'ADMIN_PATH', 'EDITOR_PATH', 'API_PATH'].map(k => {
  if (config[k] === '/') return
  if (/^(https?:)?\/\//.test(config[k])) return
  config[k] = config.HOST + config[k].replace(/^\/*|\/*$/g, '') + '/'
})

;['VIEW_NAME', 'ADMIN_NAME', 'EDITOR_NAME', 'API_NAME'].map(k => {
  let pk = k.replace('_NAME', '_PATH')
  config[k] = config[pk] === '/' || /\d+\.\d+\.\d+\.\d+(:\d+)?(\/)?$/.test(config[pk]) ? '' : config[pk].match(/([^/]+)\/?$/) ? config[pk].match(/([^/]+)\/?$/)[1] : 'unknow'
})

module.exports = config
