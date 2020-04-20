<template>
  <div class="ui-dock" :class="[info.type,showMask?'showMask':'']" :style="{flex:info.flex||1,'z-index':level}">
    <template v-for="(item,key) in info.children">
      <panel v-if="item.type=='panel'" :key="'panel' + key" :info="item" :level="level+1"></panel>
      <dock-main v-else :key="'main' + key" :info="item" :level="level+1"></dock-main>
      <resizer v-if="key!=info.children.length-1" :key="'resize' + key" :type="info.type" :class="[info.type]" :level="level+1"></resizer>
    </template>
    <div v-if="showMask&&info.children.length!=1" :style="{'z-index':level}" @dragover="dragover($event)" @drop="drop($event)" @dragleave='dragleave($event)' @dragenter='dragenter($event)' class="mask top"></div>
    <div v-if="showMask&&info.children.length!=1" :style="{'z-index':level}" @dragover="dragover($event)" @drop="drop($event)" @dragleave='dragleave($event)' @dragenter='dragenter($event)' class="mask left"></div>
    <div v-if="showMask&&info.children.length!=1" :style="{'z-index':level}" @dragover="dragover($event)" @drop="drop($event)" @dragleave='dragleave($event)' @dragenter='dragenter($event)' class="mask right"></div>
    <div v-if="showMask&&info.children.length!=1" :style="{'z-index':level}" @dragover="dragover($event)" @drop="drop($event)" @dragleave='dragleave($event)' @dragenter='dragenter($event)' class="mask bottom"></div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .ui-dock {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex: 1;
    overflow auto

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

    &.row {
      flex-direction: row;
      flex-wrap: nowrap;
    }

    &.column {
      flex-direction: column;
      flex-wrap: nowrap;
    }
  }
</style>
<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import BasePanel from './BasePanel'
  import Panel from './Panel'
  import Resizer from './Resizer'

  export default {
    mixins: [BaseComponent, BasePanel],
    name: 'dockMain',
    components: {Panel, Resizer},
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
        boxSize: {
          width: 0,
          iwidth: 0,
          height: 0,
          iheight: 0
        },
        resizerSize: 3
      }
    },
    watch: {
    },
    mounted: function () {
      this.initBounding()
    },
    methods: {
      removePanel: function (info) {
        this.info.children.splice(this.info.children.indexOf(info), 1)
        if (this.info.children.length > 0) {
          this.info.children[0].flex += info.flex
        } else {
          this.$parent && this.$parent.removePanel && this.$parent.removePanel(this.info)
        }
      },
      getBrother: function (resizer) {
        var index = 0
        var child = this.$children
        child.find((value, key) => {
          if (value == resizer) {
            index = key
            return true
          }
        })
        if (index) {
          this.preBrother = child[index - 1]
          this.nextBrother = child[index + 1]
        }
      },
      initBounding: function () {
        var box = this.$el.getBoundingClientRect()
        var length = this.$children.length
        this.boxSize.width = box.width
        this.boxSize.iwidth = box.width - Math.floor(length / 2) * this.resizerSize
        this.boxSize.height = box.height
        this.boxSize.iheight = box.height - Math.floor(length / 2) * this.resizerSize
      },
      doMove: function (resizer, move) {
        var key = this.info.type == 'row' ? 'x' : 'y'
        var preFlex = parseFloat(this.preFlex - move[key])
        var nextFlex = parseFloat(this.nextFlex + move[key])
        if (this.preBrother && this.nextBrother) {
          this.preBrother.info.flex = preFlex + 'px'
          this.nextBrother.info.flex = nextFlex + 'px'
        }
      },
      /**
       * 拖动完成后，需要把孩子元素的px转换为百分比
       */
      mouseup: function () {
        this.initBounding()
        var key = this.info.type == 'row' ? 'width' : 'height'
        var total = this.boxSize['i' + key]
        this.info.children.forEach(element => {
          this.$set(element, 'flex', parseFloat(element.flex) / total)
        })
      },
      dealPx: function () {
        var key = this.info.type == 'row' ? 'width' : 'height'
        var total = this.boxSize['i' + key]
        // 查询是否有不是百分比的数据，如果有的话。统一容错处理
        var px = this.info.children.find(element => {
          if ((element.flex + '').indexOf('px') != -1) {
            return true
          }
        })
        if (px) {
          this.info.children.forEach(element => {
            element.flex = 1 / this.info.children.length
          })
        }
        this.info.children.forEach(element => {
          this.$set(element, 'flex', element.flex * total + 'px')
        })
      },
      dealPrecent: function () {
        var key = this.info.type == 'row' ? 'width' : 'height'
        var total = 0
        this.info.children.forEach(element => {
          total += element[key]
        })
        this.info.children.forEach(element => {
          this.$set(element, 'flex', element[key] / total)
        })
      },
      mousedown: function (params) {
        this.getBrother(params)
        this.initBounding()
        this.dealPx()
        if (this.preBrother && this.nextBrother) {
          this.preFlex = parseFloat(this.preBrother.info.flex)
          this.nextFlex = parseFloat(this.nextBrother.info.flex)
        }
      }
    }
  }
</script>

