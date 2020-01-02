<template>
  <div class="node" v-show="visible"
    @dragenter='dragenter($event)' @dragover="dragover($event)" @drop="drop($event)" @dragleave='dragleave($event)'
    @click.stop='actived' @contextmenu.prevent.stop="showContextMenu(nodeInfo,$event)"
    :class="{active:isActive,dragentered:dragentered}"
    :style="computedStyle">
    <component :is="currPage" v-bind="nodeInfo.props" :ref="nodeInfo.id" :style="componentStyle"></component>
    <selecter ref='selector' :is-root='isRootNode' :visible="isActive" :warpStyle="nodeInfo.style"></selecter>
    <template v-if="nodeInfo.child">
      <node v-for="(item,index) in nodeInfo.child" :node-index='index' :stacked='nodeInfo.stack' :key="item.id" :info="item"></node>
    </template>
    <div :style="{width: phoneSize.width}" :class="{hover: dragenteredDivider}" class="node-divider" @dragleave="dragleaveDivider" @dragover="dragoverDivider" @dragenter='dragenterDivider' @drop="dropDivider" v-if="!stacked && !fixed"></div>
    <div v-show="!stacked && !fixed" class="type-icon iconfont icon-stack"></div>
    <div v-show="fixed" class="type-icon iconfont icon-nail-fixed"></div>
    <div v-show="nodeInfo.leaf" :style="{'margin-right': !stacked || fixed ? '14px' : '0'}" class="type-icon iconfont icon-leaf"></div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .node {
    position: relative;
    cursor: pointer;
    user-select: none;
    font-size: 16px;

    &.active {
      // outline: 1px dashed #faad14;
      // box-shadow: inset rgba(102, 88, 88, 0.43) 0px 0px 10px 0px;
    }

    &.dragentered {
      outline: 1px dashed #faad14;
      box-shadow: rgba(102, 88, 88, 0.43) 0px 0px 10px 3px;
    }

    &.mouseovered {
      outline: 1px dotted #faad14;
      // box-shadow: rgba(102, 88, 88, 0.43) 0px 0px 10px 3px;
    }

    .bt {
      z-index: 0;
      left: 0;
      bottom: 0;
      font-size: 12px;
      color: #dddddd;
    }

    > .node-divider {
      height: 10px;
      position: absolute;
      left: 0;
      top: -5px;

      &.hover {
        background: rgba(255, 0, 0, 0.5);
      }
    }

    > .type-icon {
      position: absolute;
      right: 2px;
      top: 2px;
      width: 10px;
      height: 10px;
      font-size: 10px;
      color: #777;
    }
  }
</style>
<script type="text/ecmascript-6">
  import cLoader from 'src/extend/componentLoader'
  import BaseComponent from 'src/extend/BaseComponent'
  import BaseNode from 'src/extend/BaseNode'
  import Selecter from './Selecter'
  import cloneDeep from 'lodash/cloneDeep'
  import {getBaseNode} from 'src/extend/Util'
  import Vue from 'vue'
  import {modifyNodeId, toSafeNumber} from '../assets/js/common'
  export default {
    mixins: [BaseNode, BaseComponent],
    name: 'node',
    components: {Selecter},
    props: {
      info: {
        required: true,
        type: Object
      },
      stacked: {
        type: Boolean,
        default: true
      },
      nodeIndex: {
        type: Number,
      }
    },
    data: function () {
      return {
        dragenteredDivider: false,
        componentStyle: {
          'pointer-events': 'auto'
        },
        canDraged: false,
        oldId: '',
        isActive: false, // 是否被选中
        dragentered: false, // 拖动进入
        mouseovered: false,
        currPage: ''
      }
    },
    watch: {
      'isActive': function (newVal) {
        if (newVal) {
          this.componentStyle['pointer-events'] = 'none'
        } else {
          this.componentStyle['pointer-events'] = 'audo'
        }
      },
      'nodeInfo.type': function (newVal, oldVal) {
        this.nodeInfo.props = {}
        if (this.nodeInfo.type !== 'node') {
          if (this.nodeInfo.type == 'truckPageContainer') {
            this.nodeInfo.style.width = '100%'
            this.nodeInfo.style.height = '100%'
            this.nodeInfo.style.left = '0'
            this.nodeInfo.style.top = '0'
            this.nodeInfo.style.position = 'absolute'
          }
          this.doLoad()
        } else {
          this.currPage = ''
        }
      },
      'nodeInfo.version': function (newVal, oldVal) {
        this.doLoad()
      },
      stacked: {
        handler (stacked) {
          var styleShot = this.nodeInfo.style
          var bakedStyle = this.nodeInfo.bakedStyle
          if (styleShot.position === 'fixed') return
          if (!['fixed', 'relative', 'absolute'].includes(styleShot.position)) {
            this.nodeInfo.style = Object.assign({}, this.nodeInfo.style || {}, {
              position: 'relative',
              left: '0px',
              top: '0px',
              bottom: null,
              right: null,
            })
            return
          }
          if (arguments.length == 1 && stacked) return // 以堆叠模式被初始化
          var positionTypes = !stacked ? ['relative', 'absolute'] : ['absolute', 'relative']
          if (styleShot.position == positionTypes[0]) return
          if (styleShot.position == positionTypes[1]) {
            // 从备份获取 或者 生成样式；存备份
            this.nodeInfo.style = Object.assign({}, this.nodeInfo.style, bakedStyle && bakedStyle.position == positionTypes[0] ? bakedStyle : {
              position: positionTypes[0],
              left: '0px',
              top: '0px',
              bottom: null,
              right: null,
            })
            this.nodeInfo.bakedStyle = {
              left: styleShot.left,
              top: styleShot.top,
              bottom: styleShot.bottom,
              right: styleShot.right,
              position: styleShot.position
            }
          }
        },
        immediate: false
      }
    },
    computed: {
      nodeInfo: function () {
        this.$set(this.info, 'version', this.info.version || '0.1.0')
        return this.info
      },
      phoneSize () {
        return this.$store.state.setting.phoneSize
      },
      visible: {
        // getter
        get: function () {
          if (this.nodeInfo) {
            return this.nodeInfo.visible
          } else {
            return false
          }
        },
        // setter
        set: function (newValue) {
          this.nodeInfo.visible = newValue
        }
      }
    },
    beforeDestroy: function () {
      delete window.$_nodecomponents[this.oldId]
    },
    mounted: function () {
      this.oldId = this.nodeInfo.id
      this.initBaseCss()
      this.bindSelectOne()
      this.bindCopy()
      this.bindDrag()
      this.bindPageContainerSelect()
      this.bindRunAnimation()
      this.bindReload()
      this.registerNodeToGlobal()
      this.doLoad()
      console.log('mounted', this.nodeInfo.id)
    },
    methods: {
      registerNodeToGlobal () {
        window.$_nodecomponents = window.$_nodecomponents || {}
        window.$_nodecomponents[this.nodeInfo.id] = this
      },
      /* 添加一下基础css 用于其他场景 */
      initBaseCss () {
      },
      /**
       * 显示右键菜单
       */
      showContextMenu: function (info, event) {
        this.ema.fire('show.contextMenu', this, event)
      },
      /**
      * 获取组件对象
      * @param {String} id  组件id
      * @param {boolean} child 是否获取组件内部元素
      */
      getComponent: function (id, child) {
        var component = window.$_nodecomponents[id]
        if (child && component) {
          return component.$refs[id]
        }
        return component
      },
      /**
       * 绑定选中节点运行动画
       */
      bindRunAnimation: function () {
        this.ema.bind('animate.timeline.move', (time, alltime) => {
          if (this.nodeInfo.animate.length > 0 && this.isVisible(this)) {
            this.setAnimationFrame(time, alltime)
          }
        })
        this.ema.bind('animate.timeline.move.end', ev => {
          if (this.nodeInfo.animate.length > 0) {
            this.$el.style.animation = ''
          }
        })
      },
      setAnimationFrame (time, alltime) {
        let animates = this.nodeInfo.animate
        let currentAnimation = null
        let timeLine = 0
        let infinitePreTimeLine = 0
        for (let index = 0; index < animates.length; index++) {
          const val = animates[index]
          if (val.infinite) {
            infinitePreTimeLine = timeLine
            timeLine = alltime
            currentAnimation = val
            break
          }
          timeLine += val.duration * val.countNum + val.delay
          if (timeLine >= time) {
            currentAnimation = val
            break
          }
        }

        if (!currentAnimation) {
          return
        }
        let duration = currentAnimation.duration
        let timingFunction = currentAnimation.timingFunction || 'ease'
        let delay = ((timeLine - time) - currentAnimation.duration * currentAnimation.countNum) % currentAnimation.duration
        let count = 1
        if (currentAnimation.infinite) {
          delay = -((time - infinitePreTimeLine - currentAnimation.delay)) % currentAnimation.duration
        }
        let name = currentAnimation.type
        let animation = `${duration}s ${timingFunction} ${delay}s ${count} normal none paused ${name}`
        if (name) {
          this.$el.style.animation = animation
        } else {
          this.$el.style.animation = ''
        }
      },
      /**
       * 绑定选中一个节点事件
       */
      bindDrag: function () {
        // 绑定被选中事件。确保只有一个元素被激活
        this.ema.bind('dragenter.one', id => {
          if (!id || id != this.nodeInfo.id) {
            this.dragentered = false
          } else {
            this.dragentered = true
          }
        })
        // this.ema.bind('alt.down', e => {
        // this.canDraged = true
        // })
        // this.ema.bind('alt.up', e => {
        // this.canDraged = false
        // })
      },
      /**
       * 绑定选中一个节点事件
       */
      bindSelectOne: function () {
        // 绑定被选中事件。确保只有一个元素被激活
        this.ema.bind('select.one', (id, keepContextMenu) => {
          if (this.nodeInfo.locked) return
          if (id != this.nodeInfo.id) {
            this.isActive = false
          } else {
            console.log('select.one 1', this.nodeInfo)
            if (!keepContextMenu || keepContextMenu instanceof window.Event) this.ema.fire('hide.contextMenu') // 隐藏已有菜单
            this.isActive = true
            // 把组件里面的参数设置到数据里面
            this.mergeProps()
            // 选中的元素把元素节点相关信息通过事件派发出去。提供其他组件进行监听
            window.$vue = this
            setTimeout(() => {
              this.ema.fire('select.oneInfo', {
                vm: this
              })
            }, 200)
            // 对page容器特殊处理
            var parent = this.$parent
            if (parent && parent.nodeInfo && parent.nodeInfo.type.indexOf('PageContainer') != -1) {
              this.ema.fire('select.truckPageContainer', id)
            }
          }
        })
        this.ema.bind('select.noOne', () => {
          this.isActive = false
          window.$vue = null
        })
        // 绑定键盘删除按钮事件 对节点进行删除
        this.ema.bind('delete.down', (e) => {
          if (this.isActive) {
            if (e.panelName === 'widgetScene') {
              this.$confirm('确认删除该组件?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.ema.fire('move.node', this.nodeInfo.id, null)
                this.ema.fire('select.noOne')
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消'
                })
              })
            }
          }
        })
      },
      bindCopy () {
        // 绑定被选中事件。确保只有一个元素被激活
        this.ema.bind('node.copy', node => {
          if (!node || !node.id || node.id != this.nodeInfo.id) return
          this.$parent.copyChild(this.nodeInfo, {})
        })
      },
      /**
       * 对page容器绑定，选择page下面的直接孩子的时候，其他孩子隐藏掉
       */
      bindPageContainerSelect: function () {
        var parent = this.$parent
        if (parent && parent.nodeInfo && parent.nodeInfo.type.indexOf('PageContainer') != -1) {
          this.ema.bind('select.truckPageContainer', id => {
            if (id != this.nodeInfo.id) {
              this.nodeInfo.visible = false
            } else {
              this.nodeInfo.visible = true
            }
          })
        }
      },
      async doLoad () {
        let that = this
        if (this.nodeInfo.type === 'node' && !window.$vue) {
          that.$set(that.info, 'stack', that.info.stack !== false)
          this.ema.fire('select.one', this.nodeInfo.id)
          return
        }
        let component = await cLoader.load(this.nodeInfo)
        let type = this.nodeInfo.type
        // 如果有label（用户设置 || getbasenode设置 || 这里设置）保留，否则从component配置对象获取，否则用id
        that.$set(that.info, 'label', that.info.label ? that.info.label : that.info.id.replace(type, component.label || type))
        // stack 模式 显式设置为false才是false
        that.$set(that.info, 'stack', typeof that.info.stack === 'boolean' ? that.info.stack : component.stack !== false)
        // 子组件限额
        that.$set(that.info, 'childLimit', typeof that.info.childLimit === 'number' ? that.info.childLimit : toSafeNumber(component.childLimit, 9999))
        // 叶子节点
        that.$set(that.info, 'leaf', typeof that.info.leaf === 'boolean' ? that.info.leaf : !!component.leaf || String(component.childLimit) === '0')
        var style
        if (that.info.style && JSON.stringify(that.info.style) != '{}') {
          // 已经设置过样式了
          style = that.info.style
        } else {
          // merge 默认样式 组件样式 拖动样式 父组件强制样式 unstacked样式
          style = Object.assign({position: 'absolute', width: '80px', height: '80px', left: '0px', top: '0px'}, component.style || {}, that.info.forceStyle || {}, !this.stacked ? {
            position: 'relative',
            left: null,
            top: null,
            bottom: null,
            right: null,
          } : {})
          // 去除forceStyle
          if (that.info.forceStyle) delete that.info.forceStyle
        }
        that.$set(that.info, 'style', style)
        that.currPage = ''
        if (!this.isNodeRegisted(this.nodeInfo.id)) {
          this.registerNode(this.nodeInfo)
        }
        this.currPage = this.nodeInfo.id
        // 兼容组件更新的情况，老的参数保留并去掉多余参数
        await that.$nextTick()
        var id = this.nodeInfo.id
        var $props = this.$refs[id] && this.$refs[id].$props
        $props && (Object.keys(that.nodeInfo.props) || []).forEach(key => {
          if ($props[key] === undefined) {
            delete that.nodeInfo.props[key]
          }
        })
        if (id === 'root' && !window.$vue) {
          this.ema.fire('select.one', this.nodeInfo.id)
        }
      },
      bindReload: function () {
        this.ema.bind('component.reload', id => {
          if (id == this.nodeInfo.id && this.nodeInfo.type !== 'node') {
            this.currPage = ''
            this.registerNode(this.nodeInfo)
            this.currPage = this.nodeInfo.id
            this.$nextTick(this.actived)
          }
        })
      },
      mergeProps: function () {
        var id = this.nodeInfo.id
        if (this.$refs[id] && this.$refs[id].$props) {
          for (const key in this.$refs[id].$props) {
            if (this.$refs[id].$props.hasOwnProperty(key)) {
              const element = this.$refs[id].$props[key]
              this.$set(this.nodeInfo.props, key, element)
            }
          }
        }
      },
      mouseover: function () {
      },
      mouseenter: function (e) {
        this.mouseovered = true
        this.componentStyle['pointer-events'] = 'none'
      },
      mouseout: function (e) {
        this.mouseovered = false
        this.componentStyle['pointer-events'] = 'auto'
      },
      /**
       * ==============拖动元素相关===============
       */
      /**
       * 选中某个节点
       * @augments
       */
      actived: function (keepContextMenu) {
        // 通知所有节点被选中的是谁
        console.log('actived....', keepContextMenu, this.nodeInfo)
        if (this.nodeInfo.lock) {
          this.$message({type: 'warning', message: '已被锁定，请先解锁'})
        } else {
          this.ema.fire('select.one', this.nodeInfo.id, keepContextMenu)
        }
      },
      dragenter: function (ev) {
        ev.stopPropagation()
        this.ema.fire('dragenter.one', this.nodeInfo.id)
      },
      dragleave: function (ev) {
        ev.stopPropagation()
      },
      dragover: function (ev) {
        ev.stopPropagation()
        ev.preventDefault()
      },
      dragenterDivider: function (ev) {
        ev.stopPropagation()
        this.dragenteredDivider = true
        this.ema.fire('dragenter.one', null)
      },
      dragleaveDivider: function (ev) {
        ev.stopPropagation()
        this.dragenteredDivider = false
      },
      dragoverDivider: function (ev) {
        ev.stopPropagation()
        ev.preventDefault()
      },
      dropDivider: function (ev) {
        ev.stopPropagation()
        ev.preventDefault()
        var parentNode = this.$parent.nodeInfo
        console.log('drop', ev)
        this.dragenteredDivider = false
        this.dragentered = false
        // 添加新的组件内容
        var componentInfo = JSON.parse(ev.dataTransfer.getData('componentInfo'))
        if (componentInfo.name) {
          var nodeInfo = getBaseNode(componentInfo)
          parentNode.child.splice(this.nodeIndex, 0, nodeInfo)
          this.$nextTick(() => {
            this.ema.fire('select.one', nodeInfo.id)
          })
        }
      },
      dragstart: function (ev, menu) {
        ev.stopPropagation()
        ev.dataTransfer.effectAllowed = 'move'
        ev.dataTransfer.setData('moveid', this.nodeInfo.id)
        ev.dataTransfer.setData('dragPos', JSON.stringify({
          x: ev.offsetX,
          y: ev.offsetY
        }))
        ev.dataTransfer.setDragImage(ev.target, ev.offsetX, ev.offsetY)
      },
      dragend: function (ev, menu) {
        ev.stopPropagation()
      },
      /**
       * 拖动释放元素，
       */
      drop: function (ev) {
        ev.stopPropagation()
        ev.preventDefault()
        this.dragentered = false
        if (this.nodeInfo.leaf) return this.$alert('不能为目标节点添加子组件')
        if (this.nodeInfo.childLimit && this.nodeInfo.child && this.nodeInfo.child.length >= this.nodeInfo.childLimit) return this.$alert(`目标节点最多可添加${this.nodeInfo.childLimit}个子组件，已达限额`)
        // 对孩子数组进行初始化
        if (!this.nodeInfo.child) {
          this.$set(this.nodeInfo, 'child', [])
        }
        // 处理计算新元素的位置信息
        var currNodePos = this.$el.getBoundingClientRect()
        var mousePos = {
          top: ev.pageY,
          left: ev.pageX
        }
        var dragPos = ev.dataTransfer.getData('dragPos')
        // 获取拖动元素鼠标相对元素的位置信息
        try {
          dragPos = JSON.parse(dragPos)
        } catch (e) {
          dragPos = {x: 0, y: 0}
        }
        var targetPos = {
          top: (mousePos.top - currNodePos.top - dragPos.y) + 'px',
          left: (mousePos.left - currNodePos.left - dragPos.x) + 'px'
        }
        var moveId = ev.dataTransfer.getData('moveid')

        if (moveId) {
          // 内部组件移动
          if (moveId != this.nodeInfo.id) {
            // 拖动到其他组件内部
            this.ema.fire('move.node', moveId, this.nodeInfo, targetPos)
          } else {
          }
        } else {
          // 添加新的组件内容
          var componentInfo = JSON.parse(ev.dataTransfer.getData('componentInfo'))
          if (componentInfo.name) {
            var nodeInfo = getBaseNode(componentInfo)
            // 暂时不添加left top 到style
            nodeInfo.forceStyle = {
              left: targetPos.left,
              top: targetPos.top,
            }
            // 如果给page容器添加孩子元素。孩子元素需要占满全屏
            if ((/pageContainer$/i).test(this.nodeInfo.type)) {
              nodeInfo.forceStyle = {
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: '0',
                top: '0'
              }
            }
            this.nodeInfo.child.push(nodeInfo)
            this.$nextTick(() => {
              this.ema.fire('select.one', nodeInfo.id)
            })
          }
        }
      },
      /**
       * 移动指定的孩子元素到下一位置。修改孩子节点在数组中位置信息
       * @augments node 孩子节点元素
       * @augments step 移动数量  1：上移，-1:下移 0:底部 Number.MAX_VALUE:顶层
       */
      moveLayer: function (node, step) {
        var childs = this.nodeInfo.child
        var index = childs.indexOf(node)
        if (index != -1) {
          if (step == Number.MAX_VALUE) {
            step = childs.length - 1 - index
          } else if (step == Number.MIN_VALUE) {
            step = -index
          }
          var targetIndex = index + step
          if (targetIndex < 0 || targetIndex > childs.length - 1) return
          var info = childs.splice(index, 1)[0]
          childs.splice(targetIndex, 0, Object.assign({}, info))
        }
      },
      copyChild: function (node, {isJson, keepPos}) {
        console.log('copyChild')
        if (!this.nodeInfo.child) {
          this.$set(this.nodeInfo, 'child', [])
        }
        var childs = this.nodeInfo.child
        var cloneNode = !isJson ? cloneDeep(node) : JSON.parse(node)
        var left
        var top
        var unit
        if (!keepPos && cloneNode.style.left) {
          left = parseInt(cloneNode.style.left)
          unit = String(cloneNode.style.left).replace(/^[-\d.]+/, '')
          cloneNode.style.left = left + (unit == '%' ? 2 : 20) + unit
        }
        if (!keepPos && cloneNode.style.top) {
          top = parseInt(cloneNode.style.top)
          unit = String(cloneNode.style.top).replace(/^[-\d.]+/, '')
          cloneNode.style.top = top + (unit == '%' ? 2 : 20) + unit
        }
        // randomid
        cloneNode = modifyNodeId(cloneNode, Object.keys(window.$_nodecomponents || {}))
        childs.push(cloneNode)
        console.log('childs', childs)
      },
      copyStyle () {
        var style = {...this.nodeInfo.style}
        window.$copyedStyle = style
      },
      pasteStyle () {
        if (!window.$copyedStyle) return
        var style = window.$copyedStyle
        this.nodeInfo.style = Object.assign(this.nodeInfo.style, style)
      },
      isNodeRegisted (tag) {
        return Boolean(Vue.component(tag))
      }
    }
  }
</script>

