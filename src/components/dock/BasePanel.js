export default {
  name: 'node',
  data: function (params) {
    return {
      showMask: false,
      dragPanel: null
    }
  },
  watch: {},
  mounted: function () {
    // panel 标题开始拖动事件处理
    this.ema.bind('dock.panelTitleDragStart', (target, info) => {
      this.showMask = true
      this.dragPanel = target
      this.dragInfo = info
    })
    // 标题拖动完成事件处理
    this.ema.bind('dock.panelTitleDragEnd', (value) => {
      this.showMask = false
    })
  },
  methods: {
    dragover: function (ev) {
      ev.stopPropagation()
      ev.preventDefault()
    },
    dragleave: function (ev) {
      ev.stopPropagation()
      ev.preventDefault()
      this.ema.fire('dock.maskDragleave')
    },
    dragenter: function (ev) {
      ev.stopPropagation()
      this.ema.fire('dock.maskDragenter', ev, this)
    },
    drop: function (ev) {
      ev.stopPropagation()
      ev.preventDefault()
      this.ema.fire('dock.panelTitleDrop', ev)
      // 处理元素的添加移除等逻辑
      this.showMask = false
    }
  }
}
