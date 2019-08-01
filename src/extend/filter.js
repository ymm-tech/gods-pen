import Vue from 'vue'
require('../assets/js/date')
/**
 * 时间格式化
 */
Vue.filter('datetime', function (value, format) {
  return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm')
})
/**
 * 充值时间格式化,value是以秒为单位
 */
Vue.filter('sdatetime', function (value, format) {
  var val = parseInt(value + '000')
  return (new Date(val)).Format(format || 'yyyy-MM-dd hh:mm')
})
/**
 * 时间格式化，显示年月日
 */
Vue.filter('fulldaytime', function (value, format) {
  return (new Date(value)).Format(format || 'yyyy-MM-dd')
})
/**
 * 时间格式化，只显示月日
 */
Vue.filter('daytime', function (value, format) {
  return (new Date(value)).Format(format || 'MM-dd')
})

/**
 * 金额格式化
 *  value 金额，以分为单位
 */
Vue.filter('moneyFormat', function (value, num) {
  value = value / 100 // 转换为元
  num = num || 2
  if (parseFloat(value) > 0) {
    var str = parseFloat(value).toFixed(num)
    str = str.split('.')
    var start = parseFloat(str[0]).toString()
    return (str[1] == '00') ? (start) : (start + '.' + (str[1] || ''))
  } else {
    return 0
  }
})
/**
 * 金额格式化（保存不同位小数）
 *  value 金额，以分为单位
 */
Vue.filter('moneyDecFormat', function (value) {
  value = parseFloat(value)
  if (isNaN(value)) {
    return ''
  }
  value = value / 100 // 转换为元
  if (value > 100) {
    value = value.toFixed(0)
    return value
  }
  if (value >= 1 && value <= 10) {
    value = value.toFixed(1)
    return value
  }
  if (value < 1) {
    value = value.toFixed(2)
    return value
  }
})

/**
 * 数值分割显示
 * @param：str 数值字符串
 * @param：num 分割长度
 */
Vue.filter('numSplit', function (str, num) {
  var reg = new RegExp(`(\\w{${num}}(?!(?:\\s|$)))`, 'g')
  return str.replace(/[^\d]+/g, '').replace(reg, function (m, p1) {
    return p1 + ' '
  })
})

/**
 * 数值分割显示 sync
 * @param：str 数值字符串
 * @param：num 分割长度
 */
Vue.filter('numSplitSync', {
  read: function (str, num) {
    var reg = new RegExp(`(\\w{${num}}(?!(?:\\s|$)))`, 'g')
    var newStr = str.replace(/[^\d]+/g, '').replace(reg, function (m, p1) {
      return p1 + ' '
    })
    return newStr
  },
  write: function (str, num) {
    return str.replace(/\s+/g, '')
  }
})

/**
 * 非法输入过滤 sync
 * @param：str 输入字符串
 * @param：reg 正则
 */
Vue.filter('strFilterSync', {
  read: function (str, reg) {
    if (reg && typeof reg === 'string') {
      reg = new RegExp(reg, 'g')
    }
    return str.replace(reg, '')
  },
  write: function (str, num) {
    return str
  }
})

/**
 * 加单位 如果为0，则为空
 */
Vue.filter('unitFormat', function (num, unit) {
  return num <= 0 || !num ? '' : num + unit
})

/**
 * 地名修剪
 */
Vue.filter('trimDest', function (dest, pattern) {
  pattern = new RegExp(pattern || '[省市区县]', 'g')
  return dest.replace(pattern, '')
})

/*
 ** reg replace helper
 **/

Vue.filter('regReplace', function (value, regStr, target) {
  var reg = new RegExp(regStr, 'g')
  return (value || '').replace(reg, target)
})

/*
 ** reg replace helper
 **/

Vue.filter('imageDefault', function (value) {
  value = value || 'http://fl5.gtimg.com/flpartition0/7088/631007088/564/3744770553906093122431120144653.png!t160x240.png'
  return value
})
