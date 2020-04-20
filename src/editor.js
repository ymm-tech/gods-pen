import Vue from 'vue'
import Editor from './Editor.vue'
import EMA from './assets/js/singleton-ema'
import ElementUI from 'element-ui'
import './assets/style/element-variables.scss'
import store from './store'
import * as monaco from 'monaco-editor'
import vuelint from './assets/js/vuelint'
import AttrComponent from './components/attr'
import Widget from './components/widget'
import clientlib from './extend/client/'
import {fetch} from './extend/fetch'
import Util from './extend/Util'

function empty () {}

if (process.env.NODE_ENV === 'development') {
  window.Vue = Vue
}

window.Truck = window.$GP = {
  Util,
  ESlog: {pageview: empty, track: empty, getFingerPrint: empty},
  Maliang: clientlib,
  Env: {},
  Native: {},
  Server: {fetch},
}
window.Truck.Maliang = clientlib
window.$GP.VueExtend = clientlib
window.Vue = Vue
Vue.use(ElementUI)
Vue.use(Widget)
Vue.use(AttrComponent)

// 集中添加追踪
Vue.prototype.$reactiveSet = function (context, map) {
  for (let [key, val] of Object.entries(map)) {
    this.$set(context, key, val)
  }
}
// 集中移除追踪
Vue.prototype.$reactiveDelete = function reactiveDelete (context, keys) {
  for (let key of keys) {
    this.$delete(context, key)
  }
}

// 将 API 安装到 Vue，并且检查版本的兼容性
window.resourceEndTime = new Date() - 0
window.EMA = EMA
/**
 * 定义编辑配置属性的混合策略
 */
var strategies = Vue.config.optionMergeStrategies
strategies.editorMethods = strategies.methods
strategies.editerMethods = strategies.methods

const editor = new Vue({ // eslint-disable-line
  store: store,
  render: h => h(Editor)
})

editor.$mount('#app')

window.onbeforeunload = function () {
  var warning = '确认退出?'
  return warning
}
window.onunload = function () {}
// 脚本编辑器配置自动提醒
monaco.languages.registerCompletionItemProvider('javascript', {
  provideCompletionItems: () => {
    return vuelint || []
  }
})
// 本地存储清理
;(function clearStorage () {
  const storageKeys = Object.keys(localStorage).filter(k => /EditorautoSave/.test(k))
  const maxsize = 10
  const kyesToClear = storageKeys.length > maxsize ? storageKeys.slice(maxsize - storageKeys.length) : []
  for (let key of kyesToClear) {
    localStorage.removeItem(key)
  }
}())
