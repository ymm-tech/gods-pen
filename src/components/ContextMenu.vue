<template>
  <div v-if="visible" class="tool" :style="style">
    <div class="item-h" v-show="!isRootNode">
      <a class="item-sub" @click="itemClick('copy')">
        <i class="iconfont icon-copy"></i>
        复制
      </a>
      <a class="item-sub" @click="itemClick('deleteNode')">
        <i class="iconfont icon-delete"></i>
        删除
      </a>
    </div>
    <a class="item" @click="itemClick('copyStyle')">
      <i class="iconfont icon-copy"></i>
      复制样式
    </a>
    <a class="item" @click="itemClick('pasteStyle')">
      <i class="iconfont icon-paste"></i>
      粘贴样式
    </a>
    <a class="item" @click="itemClick('exportJson')">
      <i class="iconfont icon-export"></i>
      导出节点
    </a>
    <a class="item" @click="itemClick('importJson')">
      <i class="iconfont icon-import"></i>
      导入节点
    </a>
    <a class="item" @click="itemClick('combinedNode')">
      <i class="iconfont icon-import"></i>
      另存为组合组件
    </a>
    <a class="item" @click="itemClick('reloadNode')">
      <i class="iconfont icon-refresh"></i>
      重载节点
    </a>
    <template v-if="!isRootNode && stacked">
      <div class="item-h">
        <a class="item-sub" @click="moveLayer(1)">
          上移
        </a>
        <a class="item-sub" @click="moveLayer(-1)" v-show="!isRootNode">
          下移
        </a>
        <a class="item-sub" @click="moveLayer(Number.MAX_VALUE)" v-show="!isRootNode">
          置顶
        </a>
        <a class="item-sub" @click="moveLayer(Number.MIN_VALUE)" v-show="!isRootNode">
          置底
        </a>
      </div>
    </template>
    <template v-if="!isRootNode && !stacked && !fixed">
      <div class="item-h">
        <a class="item-sub" @click="moveLayer(1)">
          下移
        </a>
        <a class="item-sub" @click="moveLayer(-1)" v-show="!isRootNode">
          上移
        </a>
      </div>
    </template>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .tool {
    position: fixed;
    z-index: 19900;
    width: 160px;
    background-color: rgb(84, 92, 100);
    color: rgb(255, 255, 255);
    line-height: 40px;
    font-size: 14px;

    .item {
      display: block;
      height: 40px;
      cursor: pointer;
      text-align: left;

      .iconfont {
        margin: 0 0 0 15px;
      }

      &:hover {
        color: rgb(255, 208, 75);
        background-color: rgb(84, 92, 100);
      }
    }

    .item-h {
      display: flex;
      height: 40px;
      text-align: center;

      .item-sub {
        flex: 1;
        cursor: pointer;

        &:hover {
          color: rgb(255, 208, 75);
          background-color: rgb(84, 92, 100);
        }
      }
    }
  }
</style>

<script type="text/ecmascript-6">
  /**
   * 对节点右键弹出的功能菜单
   */
  import BaseComponent from 'src/extend/BaseComponent'

  export default {
    mixins: [BaseComponent],
    components: {},
    name: 'ContextMenu',
    props: {
    },
    data: function () {
      return {
        visible: false,
        node: null,
        style: {
          left: 0,
          top: 0
        }
      }
    },
    computed: {
      isRootNode () {
        var node = this.node
        if (!node) return false
        return node.nodeInfo && (node.nodeInfo.id === 'root' || node.nodeInfo.type === 'node')
      },
      stacked () {
        return this.node.stacked
      },
      fixed () {
        return this.node.nodeInfo.style && this.node.nodeInfo.style.position === 'fixed'
      }
    },
    mounted: function () {
      var maxHeight = document.documentElement.clientHeight
      this.ema.bind('show.contextMenu', (node, e) => {
        var pointerY = e.pageY
        var menuHeight = 320
        // var menuWidth = 160
        this.style.left = (2 + e.pageX) + 'px' // 横向基本不会碰撞
        this.style.top = (2 + pointerY - Math.max(menuHeight - (maxHeight - pointerY), 0)) + 'px' // 处理底部碰撞
        this.node = node
        this.visible = true
        node.actived('contextMenu')
      })
      this.ema.bind('hide.contextMenu', () => {
        this.visible = false
      })
    },
    methods: {
      itemClick: function (key) {
        this.visible = false
        if (typeof this[key] == 'function') {
          this[key](this.node)
        }
      },
      deleteNode: function (node) {
        this.ema.fire('move.node', this.node.nodeInfo.id, null)
      },
      moveLayer: function (number) {
        this.visible = false
        if (this.node && this.node.$parent) {
          this.node.$parent.moveLayer(this.node.nodeInfo, number)
        }
      },
      copy: function () {
        if (this.node && this.node.$parent) {
          this.node.$parent.copyChild(this.node.nodeInfo, {})
        }
      },
      copyStyle () {
        this.node.copyStyle()
      },
      pasteStyle () {
        this.node.pasteStyle()
      },
      reloadNode () {
        if (this.node) this.ema.fire('component.reload', this.node && this.node.nodeInfo.id)
      },
      importJson: function () {
        var me = this
        var content = JSON.stringify(this.node.nodeInfo, null, 2)
        var reg = /(?:"id"\s?\:\s?")(\w+)"/
        var idCache = (content.match(new RegExp(reg, 'g')) || []).map(ids => ids.replace(reg, (m, p) => p))
        this.openDialog({
          name: 'd-nodejson',
          data: {
            idCache,
            content,
            type: 'import'
          },
          methods: {
            saveContent: function (node) {
              Object.assign(me.node.nodeInfo, node)
            }
          }
        })
      },
      exportJson: function () {
        this.openDialog({
          name: 'd-nodejson',
          data: {
            content: JSON.stringify(this.node.nodeInfo, null, 2),
            type: 'export'
          },
          methods: {
          }
        })
      },
      combinedNode () {
        if (this.demoMode) return this.$alert('您处在 demo 模式下，不能保存数据哦')
        var el = this.node.$el
        var elID = `el_${Date.now()}`
        el.setAttribute('el', elID)
        this.openDialog({
          name: 'd-saveCombinedComponent',
          data: {
            elID,
            content: JSON.stringify(this.node.nodeInfo),
          }
        })
      }
    }
  }
</script>

