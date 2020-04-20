import Vue from 'vue'

function parseURL(url) {
  var a = window.document.createElement('a')
  a.href = url
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function () {
      var ret = {}
      var seg = a.search.replace(/^\?/, '').split('&')
      var len = seg.length
      var i = 0
      var s
      for (; i < len; i++) {
        if (!seg[i]) {
          continue
        }
        s = seg[i].split('=')
        ret[s[0]] = s[1]
      }
      return ret
    })(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^\/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/')
  }
}

function objectSetByPath(obj = {}, path = '', val) {
  path = path.split('.')
  let key = path.pop()
  let preObj = obj
  try {
    preObj = path.reduce((a, b) => {
      if (!(a && typeof a === 'object')) a = {}
      if (!(a[b] && typeof a[b] === 'object')) a[b] = {}
      return a[b]
    }, obj)
  } catch (e) {
    console.error(e)
  }
  preObj[key] = val
  return obj
}

function objectGetByPath(obj = {}, path = '') {
  var val
  try {
    val = path.split('.').reduce((a, b) => a && a[b], obj)
  } catch (e) {
    console.error(e)
  }
  return val
}

function modifyNodeId(tree, idCache = [], exclude = [], key = 'id', childKey = 'child') {
  var localIdCache = []

  function random(node) {
    var child = node[childKey]
    if (child && child.length) {
      child = child.map(child => random(child))
    }
    // 空 || 处于全局id池 && 不处于豁免范围 || 处于本地id池 随机生成一个
    if (!node[key] || isInclude(idCache, node[key]) && !isInclude(exclude, node[key]) || isInclude(localIdCache, node[key])) {
      node[key] = genKey(node[key])
      localIdCache.push(node[key])
    }
    return node
  }

  function isInclude(arr, el) {
    return arr.indexOf(el) > -1
  }

  function genKey(base) {
    var key
    while (!(key && !isInclude(localIdCache, key))) {
      key = `${base || ''}${(Math.random() * 1296 | 0).toString(36).padStart(2, '0')}` // 两位36进制数
    }
    return key
  }
  return random(tree)
}

/**
 * 获取Dom节点相对于页面的位置 TOP LEFT
 * @param {DOM}} node 
 */
function getNodePosition(node) {
  var pos = node.getBoundingClientRect()
  //变换简单处理，计算一个元素在旋转之前相对根节点的top left
  var centerPoint = {
    x: pos.left + pos.width / 2,
    y: pos.top + pos.height / 2
  }
  return {
    top: centerPoint.y - node.offsetHeight / 2,
    left: centerPoint.x - node.offsetWidth / 2,
  }
}
/**
 * 获取一个元素在忽略旋转后的相对页面的位置信息
 * @param {DOM}} el 
 */
function getNoRotateBoundingClientRect(el) {
  let innerWidth = window.innerWidth
  let innerHeight = window.innerHeight
  let topAndLeft = getNodePosition(el)
  var margins = getMargins(el)
  if (el.id == 'stage') {
    margins = {
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0
    }
  }
  var pos = {
    bottom: innerHeight - el.offsetHeight - topAndLeft.top - margins.marginBottom,
    height: el.offsetHeight,
    left: topAndLeft.left - margins.marginLeft,
    right: innerWidth - topAndLeft.left - el.offsetWidth - margins.marginRight,
    top: topAndLeft.top - margins.marginTop,
    width: el.offsetWidth,
    x: topAndLeft.left,
    y: topAndLeft.top
  }
  return pos
}

/**
 * 获取一个元素相对父元素的定位信息。如果该元素是fixed定位。获取的就是相对舞台的定位信息
 * @param {DOM} el 
 * @param {DOM} parent 
 */
function dimensionAnyTopx(el, parent) {
  if (!el || !parent) {
    return {
      width: 0,
      height: 0,
      left: 0,
      top: 0
    }
  }
  // 若此节点发生选择 会导致通过 getBoundingClientRect 获取的值发生变化  致使旋转后点击变大
  // issue: https://github.com/ymm-tech/gods-pen/issues/18
  var elPosition = el.style.position || window.getComputedStyle(el).position
  var isRoot = parent.getAttribute('id') == 'appWarp'
  if (isRoot || elPosition === 'fixed') parent = document.getElementById('stage')
  var [parentRect, rect] = [parent, el].map(el => getNoRotateBoundingClientRect(el))
  console.log(parentRect, rect)
  var dimension = {
    left: null,
    top: null,
    width: rect.width,
    height: rect.height,
    rect: rect,
    parentRect,
    bottom: null,
    right: null,
  }
  switch (elPosition) {
    case 'relative':
      var pos = calcRelativePos(el, parent)
      dimension.left = pos.left
      dimension.top = pos.top
      break
    case 'absolute':
      dimension.left = rect.left - parentRect.left
      dimension.top = rect.top - parentRect.top
      break
    case 'fixed':
      dimension.left = rect.left - parentRect.left
      dimension.top = rect.top - parentRect.top
      dimension.right = rect.right - parentRect.right
      dimension.bottom = rect.bottom - parentRect.bottom

      if (!isUnset(el.style.right)) {
        dimension.rightControl = true
      }
      if (!isUnset(el.style.bottom)) {
        dimension.bottomControl = true
      }
      break
  }
  console.log(dimension)
  return dimension
}

function isUnset(val) {
  return val === 'unset' || val === 'initial' || isNaN(parseFloat(val)) || isNullOrUndefined(val)
}

function calcRelativePos(el, parent) {
  var style = window.getComputedStyle(el)
  var parentSize = parent.getBoundingClientRect()
  var pos = {
    left: toPx(style.left, parentSize.width),
    bottom: toPx(style.bottom, parentSize.height),
    right: toPx(style.right, parentSize.width),
    top: toPx(style.top, parentSize.height)
  }
  if (!pos.top) {
    pos.top = -(parseInt(pos.bottom) || 0)
  }
  if (pos.left) {
    pos.left = -(parseInt(pos.right) || 0)
  }
  return pos

  function toPx(val, bounding) {
    bounding = parseInt(bounding)
    if (val == 'auto' || !val) return 0
    if (/%$/.test(val)) return (bounding * parseFloat(val) / 100) | 0
    return parseInt(val)
  }
}

function getMargins(el) {
  return ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].reduce((o, v) => {
    var val = window.getComputedStyle(el)[v]
    o[v] = parseFloat(val) || 0
    return o
  }, {})
}

function isNullOrUndefined(arg) {
  return arg === null || arg === undefined
}

function isFalsy(arg) {
  return isNullOrUndefined(arg) || arg === ''
}

function toSafeNumber(a, e = Number.MAX_VALUE) {
  return a === 0 || a === '0' ? 0 : !a || isNaN(Number(a)) ? e : Number(a)
}

function sleep(ts) {
  return new Promise(resolve => setTimeout(resolve, ts))
}

function fetch(url, {
  method = 'get'
} = {}) {
  return new Promise((resolve, reject) => {
    var req = new XMLHttpRequest()
    req.onload = () => {
      var json = req.response
      try {
        json = JSON.parse(req.response)
      } catch (e) {
        console.log(e)
      }
      resolve(json)
    }
    req.onerror = reject
    req.onabort = reject
    req.open(method, url)
    req.send()
  })
}

function componentAddJudge(node, nodevm) {
  if (!node) return false
  if (node.leaf) {
    return {
      can: false,
      msg: '不能为当前选中节点添加子组件'
    }
  }

  if (node.childLimit && node.child && node.child.length >= node.childLimit) {
    return {
      can: false,
      msg: `当前选中节点最多可添加${node.childLimit}个子组件，已达限额`
    }
  }
  
  if (nodevm.packed || nodevm.packedChild) {
    return {
      can: false,
      msg: '组件已封装，无法向其添加子组件'
    }
  }

  return {
    can: true
  }
}

function confirmWithGoodbye (msg, goodbyeKey) {
  goodbyeKey = `goodbye_${goodbyeKey}`
  if (window.localStorage.getItem(goodbyeKey) == 1) return Promise.resolve('confirm')
  return Vue.prototype.$confirm(`${msg}
    <div style='position: absolute;left: 14px;bottom: 0;transform: translateY(42px);font-size: 12px;'>
      不再提醒 <input type="checkbox" onchange="javascript: var val = event.target.checked; localStorage.setItem('${goodbyeKey}', val ? 1 : '')"/>
    </div>`,
  {dangerouslyUseHTMLString: true})
}

function trbl (str = '', key = '') {
  key = key === '' ? key : key + '-'
  const arr = String(str).trim().split(/\s+/)
  const [top, right, bottom, left] = arr.concat({1:[arr[0], arr[0], arr[0]], 2: [arr[0], arr[1]], 3: [arr[1]], 4: []}[arr.length] || [])
  return {
    [key + 'top']: top,
    [key + 'right']: right,
    [key + 'bottom']: bottom,
    [key + 'left']: left
  }
}

export {
  parseURL,
  dimensionAnyTopx,
  objectSetByPath,
  objectGetByPath,
  isNullOrUndefined,
  isFalsy,
  isUnset,
  sleep,
  modifyNodeId,
  toSafeNumber,
  getNoRotateBoundingClientRect,
  fetch,
  componentAddJudge,
  confirmWithGoodbye,
  trbl
}

export default {
  parseURL,
  isFalsy,
  isUnset,
  sleep,
  isNullOrUndefined,
  dimensionAnyTopx,
  objectSetByPath,
  objectGetByPath,
  modifyNodeId,
  toSafeNumber,
  getNoRotateBoundingClientRect,
  fetch,
  componentAddJudge,
  confirmWithGoodbye,
  trbl
}