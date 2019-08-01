import ESlog from '../extend/ESlog'
import EMA from '../assets/js/singleton-ema'
import * as Common from '../assets/js/common.js'
import { mapState } from 'vuex'

function setPageTitle (title) {
  document.title = title
}

export default {
  props: ['params'],
  data: function () {
    return {}
  },
  computed: mapState({
    Config: state => state.Config,
    RootNodeInfo: state => state.RootNodeInfo,
    Metadata: state => state.Metadata
  }),
  beforeCreate: function () {
  },
  created: function () {
    this.ema = EMA.getProxy()
    this.Common = Common
  },
  beforeMount: function () {
  },
  mounted: function () {
  },
  activated: function () {
    var me = this
    if (this.$options.pageName) {
      setPageTitle(this.$options.pageName)
    }
    this.$store.dispatch('setCurrentPage', me.$options.name) // 记录页面信息
    if (process.env.NODE_ENV === 'production') {
      ESlog.pageview({
        app_id: 'tview',
        page_id: me.$route.params.pageKey
      })
    }
  },
  deactivated: function () {
    window.loading('hide')
  },
  beforeDestroy: function () {
  },
  destroyed: function () {
    if (this.ema) {
      this.ema.dispose()
    }
  },

  methods: {
    setPageTitle: setPageTitle,
    /**
     * 组件内部范围绑定事件
     * @param key
     * @param fn
     */
    bindEvent: function (key, fn) {
      if (!this.$options.name) {
        console.warn('绑定事件的组件不存在组件名称', key)
      }
      this.ema.bind(`${this.$options.name}.${key}`, fn)
    }
  }
}
