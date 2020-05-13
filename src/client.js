import Vue from 'vue'
import App from './Client.vue'
import VueRouter from 'vue-router'
import FastClick from 'FastClick'
import './assets/js/date'
import routes from './extend/RouterMap'
import ESlog from './extend/ESlog'
import clientlib from './extend/client/'
import {fetch} from './extend/fetch'
import Util from './extend/Util'
let config = require('./config/index')

window.Truck = window.$GP = {
  Util,
  ESlog,
  Env: {},
  Native: {},
  Server: {fetch},
}
window.Truck.Maliang = clientlib
window.$GP.VueExtend = clientlib
window.Vue = Vue
/**
 * 定义编辑配置属性的混合策略
 */
var strategies = Vue.config.optionMergeStrategies
strategies.editorMethods = strategies.methods
strategies.editerMethods = strategies.methods
Vue.use(VueRouter)
FastClick.attach(document.body, {})

const router = new VueRouter(routes)

const app = window.app = new Vue({ // eslint-disable-line
  router,
  render: h => h(App)
})

function startApp () {
  if (startApp.started) return
  startApp.started = true
  mount()

  function mount () {
    Object.defineProperty(window, 'EventHub', {
      get () { return window.app }
    })
    app.$mount('#app')
    window.addEventListener('pagehide', trackPVTime)
    sendPVTime()
    window.trackPVTime = trackPVTime
  }
}
startApp()

function trackPVTime (from) {
  if (trackPVTime.called) return
  console.log(from)
  var end = Date.now()
  var start = window.loadingStartTime
  var route = window.location.pathname.match(new RegExp(`(?:/${config.VIEW_NAME || 'view'})?/(\\w+)`))
  if (route && route[1]) {
    window.localStorage.setItem('ML_VIEW_TIME', route[1] + '|' + ((end - start) / 1000 | 0))
  }
  trackPVTime.called = 1
}

function sendPVTime () {
  if (process.env.NODE_ENV !== 'production') return
  var ML_VIEW_TIME = (window.localStorage.getItem('ML_VIEW_TIME') || '').split('|')
  if (ML_VIEW_TIME && ML_VIEW_TIME.length == 2) {
    ESlog.track({
      app_id: 'tview',
      page_id: ML_VIEW_TIME[0],
      action: 'PV_TIME',
      duration: +ML_VIEW_TIME[1] || 0,
    }, 'no-fp')
  }
}
