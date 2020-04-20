<template>
  <div class="ui-dock-main" @mouseup="mouseup($event)" @mousemove="mousemove($event)">
    <!-- <div class="mask"></div> -->
    <main-dock :info="info.layout" :level="10"></main-dock>
    <dialogone v-for="(item, key) in info.dialogs" :key="(item.component || 'main') + key" :info="item">
      <main-dock v-if="item && item.children" :info="item" :level="11"></main-dock>
    </dialogone>
    <dialogone v-for="(item, key) in onedialogs" :key="item.component + key" :info="item"></dialogone>
    <div class="dock-mask dock" :style="maskStyle" v-if="showMask"></div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .ui-dock-main {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex: 1;

    .mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
    }

    .dock-mask {
      position: absolute;
      pointer-events: none;
      z-index: 999;
      box-sizing: border-box;
      background: rgba(0, 128, 255, 0.3);
      border-width: 2px;
      border-style: solid;
      border-color: rgb(0, 153, 255);
      border-image: initial;
    }
  }
</style>
<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import MainDock from './Main'
  import dialogone from './Dialog'
  import cloneDeep from 'lodash/cloneDeep'
  import {mapState} from 'vuex'

  export default {
    mixins: [BaseComponent],
    name: 'dock',
    components: {MainDock, dialogone},
    props: {
      info: {
        required: true,
        type: Object
      }
    },
    data: function () {
      return {
        showMask: false, // 显示拖动辅助定位层
        DragInfo: null, // 当前被拖动的元素信息
        DragDirection: '', // 释放元素的方向  top left right bottom
        boxSize: {},
        onedialogs: [], // 一次性弹出框，不会记录到缓存中。页面刷新就会丢掉
        maskStyle: {
          left: 0,
          width: 0,
          top: 0,
          right: 0
        }
      }
    },
    watch: {
      info: {
        deep: true,
        handler: function (newVal, old) {
          if (newVal !== old) {
            // 赋值操作 类型变化
          } else {
            this.saveLayout()
          }
        }
      }
    },
    computed: mapState({
      currentLayout: state => state.viewOption.currentLayout,
    }),
    mounted: function () {
      this.ema.bind('dock.dialogClose', (value) => {
        this.info.dialogs.splice(this.info.dialogs.indexOf(value), 1)
      })
      this.ema.bind('dock.dialogPush', (value) => {
        this.info.dialogs.push(value)
      })
      this.ema.bind('dock.onceDialogClose', (value) => {
        this.onedialogs.splice(this.onedialogs.indexOf(value), 1)
      })
      this.ema.bind('dock.onceDialogPush', (value) => {
        this.onedialogs.push(value)
      })
      this.ema.bind('dock.maskDragenter', (event, panel) => {
        this.dealMask(event, panel)
      })
      this.ema.bind('dock.panelTitleDragStart', (panel, data) => {
        this.DragInfo = {
          target: panel,
          data: data
        }
      })
      this.ema.bind('dock.maskDragleave', (event, panel) => {
        // this.showMask = false
      })
      // 拖动释放后页面容器相关制空
      this.ema.bind('dock.panelTitleDragEnd', (event, panel) => {
        this.showMask = false
        this.targetPanel = null
      })
      // 拖动释放后页面容器相关制空
      this.ema.bind('dock.panelTitleHeaderDrop', (event, panel) => {
        this.showMask = false
        this.targetPanel = null
      })
      this.ema.bind('dock.panelTitleDrop', (event, panel) => {
        if (this.showMask) {
          // movePanel
          this.movePanel()
        }
        this.showMask = false
        this.targetPanel = null
      })
      this.boxSize = this.$el.getBoundingClientRect()
    },
    methods: {
      movePanel: function () {
        // this.targetPanle 是目标元数
        if (this.targetPanel) {
          var parentPanelInfo = this.targetPanel.$parent.info
          var children = parentPanelInfo.children
          var DragInfo = this.DragInfo
          // 移除元素在原来的位置
          DragInfo.target.removeOne(DragInfo.data)
          // 新的目标元素上添加节点
          var newData = cloneDeep(DragInfo.data)
          var direction = 'row'
          if (children) {
            // 1: 判断新增元素和当前容器父元素容器排序是否一样  ,如果一样就插入元素，如果不一样。就分割当前元素
            // 判断排序
            if (this.DragDirection == 'top' || this.DragDirection == 'bottom') {
              direction = 'column' // 垂直
            } else {
              direction = 'row' // 水平
            }
            var index = children.indexOf(this.targetPanel.info)
            if (this.DragDirection == 'top' || this.DragDirection == 'left') {
              index -= 1
              if (index < 0) {
                index = 0
              }
            } else {
              index += 1
            }
            if (children.length == 1) {
              parentPanelInfo.type = direction
            } else {
            }
            if (this.targetPanel.info.type == 'panel') {
              let oldChild = [cloneDeep(this.targetPanel.info)]
              oldChild.splice(index, 0, {
                children: [{
                  children: [newData],
                  type: 'panel'
                }],
                flex: 0.5,
                type: 'column'
              })
              oldChild.forEach(element => {
                element.flex = 1 / oldChild.length
              })
              this.targetPanel.info.children = oldChild
              this.targetPanel.info.type = direction
              this.targetPanel.$parent.info.children.forEach(element => {
                element.flex = 1 / this.targetPanel.$parent.info.children.length
              })
            } else {
              children.splice(index, 0, {
                children: [{
                  children: [newData],
                  type: 'panel'
                }],
                flex: 0.5,
                type: 'column'
              })
              children.forEach(element => {
                element.flex = 1 / children.length
              })
            }
          }
        }
      },
      /**
       * 计算遮罩层位置信息
       */
      dealMask: function (ev, panel) {
        var dockBox = this.boxSize
        // 处理mask层级显示
        var className = ev.target.className.replace('mask ', '')
        var box = panel.$el.getBoundingClientRect()
        this.targetPanel = panel
        var panelType = panel.$parent.info.type
        if (panelType) {
          this.showMask = true
          if (className == 'left') {
            this.maskStyle = {
              left: box.left - dockBox.left + 'px',
              top: box.top - dockBox.top + 'px',
              width: box.width / 2 + 'px',
              height: box.height + 'px'
            }
          } else if (className == 'right') {
            this.maskStyle = {
              left: box.left + box.width / 2 - dockBox.left + 'px',
              top: box.top - dockBox.top + 'px',
              width: box.width / 2 + 'px',
              height: box.height + 'px'
            }
          } else if (className == 'top') {
            this.maskStyle = {
              top: box.top - dockBox.top + 'px',
              left: box.left - dockBox.left + 'px',
              width: box.width + 'px',
              height: box.height / 2 + 'px'
            }
          } else if (className == 'bottom') {
            this.maskStyle = {
              top: box.top + box.height / 2 - dockBox.top + 'px',
              left: box.left - dockBox.left + 'px',
              width: box.width + 'px',
              height: box.height / 2 + 'px'
            }
          } else if (className == 'header') {
            box = ev.target.getBoundingClientRect()
            this.maskStyle = {
              top: box.top - dockBox.top + 'px',
              left: box.left - dockBox.left + 'px',
              width: box.width + 'px',
              height: box.height + 'px'
            }
          }
          this.DragDirection = className
        }
      },
      /**
       * 保存自定义布局布局信息到本地缓存
       */
      saveLayout: function () {
        var me = this
        if (this.saveTimer) {
          clearTimeout(this.saveTimer)
        }
        this.saveTimer = setTimeout(() => {
          window.localStorage.setItem('dockLayout_save', JSON.stringify(me.info))
          this.$store.dispatch('setCurrentLayout', 'custom')
        }, 1000)
      },
      mouseup: function ($event) {
        this.ema.fire('dock-mouseup', $event)
      },
      mousemove: function ($event) {
        this.ema.fire('dock-mousemove', $event)
      }
    }
  }
</script>

