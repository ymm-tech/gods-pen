Date.prototype.Format = function (fmt) { // author: meizz
  var o = {
    'M+': this.getMonth() + 1,                 // 月份
    'd+': this.getDate(),                    // 日
    'h+': this.getHours(),                   // 小时
    'm+': this.getMinutes(),                 // 分
    's+': this.getSeconds(),                 // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds()             // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

export default {
  datetime: function (value, format) {
    if (!value) return ''
    return (new Date(+value)).Format(format || 'yyyy-MM-dd hh:mm')
  },
  moneyFormat: function (value, decimal) {
    value = value / 100 // 转换为元
    decimal = decimal || 2
    return isNaN(value) ? 0 : +(value.toFixed(decimal))
  },
  strSplit: function (str, interval, split) {
    split = split || ' '
    str = str.replace(/\s+/g, '')
    interval = toString.call(interval) == toString.call([]) ? interval : [Number(interval)]
    var strArr = []
    var reg
    while (1) {
      if (interval && interval.length) {
        reg = new RegExp(`(\\w{${interval.shift()}}(?!(?:\\s|$)))(.*)`)
      }
      var items = str.match(reg)
      if (!items) {
        strArr.push(str)
        break
      }
      strArr.push(items[1])
      str = items[2]
    }
    return strArr.join(split)
  },
  replace: function (value, pattern, target) {
    return (value || '').replace(pattern, target)
  },
  ossImgCrop: function (src = '', width) {
    return String(src).replace('//image.ymm56.com', '//imagecdn.ymm56.com') + `?x-oss-process=image/resize,w_${width}`
  }
}
