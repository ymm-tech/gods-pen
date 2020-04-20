<template>
  <div class="styleEditorWarp" :class="{'enable':!!info}">
    <el-form size="mini" label-position="left" label-width="50px" :model="info">
      <div @click.stop="handleClick(align)" class="align-item" :key="index" v-for="(align, index) in aligns">
        <a :title="align.desc" class="iconfont" :class="[align.icon]"></a>
      </div>
    </el-form>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .styleEditorWarp {
    padding: 0 10px;
    color: #606266;
  }

  .align-item {
    display: inline-block;
    cursor: pointer;
    margin-left: 10px;
    margin-right: 10px;
    text-shadow: 2px 2px 1px #000;

    &:hover {
      color: #faad14;
    }
  }
</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  export default {
    mixins: [BaseComponent],
    name: 'StyleSize',
    components: {},
    props: {
      info: {
        required: true,
        type: Object
      },
      stacked: {
        type: Boolean,
        default: true,
      }
    },
    computed: {
      aligns () {
        return this.stacked ? [
          {
            name: 'align-top',
            desc: '上对齐',
            icon: 'icon-align-top'
          },
          {
            name: 'align-bottom',
            desc: '下对齐',
            icon: 'icon-align-bottom'
          },
          {
            name: 'align-left',
            desc: '左对齐',
            icon: 'icon-align-left'
          },
          {
            name: 'align-right',
            desc: '右对齐',
            icon: 'icon-align-right'
          },
          {
            name: 'align-center',
            desc: '垂直居中',
            icon: 'icon-align-center'
          },
          {
            name: 'align-middle',
            desc: '水平居中',
            icon: 'icon-align-middle'
          },
          {
            name: 'one-bottom',
            desc: '下移一层',
            icon: 'icon-one-bottom'
          },
          {
            name: 'one-top',
            desc: '上移一层',
            icon: 'icon-one-top'
          },
          {
            name: 'all-bottom',
            desc: '置底',
            icon: 'icon-all-bottom'
          },
          {
            name: 'all-top',
            desc: '置顶',
            icon: 'icon-all-top'
            },
          {
            name: 'fill-width',
            desc: '横向填充',
            icon: 'icon-full-width'
          },
          {
            name: 'fill-half-width',
            desc: '横向1/2填充',
            icon: 'icon-half-width'
          },
          {
            name: 'fill-height',
            desc: '纵向填充',
            icon: 'icon-full-height'
          },
          {
            name: 'fill-half-height',
            desc: '纵向1/2填充',
            icon: 'icon-half-height'
          }
        ]
        : [
          {
            name: 'align-left',
            desc: '左对齐',
            icon: 'icon-align-left'
          },
          {
            name: 'align-right',
            desc: '右对齐',
            icon: 'icon-align-right'
          },
          {
            name: 'align-top',
            desc: '上对齐',
            icon: 'icon-align-top'
          },
          {
            name: 'align-middle',
            desc: '水平居中',
            icon: 'icon-align-middle'
          },
          {
            name: 'fill-width',
            desc: '横向填充',
            icon: 'icon-full-width'
          },
          {
            name: 'fill-half-width',
            desc: '横向1/2填充',
            icon: 'icon-half-width'
          }
        ]
      }
    },
    mounted: function () {
    },
    methods: {
      handleClick (data) {
        var el = window.$vue && window.$vue.$el
        var parentEl = window.$vue && window.$vue.parentNodeVm.$el
        var {width, height} = this.getRect(el, parentEl)
        var info = {...this.info}
        if (!this.isPositionEl(el)) {
          info.position = 'relative'
        }
        info.right = ''
        info.bottom = ''
        switch (data.name) {
          case 'align-top':
            info.top = 0
            break
          case 'align-right':
            info.left = (width - el.clientWidth) + 'px'
            break
          case 'align-middle': // 水平
            info.left = (width - el.clientWidth) / 2 + 'px'
            break
          case 'align-left':
            info.left = 0
            break
          case 'align-center': // 垂直
            info.top = (height - el.clientHeight) / 2 + 'px'
            break
          case 'align-bottom':
            info.top = (height - el.clientHeight) + 'px'
            break
          case 'one-bottom':
            this.moveLayer(-1)
            break
          case 'one-top':
            this.moveLayer(1)
            break
          case 'all-bottom':
            this.moveLayer(Number.MIN_VALUE)
            break
          case 'all-top':
            this.moveLayer(Number.MAX_VALUE)
            break
            case 'fill-width':
            info.width = width + 'px'
            break
          case 'fill-half-width':
            info.width = (width / 2 | 0) + 'px'
            break
          case 'fill-height':
            info.height = height + 'px'
            break
          case 'fill-half-height':
            info.height = (height / 2 | 0) + 'px'
            break
        }
        this.$reactiveSet(this.info, info)
      },
      isPositionEl (el) {
        if (!el) return false
        return ['relative', 'absolute', 'fixed'].indexOf(window.getComputedStyle(el).position) > -1
      },
      getRect (el, parent) {
        if (!el || !parent) return {width: 0, height: 0}
        if (parent.classList.contains('appWarp')) {
          return el.getBoundingClientRect()
        } else {
          return parent.getBoundingClientRect()
        }
      },
      moveLayer: function (number) {
        var $node = window.$vue
        if ($node && $node.parentNodeVm) {
          $node.parentNodeVm.moveLayer($node.nodeInfo, number)
        }
      },
    }
  }
</script>

