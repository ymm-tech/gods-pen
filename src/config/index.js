const defaultConfig = require('./default')

let config = Object.assign(defaultConfig, require('./' + (process.env.CODE_ENV || 'local')))

;['VIEW_PATH', 'ADMIN_PATH', 'EDITOR_PATH', 'API_PATH'].map(k => {
  if (config[k] === '/') return
  if (/^(https?:)?\/\//.test(config[k])) {
    config[k] = config[k].replace(/\/*$/, '/')
  } else {
    config[k] = config[k].replace(/^\/*|\/*$/g, '/')
  }
})

config.VIEW_NAME = process.env.NODE_ENV === 'development' ? '' : (config.VIEW_PATH.match(/([^/]+)\/?$/) || ['', 'view'])[1]
config.EDITOR_NAME = process.env.NODE_ENV === 'development' ? '' : (config.EDITOR_PATH.match(/([^/]+)\/?$/) || ['', 'editor'])[1]

module.exports = config
