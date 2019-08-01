import axios from 'axios'
let Config = require('../config/index')
var demoMode = process.env.NODE_ENV !== 'production' && !location.search.includes('key=') && /^https?:\/\/godspen.ymm56.com/.test(Config.API_PATH)
var instance = axios.create({
  baseURL: Config.API_PATH,
  timeout: 60 * 60 * 1000,
  headers: demoMode ? {clikey: 'DEcTjQRFbiYitFydhC2m5kd8JHieQrsztrbiPaz5DbHk68AWbmMBe7ShXw2ncwp5'} : {},
  trimNull: false, // 是否去除空值
  withCredentials: true, // default
  needLoading: false, // 是否需要加载效果
  ignoreCode: false // 是否忽略服务端的错误提示
})
instance.interceptors.request.use(function (config) {
  if (config.needLoading) {
    window.EMA.fire('loading.show')
  }
  config.data = config.data || {}
  if (config.trimNull && !(config.data instanceof window.FormData)) {
    let _data = Object.assign({}, config.data)
    isNull(_data)
    config.data = _data
  }
  return config

  function isNull (obj) {
    for (let [key, value] of Object.entries(obj)) {
      if (!value && typeof value !== 'number') {
        obj[key] = null
        return
      }
      if (typeof value === 'object' && !(value instanceof Date)) isNull(value)
    }
  }
}, function (error) {
  return Promise.reject(error)
})

instance.interceptors.response.use(function (response) {
  if (response.config.needLoading) {
    window.EMA.fire('loading.hide')
  }
  var code = response.data.result == 0 ? '0' : (response.data.result || '')
  if (code && code != 1 && !response.config.ignoreCode) {
    switch (code) {
      case 999:
        window.EMA.fire('alert.show', '认证失败,重新登录', function () {
          window.EMA.fire('logout')
        })
        break
      default:
        window.EMA.fire('alert.show', response.data.msg || response.data.errorMsg, function () {})
    }
    return Promise.reject(response)
  } else {
    return response
  }
}, function (error) {
  window.EMA.fire('loading.hide')
  var status = error.response && error.response.status
  var message = error.message
  if (status != 200) {
    if (status == 401) {
      window.EMA.fire('alert.show', '认证失败,重新登录', function () {
        window.EMA.fire('logout')
      })
    } else if (status == 403) {
      ;(document.querySelector('body > .editorWarp') || {}).innerHTML = ''
      window.EMA.fire('alert.show', '你无权限访问该内容,请联系相关人员分配权限', function () {
        window.onbeforeunload = null
        window.onunload = null
        history.go(-1)
      })
    } else {
      window.EMA.fire('alert.show', message, function () {})
    }
  }
  return Promise.reject(error)
})

export default instance
