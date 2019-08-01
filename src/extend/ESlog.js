import { getFingerPrint } from './Util'

let config = require('../config/index')
let ES_LOG_URL = `${config.API_PATH}statistics/report?`

async function track ({action, app_id, page_id, label}, noFingerprint) { // eslint-disable-line
  var arg = arguments[0] || {}
  if (!arg || typeof arg !== 'object') return
  // if (!track.img) track.img = new Image()
  var server = new Image()
  if (!noFingerprint) {
    try {
      arg.finger_print = await getFingerPrint().then((res) => {
        console.log(res)
        return res
      })
    } catch (e) {
      arg.finger_print = 'unknown'
      console.warn(e)
    }
  }
  server.src = ES_LOG_URL + serializeParmas(arg) // 除argements列出字段外，可传入自定义字段
}

function serializeParmas(obj) {
  obj._t = Date.now() // 时间戳防止缓存
  return Object.keys(obj).map(k => `${k}=${encodeURIComponent(obj[k])}`).join('&')
}

function pageview ({app_id, page_id, label}) {  // eslint-disable-line
  var arg = arguments[0]
  if (!arg || typeof arg !== 'object') return
  track(Object.assign(arg, {action: 'pageview'}))
}

export default {
  pageview,
  getFingerPrint,
  track
}

export {
  pageview,
  track,
  getFingerPrint,
}
