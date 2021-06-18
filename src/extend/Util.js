import {modifyNodeId} from '../assets/js/common'
import {loadCSS} from '../assets/js/loadCSS'
import Server from './Server'
import htmlToCanvas from 'html2canvas'
let config = require('../config/index')

function html2canvas (dom, data) {
  data = Object.assign({
    // allowTaint: true,
    // useCORS: false,
    proxy: `${config.API_PATH}cors-proxy`
  }, data)
  return htmlToCanvas(dom, data)
}

function removeAttr (data) {
  function walkall (data) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (/^__/g.test(key)) {
          delete data[key]
        }
        if (data.child) {
          data.child.forEach(element => {
            walkall(element)
          })
        }
      }
    }
  }
  walkall(data)
}

function loadJs (url = '') {
  if (!url) return
  if (!loadJs.cache) loadJs.cache = {}
  if (loadJs.cache[url]) return Promise.resolve()
  return new Promise((resolve, reject) => {
    _loadjs(
      url,
      () => {
        loadJs.cache[url] = 'cached'
        resolve()
      },
      () => {
        console.error(`${url} 加载失败`)
        reject(new Error(`${url} 加载失败`))
      }
    )
  })

  function _loadjs (url, fn, fail) {
    var script = document.createElement('script')
    script.src = url
    script.async = true
    script.onload = fn
    script.onerror = fail
    ;(document.body || document.head).appendChild(script)
  }
}

function loadCss (url = '') {
  if (!url) return
  if (!loadCss.cache) loadCss.cache = {}

  if (loadCss.cache[url]) return Promise.resolve()

  return new Promise((resolve) => {
    var stylesheet = loadCSS(url)

    onloadCSS(stylesheet, () => {
      loadCss.cache[url] = 'cached'
      resolve()
    })
  })

  // https://github.com/filamentgroup/loadCSS/blob/master/src/onloadCSS.js
  function onloadCSS (ss, callback) {
    var called
    function newcb() {
        if (!called && callback) {
          called = true
          callback.call(ss)
        }
    }
    if (ss.addEventListener) {
      ss.addEventListener('load', newcb)
    }
    if (ss.attachEvent) {
      ss.attachEvent('onload', newcb)
    }
    // This code is for browsers that don’t support onload
    // No support for onload (it'll bind but never fire):
    // * Android 4.3 (Samsung Galaxy S4, Browserstack)
    // * Android 4.2 Browser (Samsung Galaxy SIII Mini GT-I8200L)
    // * Android 2.3 (Pantech Burst P9070)
    // Weak inference targets Android < 4.4
     if ('isApplicationInstalled' in navigator && 'onloadcssdefined' in ss) {
      ss.onloadcssdefined(newcb)
    }
  }
}

function getBaseNode (node) {
  if (!node.id) return
  useComponent(node.id)
  var info = {
    id: node.name,
    type: node.name,
    label: node.label,
    version: node.version,
    url: node.path,
    visible: true,
    style: {},
    animate: [],
    props: {},
    path: node.path,
    script: ''
  }
  if (node.style) {
    info.style = Object.assign({
      position: 'absolute',
      width: '80px',
      height: '80px',
      left: '0px',
      top: '0px'
    }, node.style)
  }
  var idCache = Object.keys(window.$_nodecomponents || {}).concat([node.name])
  info = modifyNodeId(info, idCache)
  if (info.label) info.label = info.id.replace(node.id, info.label) // 给label添加id
  return info
}

function useComponent (id) {
  Server({
    url: 'component/useone',
    method: 'post', // default
    needLoading: false,
    data: {
      id: id,
    }
  })
  .then(() => true)
  .catch(console.log)
}

function getNumber (style) {
  style = style || '0'
  var arr = style.match(/^[-0-9.]+/)
  if (arr) {
    return arr[0] - 0
  } else {
    return 0
  }
}

function getBlobBydataURI (dataURI, type) {
  var binary = window.atob(dataURI.split(',')[1])
  var array = []
  for (let i = 0, leng = binary.length; i < leng; i++) {
    array.push(binary.charCodeAt(i))
  }
  let blob = new window.Blob([new Uint8Array(array)], {
    type: type
  })
  return blob
}

function readAsDataURL (file, callback) {
  const reader = new window.FileReader()
  reader.readAsDataURL(file)
  reader.onload = function (e) {
    callback && callback(this.result)
  }
}

var FINGER_PRINT_URL = 'https://cdn.staticfile.org/fingerprintjs2/1.8.0/fingerprint2.min.js'
var STORAGE_KEY = 'YMMFP'

function getFingerPrint () {
  if (!getFingerPrint.promise) {
    getFingerPrint.promise = new Promise((resolve) => {
      var fingerPrint = localStorage.getItem(STORAGE_KEY)
      if (fingerPrint) return resolve(fingerPrint)
      loadJs(FINGER_PRINT_URL).then(() => {
        if (!window.Fingerprint2) resolve('unknown')
        window.Fingerprint2 && new window.Fingerprint2().get((res) => {
          localStorage.setItem(STORAGE_KEY, res)
          resolve(res)
        })
      })
    })
  }
  return getFingerPrint.promise
}

export default {
  html2canvas,
  removeAttr,
  loadJs,
  loadCss,
  getBaseNode,
  useComponent,
  getNumber,
  getBlobBydataURI,
  readAsDataURL,
  getFingerPrint
}

export {
  html2canvas,
  removeAttr,
  loadJs,
  loadCss,
  getBaseNode,
  useComponent,
  getNumber,
  getBlobBydataURI,
  readAsDataURL,
  getFingerPrint
}
