import filters from './filters'

const mixin = {
  props: [],
  data: function () {
    return {
      inscope: null
    }
  },
  computed: {
    scope() {
      let data = this.inscope && this.inscope.data ? this.inscope.data : this.inscope
      return data
    }
  },
  filters,
  methods: {
    // 函数调用
    oncallExecute: function (params, args = []) {
      if (!params) return
      if (typeof params === 'function') {
        params = [{
          method: params,
          params: args
        }]
        params.forEach(element => {
          element = element || {}
          // 分割字符串参数为数组
          let name = element.method
          let data = [...element.params, ...args]
          if (typeof this[name] === 'function') {
            this[name].apply(this, data)
          }
        })
      } else {
        params.forEach(element => {
          element = element || {}
          // 分割字符串参数为数组 方法可能是  truck/imagehq.jump 这个样式
          if (element.method) {
            let info = element.method.split('.')
            let target = this
            let name = ''
            if (info.length == 1) {
              name = info[0]
            } else if (info.length == 2) {
              target = this.$parent.getComponent(info[0], true)
              name = info[1]
            }
            var data = [...element.params, ...args]
            if (typeof target[name] === 'function') {
              target[name].apply(target, data)
            }
          }
        })
      }
    },
    /**
     * 属性解析
     * 从datahub或者父组件传入数据获取数据
     */
    scopeGet: function (prop) {
      let text = this[prop] || ''
      // 编辑环境
      if (window.EDIT_TYPE == 'EDITOR') {
        return this[prop] || this.$options.props[prop]['default']
      }
      // 预览/运行环境
      // 占位编译
      if (typeof text === 'string') {
        text = text.replace(/\$\{([^{}]+)\}/g, (m, p) => {
          p = p.replace(/\s+/g, '').split('|')
          var val = p[0]
          var filters = p.slice(1)
          var isValue = true // 是否是值（非表达式）
          // 值
          try {
            val = eval(p[0])
            isValue = true
          } catch (e) {
            val = p[0]
            isValue = false
          }
          // 非值
          if (!isValue) {
            if (/^\$scope\./.test(val)) {
              // 由父节点传入数据 如列表容器
              val = (this.scope && baseGet(this.scope, val)) || ''
            } else {
              // 由数据总线获取数据
              val = this.dataHubGet && this.dataHubGet(val) || ''
            }
          }
          // 过滤器
          if (filters && filters.length) {
            val = filters.reduce((a, b) => {
              return evalFilter(b, a, this)
            }, val)
          }
          return val
        })
      }

      // 计算值 || 默认值
      return text || this.$options.props[prop]['default']

      function baseGet(target = {}, path = '') {
        path = String(path).trim().replace(/^\$scope\./, '')
        var val
        try {
          val = path.split('.').reduce((a, b) => a && a[b], target)
        } catch (e) {
          console.error(e)
        }
        return val
      }

      function evalFilter(fnstr, val, context) {
        var parms = fnstr.match(/^([_$0-9A-Za-z]+)\(([^()]+)\)$/) || ['', fnstr]
        var fn = parms[1]
        var args = [val]
        try {
          args = args.concat(eval(`[${parms[2]}]`))
        } catch (e) {
          console.log(e)
        }
        var filterFn = context.$options.filters && context.$options.filters[fn]
        if (typeof filterFn == 'function') {
          return filterFn.apply(context, args)
        }
        return fnstr
      }
    },
  }
}

if (window.EDIT_TYPE === undefined || window.EDIT_TYPE === null) {
  var services = {
    $toast: function () {
      window.toast && window.toast.apply(window, arguments)
    },
    $confirm: function () {
      window.confirm && window.confirm.apply(window, arguments)
    },
    $alert: function () {
      window.alert && window.alert.apply(window, arguments)
    },
    $msgBox: function () {
      window.msgBox && window.msgBox.apply(window, arguments)
    },
    $prompt: function () {
      window.prompt && window.prompt.apply(window, arguments)
    },
    $loading: function () {
      window.loading && window.loading()
    },
    $hideLoading: function () {
      window.hideLoading ? window.hideLoading() : window.loading && window.loading(1)
    },
    $viewImg: function () {
      window.viewImg && window.viewImg.apply(window, arguments)
    }
  }
  Object.assign(mixin.methods, services)
}

export default mixin
