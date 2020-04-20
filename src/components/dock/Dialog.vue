<template>
  <div class="ui-dock-dialog comp-panel-frame animation-panel" :style="info.style" :class="{moving: active, 'for-main-dock': isForMainDock, [dockedPos]: true}" @mousedown.capture="captureMousedown">
    <header class="panel-header dragger dark" @mousedown="mousedown($event)" v-if='!isForMainDock'>
      <div class="panel-header-title">
        <div class="panel-header-title-content">
          <span class="panel-header-label" draggable="true" @dragstart="dragstart($event,info)" @dragend="dragend($event,info)">
            <i class="iconfont icon-dragvertical"></i> {{info.name}}</span>
        </div>
      </div>
    </header>
    <div :class="[ labelRight ? 'label-right' : 'label-left' ]" class="tools" @mousedown="mousedown($event)">
      <div class="tools-inner">
        <div class="btnWarp"><i style="font-weight: bolder;" class="el-icon-close btn" @mousedown.stop @click.stop="close"></i></div>
        <div class="btnWarp" v-if="dockedPos === 'right-stick' || dockedPos === 'right-normal' || dockedPos === 'left-end'"><i class="iconfont icon-double-right-filled btn" @mousedown.stop @click.stop="autoFold()"></i></div>
        <div class="btnWarp" v-if="dockedPos === 'left-stick' || dockedPos === 'left-normal' || dockedPos === 'right-end'"><i class="iconfont icon-double-left-filled btn" @mousedown.stop @click.stop="autoFold()"></i></div>
        <div class="panel-names" v-show="dockedPos.includes('end')">
          <div :key="i" class="panel-names-item" v-for="(item, i) in pannelNames">{{item}}</div>
        </div>
      </div>
      </div>
    <div class="content">
      <slot>
        <component class="width100" v-if="info.component" :is="info.component" v-bind="info.props"></component>
      </slot>
    </div>
    <div @mousedown="resizerMousedown($event)" class="resize"></div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .width100 {
    width: 100%;
  }
  .ui-dock-dialog {
    position: fixed;
    top: 10%;
    left: 40%;
    z-index: 1310;
    width: 288px;
    box-shadow  0 -3px 20px 0px rgb(23, 23, 23)
    border-radius: 5px;
    overflow: visible;
    font-size: 16px;
    text-align: left;
    background-color: #262626;
    z-index: 14;
    display: flex;
    flex-direction: column;
    transition: opacity 0.1s linear
    color #ccc

    &.right-end {
      z-index 16
      transition transform 300ms ease-in-out 100ms, z-index 100ms ease-in-out 100ms
      // &:hover {
      //   transform translate3d(-100%, 0, 0)
      // }
    }

    &.left-stick {
      &:hover {
        z-index 15
        transition z-index 100ms ease-in-out 100ms
      }
    }

    &.right-stick {
      &:hover {
        z-index 15
        transition z-index 100ms ease-in-out 100ms
      }
    }

    &.left-end {
      z-index 16
      transition transform 300ms ease-in-out 100ms, z-index 100ms ease-in-out 100ms
      // &:hover {
      //   transform translate3d(100%, 0, 0)
      // }
    }

    &.moving {
      opacity 0.95
      z-index 15
    }
    &.left-normal:hover,
    &.right-normal:hover {
      z-index 15
      transition z-index 100ms ease-in-out 100ms
    }
    &.for-main-dock {
      &:before {
        content: ''
        height: 5px;
        background-color #353535
      }
      .content {
        padding: 0px;
      }
    }

    .tools {
      position: absolute;
      width: 30px;
      height: 150px;
      filter: drop-shadow(0 -3px 20px #171717);
      cursor move
      &.label-right {
        right: -30px;
        top: 0;
        .tools-inner {
          border-top-right-radius: 17px;
          border-bottom-right-radius: 36px;
          clip-path: polygon(0% 0%, 100% 5%, 100% 80%, 0 100%);
        }
      }
      &.label-left {
        left: -30px;
        top: 0;
        .tools-inner {
          border-top-left-radius: 17px;
          border-bottom-left-radius: 36px;
          clip-path: polygon(100% 0, 0 5%, 0 80%, 100% 100%);
        }
      }
      .tools-inner {
        padding-top 9px;
        background-color: #444;
        height 100%
        width 100%
      }
      .btnWarp {
        position: static;
        margin-bottom: 6px;
        margin-left: 3px;
        width: 24px;
        .iconfont {
          font-size 16px;
          color: #ccc;
        }
      }
      .panel-names {
        text-align center
      }
      .panel-names-item {
        color: #929292;
        font-size: 12px;
        line-height: 1;
        margin-top: 6px;
      }
    }

    .resize {
      width: 20px;
      height: 20px;
      bottom: 0;
      right: 0;
      position: absolute;
      cursor: se-resize;
      z-index 12
      &:before {
        content ''
        display inline-block
        width: 19px;
        height: 19px;
        background-repeat: no-repeat;
        background-position: 78% 50%;
        background-size: 50%;
        background-image url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACKklEQVRYR+1X0W3bQAwl5fuvM0EsQMffNhPUnaDOBs0ETSeoN6g7QdoJmk4QZwPlVxSgZgP3W4JZUJCEy1mCLQWyG7T8MXCiyXeP1COFcGLDE+eHfwNAkiQfAOAtIm4Q8T6Kotua+dEZSNN0JSIfvVJ/stau9Gx0AMwsLX12b62dnxLAo7V2diwAGwB45bHw01q7OAqANE0XIvLNAfFbROZEFB8FgCbJsmxWFEVJuTEmDsNQWSlt9CbcJ3T/AQxiIMuyaVEUNwBQdrKI/AKAy7qxXNqTJHkDADeIqL9qa2PMZd0HgwC0qZuCIKLQr3mSJDEivnbPReQ7Eak8D2tCZl6rtvvJjDFhGIbKRmNtSigiMRFdjAHgzH3FNEEHgAciKksyqATMvASAzx6tTVCPgR22EPFrFEXXgwFUN1uKyAIRpwAQG2OufforEZrmeb5CxLmIbIIgWE8mk+WzmnCfuPR5PqgEfRLs8/27AFQCU76zxpjHtprWN+rpq8PovIr70DqMVLEQ8Q4AtKnUdH+7cvc3J/ksz/M7RCwnnJqIXBGRjt0nVo1jVc0mroi82xnHzKyL4nvv/xtr7ZkftKfvYQsJM6uClTS5Zq3d6ZMuJRSRC38edAhRI9tN8K6gfQB0+B62lDKzKtMX9/auYrnnVV1/eGQ1e57ne/haroEBoFyXt9utDoydpqqDM7P6qbrNEDGu9/y2914/TIIgaMbxUT9MXpYQ7UM7xvM/NOYiMG8ItnMAAAAASUVORK5CYII=')
      }
    }

    .panel-header {
      background-color: #353535;
      box-shadow: inset 0 -1px 1px 0px #000;
      height: 34px;
      min-height: 34px;
      box-sizing: border-box;
      position: relative;
      width: 100%;
      cursor: move;

      .panel-header-title {
        font-size: 14px;
        line-height: 34px;
        padding-left: 10px;
        overflow: hidden;
        position: absolute;
        color: #fff;
        max-width: 75%;
        white-space: nowrap;

        .panel-header-label {
          cursor: pointer;
        }
      }
    }

    .btnWarp {
      position: absolute;
      top: 5px;
      right: 10px;
      color: #ffffff;
      font-size: 16px;

      .btn {
        background-color: #444;
        border-radius: 50%;
        padding: 2px;
        cursor: pointer;
        padding 4px;
        color: #a9a9a9;
        &:hover {
          box-shadow inset 0px 2px 2px 0px #222, 0px 1px 2px 0px #8c8c8c
        }
      }
    }

    .content {
      flex: 1;
      min-height: 300px;
      padding: 10px;
      overflow: auto;
      display flex
      user-select none
    }

    >>> .el-tabs__nav-scroll {
      cursor move
    }
  }
</style>
<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import throttle from 'lodash/throttle'
  import debounce from 'lodash/debounce'
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
        active: false,
        dockedPos: ''
      }
    },
    watch: {
      'info.children.length': {
        handler (val) {
          if (val === 0) this.close()
        },
        immediate: true
      }
    },
    computed: {
      isForMainDock () {
        return this.info && this.info.children instanceof Array
      },
      labelRight () {
        return this.dockedPos.includes('left')
      },
      pannelNames () {
        return (JSON.stringify(this.info).match(/"name":[^,}]+/g) || []).map(v => v.replace(/[":]|name/g, ''))
      }
    },
    mounted: function () {
      this.$nextTick(() => this.calcPos())
      this.debouncedCalcPos = debounce(this.calcPos, 200)
      this.$watch('info.style.left', this.debouncedCalcPos)
      window.addEventListener('resize', this.debouncedCalcPos)
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
    beforeDestroy () {
      window.removeEventListener('resize', this.debouncedCalcPos)
    },
    methods: {
      captureMousedown (e) {
        if (e.target && e.target.classList.contains('el-tabs__nav-scroll')) {
          this.mousedown(e)
          e.stopPropagation()
        }
      },
      calcPos () {
        console.log('calcPos', this.info.name)
        const RECT = this.getRect()
        const transform = (getComputedStyle(this.$el).transform.match(/\((.+)\)/) || ['', ''])[1].split(/[,\s]+/)
        const transformLeft = transform && +transform[4] || 0
        const left = RECT.left
        let pos
        if (left >= window.innerWidth - RECT.width * 0.5) pos = 'right-end'
        else if (left >= window.innerWidth - RECT.width) pos = 'right-stick'
        else if (left >= window.innerWidth * 0.5 - RECT.width * 0.5) pos = 'right-normal'
        else if (left > 0) pos = 'left-normal'
        else if (left > RECT.width * -0.5) pos = 'left-stick'
        else pos = 'left-end'
        if (pos === 'left-stick' && Math.abs(transformLeft - RECT.width) <= 0.001) {
          pos = 'left-end'
        }
        if (pos === 'right-stick' && Math.abs(transformLeft + RECT.width) <= 0.001) {
          pos = 'right-end'
        }
        if (pos.includes('normal') && Math.abs(transformLeft) > 0.001) {
          this.info.style.left = left + 'px'
        }
        this.setAutoPos(pos, this.dockedPos)
      },
      autoFold () {
        let pos
        switch (this.dockedPos) {
          case 'left-end':
            pos = 'left-stick'
            break
          case 'left-stick':
            pos = 'left-end'
            break
          case 'left-normal':
            pos = 'left-stick'
            break
          case 'right-end':
            pos = 'right-stick'
            break
          case 'right-stick':
            pos = 'right-end'
            break
          case 'right-normal':
            pos = 'right-stick'
            break
        }
        console.log(pos)
        this.dockedPos = pos
        this.setAutoPos(pos)
      },
      getRect () {
        return this.$el.getBoundingClientRect()
      },
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
        this.ema && this.ema.fire('dock.dialogClose', this.info)
      },
      setAutoPos (val, old) {
        console.log('setAutoPos', val, old)
        this.dockedPos = val
        let left = this.calcLeft(val)
        if (left !== null) {
          this.updateTopsAndIndex(val)
          this.info.style.left = left + 'px'
        } else if (old && /normal/.test(val) && val !== old) {
          this.updateTopsAndIndex(old)
        }
        this.info.style.width = Math.max(300, Math.min(window.innerWidth - 100, parseFloat(this.info.style.width)) || 350) + 'px'
        this.info.style.height = Math.max(400, Math.min(window.innerHeight - 100, parseFloat(this.info.style.height)) || 500) + 'px'
      },
      updateTopsAndIndex (dir = '') {
        dir = (dir.split('-') || [])[0]
        if (!['left', 'right'].includes(dir)) return
        var reg = new RegExp(`${dir}-(end|stick)`)
        const sliblings = this.$parent.$children
          .filter(v => v.$options.name === this.$options.name && reg.test(v.dockedPos))
        let lastTop
        sliblings.map((v, i) => {
          let height = 135
          let top = i * height + 75
          if (top > window.innerHeight - height * 1) top = lastTop + 34
          let diff = window.parseFloat(v.info.style.top) - window.parseFloat(top)
          if (Math.abs(diff) > 0.1) {
            v.$el.addEventListener('transitionend', function removeTransition () {
              v.$el.removeEventListener('transitionend', removeTransition)
              v.$delete(v.info.style, 'transition')
            })
            v.info.style.transition = `top ${Math.pow(Math.abs(diff), 0.3) * 50}ms linear`
          }
          lastTop = top
          v.info.style.top = top + 'px'
        })
      },
      calcLeft (val) {
        const RECT = this.getRect()
        let left = null
        switch (val) {
          case 'right-end':
            left = window.innerWidth
            break
          case 'right-stick':
            left = window.innerWidth - RECT.width
            break
          case 'left-end':
            left = -RECT.width
            break
          case 'left-stick':
            left = 0
            break
        }
        return left
      },
      doMove: throttle(function (move) {
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
      }, 17),
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

