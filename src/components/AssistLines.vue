<template>
  <div class="AssistLines" v-if="visible">
    <template v-for="(value,key) in pos">
      <div class="line" :class="{v:key.indexOf('x')!=-1}" :key="key" v-if="value" :style="getStyle(key,value)"></div>
    </template>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .line {
    position: absolute;
    height: 1px;
    width: 100%;
    background-color: #000000;
    z-index: 10000;
    transition: top 0.2s easy-in-out 0;

    &.v {
      transition: left 0.2s easy-in-out 0;
      width: 1px;
      height: 100%;
    }
  }
</style>

<script type="text/ecmascript-6">
  /**
   * 网格吸附线，提供拖拽的时候提示附近元素位置的参考标线
   */
  import BaseComponent from 'src/extend/BaseComponent'
  export default {
    mixins: [BaseComponent],
    name: 'AssistLines',
    props: {
    },
    data: function () {
      return {
        appWarpOffset: {
          top: 0,
          left: 0
        },
        visible: false,
        pos: {
          x1: 0,
          x2: 0,
          x3: 0,
          y1: 0,
          y2: 0,
          y3: 0
        }
      }
    },
    watch: {
    },
    mounted: function () {
      this.ema.bind('AssistLines.update', info => {
        if (!this.parentBox) {
          this.parentBox = this.$parent.$el.getBoundingClientRect()
        }
        this.visible = true
        for (const key in info) {
          const element = info[key]
          this.pos[key] = element[0]
        }
      })
      this.ema.bind('AssistLines.hide', e => {
        this.visible = false
        this.parentBox = null
      })
      this.ema.bind('appWarpOffsetChange', info => {
        this.appWarpOffset = info
      })
    },
    methods: {
      getStyle: function (key, value) {
        var me = this
        if (!this.parentBox) {
          this.parentBox = this.$parent.$el.getBoundingClientRect()
        }
        if (this.uptime) {
          clearTimeout(this.uptime)
        }
        this.uptime = setTimeout(function (params) {
          me.parentBox = null
        }, 1000)
        var data = {}
        if (key.indexOf('x') != -1) {
          data = {
            top: this.appWarpOffset.top + 'px',
            left: (value - this.parentBox.left) + 'px'
          }
        } else {
          data = {
            top: (value - this.parentBox.top + this.appWarpOffset.top) + 'px',
            left: 0
          }
        }
        data['background-color'] = this.Setting.color
        return data
      }
    }
  }
</script>

