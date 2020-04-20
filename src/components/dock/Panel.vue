<template>
  <div @keydown="keydown($event)" @keyup="keydown($event)" tabindex="0" @click.capture="panelSelect($event)" class="ui-dock-panel" :class="{'showMask':showMask}" :style="{flex:info.flex||1,'z-index':level}">

    <el-tabs type="border-card" :class="{'active': active}" class="border-card" v-model="editableTabsValue">
      <el-tab-pane class="tab-panel" v-for="item in info.children" :key="item.component" :name="item.component">
        <span slot="label" class="tab-label" draggable="true" @dragstart="dragstart($event,item)" @dragend="dragend($event,item)">
        <i class="el-icon-date"></i> {{item.name}}</span>
        <component :active="editableTabsValue == item.component" v-if="item.component" :is="item.component"></component>
      </el-tab-pane>
    </el-tabs>
    <div class="control">
      <el-dropdown @command="dropClick" v-if="selectPanel" trigger="click">
        <i class="el-icon-menu btn"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :disabled="!selectPanel.close" command="close"><i v-show="!selectPanel.close" class="iconfont icon-disablenotallowed"></i> 关闭</el-dropdown-item>
          <el-dropdown-item :disabled="!selectPanel.pop" command="jump"><i v-show="!selectPanel.pop" class="iconfont icon-disablenotallowed"></i> 弹出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div v-if="showMask&&canDragIn" :style="{'z-index':level}" @dragover="dragover($event)" @drop="drop($event)" @dragleave='dragleave($event)' @dragenter='dragenter($event)' class="mask top"></div>
    <div v-if="showMask&&canDragIn" :style="{'z-index':level}" @dragover="dragover($event)" @drop="drop($event)" @dragleave='dragleave($event)' @dragenter='dragenter($event)' class="mask left"></div>
    <div v-if="showMask&&canDragIn" :style="{'z-index':level}" @dragover="dragover($event)" @drop="drop($event)" @dragleave='dragleave($event)' @dragenter='dragenter($event)' class="mask right"></div>
    <div v-if="showMask&&canDragIn" :style="{'z-index':level}" @dragover="dragover($event)" @drop="drop($event)" @dragleave='dragleave($event)' @dragenter='dragenter($event)' class="mask bottom"></div>
    <div v-if="showMask" :style="{'z-index':level}" @dragover="dragover($event)" @drop="dropHeader($event)" @dragleave='dragleave($event)' @dragenter='dragenter($event)' class="mask header"></div>
  </div>
</template>


<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  * {
    user-select: none;
  }
  .ui-dock-panel {
    max-width 100%
    max-height 100%
  }
  .ui-dock-panel:focus {
    outline: none;
  }

  .ui-dock-panel:focus .border-card {
  }

  .ui-dock-panel:focus .is-active .tab-label {
  }

  .ui-dock-panel {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    position: relative;
    box-sizing: border-box;
    contain: content;
    color: #bdbdbd;
    cursor: default;
    &.showMask {
      pointer-events: none;

      .mask {
        pointer-events: auto;
      }
    }

    .mask {
      position: absolute;
      width: 30%;
      height: 30%;
      margin: auto;

      &.header {
        background-color: rgba(255, 255, 255, 0);
        left: 0;
        right: 0;
        top: 0;
        width: 100%;
        height: 30px;
      }

      &.top {
        left: 0;
        right: 0;
        top: 0;
      }

      &.left {
        left: 0;
        bottom: 0;
        top: 0;
      }

      &.right {
        right: 0;
        bottom: 0;
        top: 0;
      }

      &.bottom {
        right: 0;
        left: 0;
        bottom: 0;
      }
    }

    .border-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
    }

    .control {
      position: absolute;
      right: 10px;
      top: 5px;
      color: #dddddd;
    }

    .tab-panel {
      height: 100%;
      > * {
        width 100%
      }
    }
  }
</style>
<style lang="css" rel="stylesheet/css" type="text/css">
  .ui-dock-panel .el-tabs__content {
    padding: 0px !important;
    flex: 1 0 0;
    overflow: auto;
  }
  .ui-dock-panel .el-tabs__item {
    line-height: 30px;
    height: 30px;
    padding: 0 10px;
  }

  .ui-dock-panel .widget {
    padding: 0px;
  }
  .ui-dock-panel > .el-tabs--border-card {
    border: none
  }

</style>
<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import cloneDeep from 'lodash/cloneDeep'
  import BasePanel from './BasePanel'

  export default {
    mixins: [BaseComponent, BasePanel],
    name: 'dockPanel',
    components: {},
    props: {
      info: {
        required: true,
        type: Object
      },
      level: {
        type: Number
      }
    },
    data: function () {
      return {
        active: false,
        isDraging: false,
        editableTabsValue: '',
        selectPanel: null
      }
    },
    watch: {
      editableTabsValue: function (newVal) {
        var $filtered = this.info.children.filter(element => element.component == newVal)
        this.selectPanel = $filtered && $filtered[0]
      },
      currentLayout (val) {
        setTimeout(this.activeFirst, 100)
      },
      activeIsValid (val) {
        if (!val) this.activeFirst()
      }
    },
    computed: {
      canDragIn: function (params) {
        return this.isDraging && this.info.children.length == 1
      },
      currentLayout () {
        return this.$store.state.viewOption.currentLayout
      },
      childrenComponent () {
        return this.info.children.map(v => v && v.component)
      },
      activeIsValid () {
        return this.childrenComponent.includes(this.editableTabsValue)
      }
    },
    mounted: function () {
      this.activeFirst()
      this.ema.bind('dock.panelUnActive', (value) => {
        this.active = false
      })
      this.ema.bind('dock.panelActive', (key) => {
        this.info.children.forEach((element) => {
          if (key == element.component) {
            this.editableTabsValue = key
          }
        })
      })
    },
    methods: {
      activeFirst () {
        var $first = this.info.children && this.info.children[0]
        this.editableTabsValue = $first.component
      },
      keydown: function (ev) {
        if (this.active) {
          ev.panelName = this.selectPanel.component
        }
      },
      panelSelect: function (ev) {
        this.active = true
      },
      dragend: function (ev) {
        this.isDraging = false
        this.ema.fire('dock.panelTitleDragEnd', ev)
      },
      dragstart: function (ev, menu) {
        this.isDraging = true
        ev.stopPropagation()
        ev.dataTransfer.effectAllowed = 'move'
        ev.dataTransfer.setDragImage(ev.target, ev.offsetX, ev.offsetY)
        this.ema.fire('dock.panelTitleDragStart', this, menu)
      },
      dropClick: function (params) {
        this[params]()
      },
      removeOne: function (params) {
        var value = params || this.info.children.find((element, key) => {
          if (element.component == this.editableTabsValue) {
            return true
          }
        })
        this.info.children.splice(this.info.children.indexOf(value), 1)
        if (this.info.children.length > 0) {
          this.editableTabsValue = this.info.children[0].component
        } else {
          this.$parent && this.$parent.removePanel && this.$parent.removePanel(this.info)
        }
        return value
      },
      jump: function (params) {
        var value = cloneDeep(this.removeOne())
        if (!value) return
        var box = this.$el.getBoundingClientRect()
        var baseStyle = {
          width: box.width + 'px',
          height: box.height + 'px',
          left: '100px',
          top: '100px',
        }
        value.style = Object.assign(baseStyle, value.style || {})
        this.ema.fire('dock.dialogPush', value)
      },
      close: function () {
        this.removeOne()
      },
      dropHeader: function (ev) {
        var hasSame = this.info.children.find((element, key) => {
          if (element.component == this.dragInfo.component) {
            return true
          }
        })
        if (!hasSame) {
          this.info.children.push(cloneDeep(this.dragInfo))
          this.dragPanel.removeOne(this.dragInfo)
          this.editableTabsValue = this.dragInfo.component
        }
        this.ema.fire('dock.panelTitleHeaderDrop', ev)
        // 处理元素的添加移除等逻辑
        this.showMask = false
      }
    }
  }
</script>

