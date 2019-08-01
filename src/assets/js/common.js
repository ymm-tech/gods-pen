function parseURL (url) {
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

function objectSetByPath (obj = {}, path = '', val) {
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

function objectGetByPath (obj = {}, path = '') {
  var val
  try {
    val = path.split('.').reduce((a, b) => a && a[b], obj)
  } catch (e) {
    console.error(e)
  }
  return val
}

function modifyNodeId (tree, idCache = [], exclude = [], key = 'id', childKey = 'child') {
  var localIdCache = []

  function random (node) {
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

  function isInclude (arr, el) {
    return arr.indexOf(el) > -1
  }

  function genKey (base) {
    var key
    while (!(key && !isInclude(localIdCache, key))) {
      key = `${base || ''}${(Math.random() * 1296 | 0).toString(32)}` // 两位32进制数
    }
    return key
  }
  return random(tree)
}

function dimensionAnyTopx (el, parent) {
  if (!el || !parent) {
    return {
      width: 0,
      height: 0,
      left: 0,
      top: 0
    }
  }
  var elPosition = el.style.position || window.getComputedStyle(el).position
  var margins = getMargins(el)
  var isRoot = parent.getAttribute('id') == 'appWarp'
  if (isRoot || elPosition === 'fixed') parent = document.getElementById('stage')
  var [parentRect, rect] = [parent, el].map(el => el.getBoundingClientRect())
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
      dimension.left = rect.left - parentRect.left - margins.marginLeft 
      dimension.top = rect.top - parentRect.top - margins.marginTop
      break
    case 'fixed':
      dimension.left = rect.left - parentRect.left - margins.marginLeft 
      dimension.top = rect.top - parentRect.top - margins.marginTop  
      if (!isUnset(el.style.right)) {
        dimension.right = parentRect.right - rect.right - margins.marginRight
        dimension.left = null
        dimension.rightControl = true
      }
      if (!isUnset(el.style.bottom)) {
        dimension.bottom = parentRect.bottom - rect.bottom - margins.marginBottom
        dimension.top = null
        dimension.bottomControl = true
      }
      break
  }
  return dimension
}

function isUnset (val) {
  return val === 'unset' || val === 'initial' || isNaN(parseFloat(val)) || isNullOrUndefined(val)
}

function calcRelativePos (el, parent) {
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

  function toPx (val, bounding) {
    bounding = parseInt(bounding)
    if (val == 'auto' || !val) return 0
    if (/%$/.test(val)) return (bounding * parseFloat(val) / 100) | 0
    return parseInt(val)
  }
}

function getMargins (el) {
  return ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].reduce((o, v) => {
    var val = window.getComputedStyle(el)[v]
    o[v] = parseFloat(val) || 0
    return o
  }, {})
}

function isNullOrUndefined (arg) {
  return arg === null || arg === undefined
}

function isFalsy (arg) {
  return isNullOrUndefined(arg) || arg === ''
}

function toSafeNumber (a, e = Number.MAX_VALUE) {
  return a === 0 || a === '0' ? 0 : !a || isNaN(Number(a)) ? e : Number(a)
}

function sleep (ts) {
  return new Promise(resolve => setTimeout(resolve, ts))
}

function fetch (url, {method='get'} = {}) {
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
  fetch
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
  fetch
}
