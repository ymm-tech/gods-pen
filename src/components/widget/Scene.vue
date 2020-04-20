<template>
  <div class="appWarp dont-override" ref="appWarp" id="appWarp" @scroll="scrollChange" @mousemove="mousemove" @mouseup="mouseup" @mouseleave="mouseup" @click="bgClick">
    <div class="headertool" v-if="selectNode">
      <align :stacked='selectNodeStacked' :info="selectNode.style"></align>
    </div>
    <div class="editType">
      <el-radio-group @click.native.stop="" size='mini' v-model="editType">
        <el-radio-button label="editor">编辑模式</el-radio-button>
        <el-radio-button label="preview">预览模式</el-radio-button>
      </el-radio-group>
    </div>
    <div class="phoneSize">
      <div class="phoneItem" @click="changePhoneSize(item)" :class="{active: phoneSize.name == item.name}" v-for="(item,index) in PHONE_SIZES" :key="index" :style="{width: item.width, zIndex: 20 - index}">
        <div class="desc">{{item.name}} - {{item.width}}</div>
      </div>
    </div>
    <div class="app" id="stage" :class="[phoneSize.name.toLowerCase().replace(/\s+/, '-')]" :style="{width: phoneSize.width, minHeight: phoneSize.height}">
      <node :key="info && info.id" :info="info" v-if="info&&editType=='editor'" ref="node"></node>
      <perview-node :info="previewInfo" v-if="previewInfo&&editType=='preview'"></perview-node>
    </div>
    <assist-lines></assist-lines>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @require '../../assets/style/base.styl';
  @require '../../assets/style/m-1px.styl';
  @require '../../assets/style/animate.min.css';
  @require '../../assets/style/custome-animate.css';

  .appWarp.dont-override {
    position: relative;
    font-size: 12px;
    width: 100%;
    height: 100%;
    overflow: auto;
    left: auto;
    right: auto;
    bottom: 0;
    padding-top: 85px;
    box-sizing: content-box;

    .headertool {
      left: 0;
      right: 0;
      top: 29px;
      position: fixed;
      padding: 5px 10px;
      margin: 1px;
      z-index: 10000;
      text-align center
    }

    .editType {
      left: 0;
      right: 0;
      margin: 5px auto;
      width: 200px;
      display: block;
      z-index: 10000;
      top: 55px;
      position: fixed;

      .el-radio-group {
        box-shadow: 0px 8px 24px 1px #000000bd;
      }
    }

    .app {
      position: relative;
      margin: 0 auto 30000px;
      font-size: 12px;
      color: #000000;
      background-color: #ffffff;
      transform: translate(0,0);
    }
    .app.desktop {
      margin-top: 5px;
    }
    .app.desktop:before {
      position absolute
      z-index: 1
      left 0
      right 0
      top -30px;
      height 30px;
      content: ''
      display block
      background-repeat no-repeat
      background-size 1366px auto
      background-position 50% bottom
      background-image url('../../assets/image/ruler.png')
    }

    .phoneSize {
      position: relative;
      width: auto;
      height: 20px;
      top: -13px;
      margin: 0 auto;
      background-color: rgba(16, 16, 16, 0.8196078431372549);

      &:hover {
        .phoneItem.active {
          color: transparent;
          background-color: transparent;
          box-shadow: none;
        }
      }

      .phoneItem {
        position: absolute;
        top: 0;
        left: 50%;
        height: 100%;
        line-height: 20px;
        transform: translate(-50%, 0);
        border: solid #000;
        border-width: 0 3px;
        box-sizing: content-box;
        cursor: pointer;
        text-align: center;
        font-size: 12px;
        color: transparent;

        &.active {
          color: #fff;
          background-color: rgba(39, 39, 39, 0.81);
          box-shadow: 0 2px 7px 1px #000;
        }

        &:hover {
          color: #fff !important;
          background-color: rgba(39, 39, 39, 0.81) !important;
          box-shadow: 0 2px 7px 1px #000 !important;
        }
      }

      .phone {
        display: none;
        width: 328px;
        height: 560px;
        z-index: 999;
        pointer-events: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        border-radius: 40px;
      }
    }

    .rubbish {
      background-color: #dddddd;
      position: absolute;
      z-index: 1000;
      bottom: 0;
      width: 100%;
      text-align: center;
      padding: 20px;
      font-size: 30px;

      &:hover {
        color: red;
      }
    }
  }
</style>
<script>
  import Node from '../Node'
  import AssistLines from '../AssistLines'
  import PerviewNode from '../PerviewNode'
  import BaseComponent from 'src/extend/BaseComponent'
  import cloneDeep from 'lodash/cloneDeep'
  import {mapState} from 'vuex'
  import Align from '../style/Align'
  import {sleep} from '../../assets/js/common'

  export default {
    mixins: [BaseComponent],
    name: 'widgetScene',
    // eslint-disable-next-line
    components: {Node, PerviewNode, AssistLines, Align},
    computed: {
      ...mapState({
        Config: state => state.Config,
        RootNodeInfo: state => state.RootNodeInfo,
        phoneSize: state => state.setting.phoneSize,
        PHONE_SIZES: state => state.Metadata.phoneSize
      }),
      isMainScene () {
        return this.packedNodeStack.length == 0
      }
    },
    watch: {
      active: function (params) {
        if (this.active) {
          this.selectNode = window.$vue && window.$vue.nodeInfo
          this.selectNodeStacked = window.$vue && window.$vue.stacked
        }
      },
      phoneSize (val, {name} = {}) {
        this.info.canvas = val
        if (/desktop/i.test(val && val.name) && name !== val.name && this.info.stack) {
          this.$confirm('您正处于 [桌面画布] 下，需要将布局模式切换为 [楼层模式] 吗？楼层模式下，组件如楼层般依次向下扩展，更适合您当前所选的画布。')
          .then(() => { this.info.stack = false })
          .catch(e => console.log('取消'))
        }
      },
      editType: {
        handler (val, oldval) {
          window.EDIT_TYPE = String(val).toUpperCase()
          this.previewInfo = cloneDeep(this.info)
          this.ema && this.ema.fire('edit-type.change', window.EDIT_TYPE)
          if (window.EDIT_TYPE == 'EDITOR' && this.ema && this.selectNode) {
            this.$nextTick(() => {
              this.ema.fire('select.one', this.selectNode.id)
            })
          }
        },
        immediate: true
      }
    },
    data: function () {
      return {
        info: window.Editor.nodeInfo,
        packedNodeStack: [],
        previewInfo: null,
        selectNode: null,
        selectNodeStacked: true,
        editType: 'editor',
        pageInfo: {
          id: 1,
          name: '目名',
          categoryId: 2,
          content: '',
          desc: '项目描述'
        },
      }
    },
    beforeCreate: function () {
    },
    created: function () {
    },
    mounted: function () {
      this.selectNode = window.$vue && window.$vue.nodeInfo
      this.selectNodeStacked = window.$vue && window.$vue.stacked

      this.ema.bind('select.oneInfo', ({vm}) => {
        console.log('scene', vm.nodeInfo)
        this.selectNode = vm.nodeInfo
        this.selectNodeStacked = vm.stacked
      })
      this.ema.bind('select.noOne', () => {
        this.selectNode = null
        this.selectNodeStacked = true
      })
      this.ema.bind('nodeInfo.replace', info => {
        this.info = info
      })
      // anyToPx
      this.ema.bind('allToPx', async () => {
        let yes = await this.$confirm('此操作将组件位置和大小属性的相对单位转化为绝对单位，可能造成在更换画布之后出现不符合预期的显示，请谨慎操作！')
        if (!yes) return
        this.allToPx()
      })
      this.ema.bind('nodeInfo.change', () => {
        this.info = window.Editor.nodeInfo
      })
      this.ema.bind('packedNode.push', (node) => {
        this.packedNodeStack.push(node)
        this.info = node
      })
      this.ema.bind('packedNode.pop', () => {
        this.packedNodeStack.pop()
        const len = this.packedNodeStack.length
        this.info = len == 0 ? window.Editor.nodeInfo : this.packedNodeStack[len - 1]
      })
      this.bindMove()
      this.bindLock()
      window.$app = this
    },
    methods: {
      changePhoneSize (item) {
        this.$confirm(`确定要将画布切换为 ${parseInt(item.width)} x ${parseInt(item.height)} 吗？`)
          .then(() => {
            this.$store.dispatch('SettingChange', {phoneSize: item})
          this.$store.dispatch('setCurrentLayout', (/desktop/i).test(item.name) ? 'desktop' : 'default')
          })
          .catch((e) => console.log(e))
      },
      scrollChange: function (params) {
        var appWarp = this.$refs['appWarp']
        this.ema.fire('appWarpOffsetChange', {
          top: appWarp.scrollTop,
          left: appWarp.scrollLeft,
        })
      },
      async allToPx () {
        const loading = this.$loading({
          lock: true,
          text: '处理中，请稍等',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        var $nodes = this.$refs.node.$children.filter(v => v.$options.name === 'node')
        var that = this
        await eachToPx($nodes)
        loading.close()
        console.log('完成')
        async function eachToPx ($nodes) {
          for (let $node of $nodes) await toPx($node)
        }
        async function toPx ($node) {
          if (typeof $node.actived !== 'function') return
          $node.actived()
          await that.$nextTick()
          await sleep(100)
          console.log($node.nodeInfo.id, 'actived')
          let $selector = $node.$refs.selector
          $selector.mousedown({stopPropagation: () => {}}, '')
          await that.$nextTick()
          await sleep(100)
          console.log($node.nodeInfo.id, 'selector')
          let $children = $node.$children.filter(v => v.$options.name === 'node')
          console.log('$children', $children.length)
          if ($children && $children.length) await eachToPx($children)
        }
      },
      /**
       * 背景点击，处理选中内容
       */
      bgClick: function () {
        this.ema.fire('hide.contextMenu')
        this.ema.fire('select.noOne')
      },
      mouseup: function (ev) {
        this.ema.fire('ui.mouseup', ev)
      },
      mousemove: function (ev) {
        this.ema.fire('ui.mousemove', ev)
      },
      dragenter: function (ev) {
        ev.stopPropagation()
      },
      dragover: function (ev) {
        ev.preventDefault()
      },
      deleteNode: function (id) {
        var node = null
        var parent = null
        var key = 0
        var walk = function (datas) {
          datas = datas || []

          for (let index = 0; index < datas.length; index++) {
            const element = datas[index]
            if (element.id === id) {
              node = element
              key = index
              parent = datas
              return
            }
            if (element.child) {
              walk(element.child)
            }
          }
        }
        walk([this.info])
        console.log(parent, key)
        if (!parent) return
        this.$delete(parent, key)
        return node
      },
      bindMove: function () {
        this.ema.bind('move.node', (moveId, targetNode, pos) => {
          console.log('move.node is coming', this.info)
          var moveNode = cloneDeep(this.deleteNode(moveId))
          if (pos) {
            moveNode.style.left = pos.left
            moveNode.style.top = pos.top
          }
          if (targetNode) {
            targetNode.child.push(moveNode)
          }
        })
      },
      lockNode: function (id, flag) {
        var self = this
        var node = null
        var parent = null
        var key = 0
        var locks = function (arr) {
          for (let i = 0; i < arr.length; i++) {
            self.$set(arr[i], 'lock', flag)
            if (arr[i].child) {
              locks(arr[i].child)
            }
          }
        }
        var walk = function (datas) {
          datas = datas || []
          for (let index = 0; index < datas.length; index++) {
            const element = datas[index]
            console.log(id, element.id)
            if (element.id === id) {
              self.$set(element, 'lock', flag)
              node = element
              key = index
              parent = datas
              if (element.child) {
                locks(element.child)
              }
              return node
            }
            if (element.child) {
              console.log('going')
              walk(element.child)
            }
          }
        }
        walk([this.info])
        console.log(key, parent)
      },
      bindLock: function () {
        this.ema.bind('lock.node', (moveId, flag) => {
          console.log('lock.node is coming', this.info)
          this.lockNode(moveId, flag)
        })
      }
    }
  }
</script>
