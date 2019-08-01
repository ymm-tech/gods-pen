import EMA from '../assets/js/singleton-ema'
import { mapState } from 'vuex'

export default {
  props: [],
  data: function () {
    return {}
  },
  created: function () {
    this.ema = EMA.getProxy()
  },
  computed: mapState({
    Config: state => state.Config,
    Setting: state => state.setting,
    RootNodeInfo: state => state.RootNodeInfo,
    Metadata: state => state.Metadata,
    App: state => state.app,
    demoMode: state => state.setting.demoMode
  }),
  mounted: function () {},
  destroyed: function () {
    if (this.ema) {
      this.ema.dispose()
    }
  },
  methods: {
    bindEvent: function (key, fn) {
      if (!this.$options.name) {
        console.warn('绑定事件的组件不存在组件名称', key)
      }
      this.ema.bind(`${this.$options.name}.${key}`, fn)
    },
    openDialog: function (data) {
      this.ema.fire('Dialogs.push', data)
    }
  }
}
