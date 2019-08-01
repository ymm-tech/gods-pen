<template>
  <div class="ui-dock-dialog comp-panel-frame animation-panel" :style="info.style">
    <header class="panel-header dragger dark" @mousedown="mousedown($event)">
      <div class="panel-header-title">
        <div class="panel-header-title-content">
          <span class="panel-header-label" draggable="true" @dragstart="dragstart($event,info)" @dragend="dragend($event,info)">
            <i class="iconfont icon-dragvertical"></i> {{info.name}}</span>
        </div>
      </div>
      <div class="btnWarp">
        <i class="el-icon-close btn" @click="close"></i>
      </div>
    </header>
    <!-- react-text: 920 -->
    <!-- /react-text -->
    <div class="content">
      <component v-if="info.component" :is="info.component" v-bind="info.props"></component>
    </div>
    <!-- react-text: 1039 -->
    <!-- /react-text -->
    <div @mousedown="resizerMousedown($event)" class="resize"></div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .ui-dock-dialog {
    position: fixed;
    top: 10%;
    left: 40%;
    z-index: 1310;
    width: 288px;
    box-shadow: 0 0 18px 0 rgba(22, 45, 61, 0.27);
    border-radius: 5px;
    overflow: hidden;
    font-size: 16px;
    text-align: left;
    background-color: #fff;
    z-index: 1000;
    display: flex;
    flex-direction: column;

    .resize {
      width: 20px;
      height: 20px;
      bottom: 0;
      right: 0;
      position: absolute;
      cursor: se-resize;
    }

    .panel-header {
      background-color: #262626;
      height: 34px;
      min-height: 34px;
      box-sizing: border-box;
      position: relative;
      width: 100%;
      cursor: move;

      .panel-header-title {
        font-size: 14px;
        line-height: 34px;
        padding-left: 24px;
        overflow: hidden;
        position: absolute;
        color: #fff;
        max-width: 75%;
        white-space: nowrap;

        .panel-header-label {
          cursor: pointer;
        }
      }

      .btnWarp {
        position: absolute;
        top: 5px;
        right: 10px;
        color: #ffffff;
        font-size: 18px;

        .btn {
          background-color: #262626;
          border-radius: 50%;
          padding: 2px;
          cursor: pointer;
        }
      }
    }

    .content {
      flex: 1;
      min-height: 300px;
      padding: 10px;
      overflow: auto;
    }
  }
</style>
<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  export default {
    mixins: [BaseComponent],
    name: 'dockDialog',
    components: {},
    props: {
      info: {
        required: true,
        type: Object
      }
    },
    data: function () {
      return {
        startPos: {left: 0, top: 0},
        move: {
          start: {x: 0, y: 0},
          end: {x: 0, y: 0},
        },
        active: false
      }
    },
    watch: {
    },
    computed: {
    },
    mounted: function () {
      this.ema.bind('dock-mouseup', () => {
        this.active = false
        this.resizerActive = false
      })
      this.ema.bind('dock-mousemove', (event) => {
        if (this.active || this.resizerActive) {
          this.move.end = {
            x: event.pageX,
            y: event.pageY
          }
          this.doMove({
            x: this.move.start.x - this.move.end.x,
            y: this.move.start.y - this.move.end.y
          })
        }
      })
    },
    methods: {
      removeOne: function (params) {
        this.close()
      },
      dragend: function (ev) {
        this.ema.fire('dock.panelTitleDragEnd', ev)
      },
      dragstart: function (ev, menu) {
        ev.stopPropagation()
        ev.dataTransfer.effectAllowed = 'move'
        ev.dataTransfer.setDragImage(ev.target, ev.offsetX, ev.offsetY)
        this.ema.fire('dock.panelTitleDragStart', this, this.info)
      },
      close: function (params) {
        this.ema.fire('dock.dialogClose', this.info)
      },
      doMove: function (move) {
        var style = {
        }
        if (this.active) {
          style = {
            left: this.startPos.left - move.x,
            top: this.startPos.top - move.y
          }
          this.info.style.left = style.left + 'px'
          this.info.style.top = style.top + 'px'
        }
        if (this.resizerActive) {
          style = {
            width: Math.max(this.startPos.width - move.x, 300),
            height: Math.max(this.startPos.height - move.y, 400)
          }
          this.info.style.width = style.width + 'px'
          this.info.style.height = style.height + 'px'
        }
      },
      mousedown: function (event) {
        this.startPos = {
          left: parseFloat(this.info.style.left),
          top: parseFloat(this.info.style.top),
          width: parseFloat(this.info.style.width),
          height: parseFloat(this.info.style.height)
        }
        this.move.start = {
          x: event.pageX,
          y: event.pageY
        }
        this.active = true
      },
      resizerMousedown: function (event) {
        this.startPos = {
          left: parseFloat(this.info.style.left),
          top: parseFloat(this.info.style.top),
          width: parseFloat(this.info.style.width),
          height: parseFloat(this.info.style.height)
        }
        this.move.start = {
          x: event.pageX,
          y: event.pageY
        }
        this.resizerActive = true
      }
    }
  }
</script>

