<template>
  <div class="node" v-show="visible" :class="{active:isActive}" :style="computedStyle">
    <component :is="currPage" v-bind="nodeInfo.props" :ref="nodeInfo.id">
      <template slot="ListContainer" v-if="isListContainer" slot-scope="listCell">
        <prenode :info="nodeChild[0]" :scope="listCell"></prenode>
      </template>
      <template v-if="isPageContainer">
        <prenode slot="PageContainer" :scope="scope" :info="item" v-for="item in nodeChild" :key="item.id"></prenode>
      </template>
      <template v-if="nodeInfo.child && !!slots">
        <prenode v-for="(item,index) in nodeInfo.child" :slot-style='slots(index) && slots(index).style' :slot="slots(index) && slots(index).name" :key="item.id" :stacked='nodeInfo.stack' :scope="scope" :info="item"></prenode>
      </template>
    </component>
    <template v-if="hasChild && !isListContainer && !isPageContainer && !slots">
      <prenode v-for="item in nodeInfo.child" :key="item.id" :stacked='nodeInfo.stack' :scope="scope" :info="item"></prenode>
    </template>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .node {
    position: relative;
    font-size 16px;
    &::before {
      content: ''
      display: block;
      overflow: hidden;
      height: 0;
      width: 1px;
    }
  }
</style>
<script type="text/ecmascript-6">
  import cLoader from 'src/extend/componentLoader'
  import BaseComponent from 'src/extend/BaseComponent'
  import BaseNode from 'src/extend/BaseNode'
  import cloneDeep from 'lodash/cloneDeep'
  import Vue from 'vue'

  export default {
    mixins: [BaseNode, BaseComponent],
    name: 'prenode',
    props: {
      scope: {
        type: Object
      },
      stacked: {
        type: Boolean,
        default: true
      },
      info: {
        required: true,
        type: Object
      },
      slotStyle: {
        type: Object,
        default: null
      }
    },
    data: function () {
      return {
        oldId: '',
        isActive: false,
        currPage: '',
        oldStyle: {},
        nodeInfo: (() => {
          if (this.scope) {
            return cloneDeep(this.info)
          } else {
            return this.info
          }
        })(),
        slots: this.info.hasSlot ? (i) => `slot${i}` : false
      }
    },
    watch: {
      'nodeInfo.visible': function (val, old) {
        if (old === false && val) {
          this.doAfterMounted()
        }
      },
      info: {
        deep: true,
        handler: function (newVal) {
          var info = {}
          if (this.scope) {
            info = cloneDeep(newVal)
          } else {
            info = newVal
          }
          this.nodeInfo = info
        }
      },
      scope: {
        handler: function (val) {
          if (!val) return
          this.$nextTick(this.passScopeToComponentInstance)
        },
        deep: true
      }
    },
    computed: {
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
      },
      nodeChild () {
        return this.nodeInfo.child || []
      },
      hasChild () {
        return this.nodeChild && this.nodeChild.length > 0
      },
      isListContainer () {
        return this.nodeInfo && this.nodeInfo.type.indexOf('ListContainer') > -1
      },
      isPageContainer () {
        return this.nodeInfo && this.nodeInfo.type.indexOf('PageContainer') > -1
      },
    },
    beforeDestroy: function () {
      delete window.$_nodePrecomponents[this.oldId]
    },
    mounted () {
      this.oldId = this.nodeInfo.id
      this.registerNodeToGlobal()
      this.doLoad()
    },
    methods: {
      cloneDeep: cloneDeep,
      initNodeEvent () {
        var me = this
        if (this.initEvented) return
        this.initEvented = true
        this.nodeInfo.events && this.nodeInfo.events.forEach(element => {
          me.getComponent(me.nodeInfo.id, true).$el.addEventListener(element.event, (event) => {
            me.getComponent(me.nodeInfo.id, true).oncallExecute(element.callList, [event])
          })
        })
      },
      /**
      * 获取组件对象
      * @param {String} id  组件id
      * @param {boolean} child 是否获取组件内部元素
      */
      getComponent (id, child) {
        var component = window.$_nodePrecomponents[id]
        if (child && component) {
          return component.$refs[id]
        }
        return component
      },
      registerNodeToGlobal () {
        window.$_nodePrecomponents = window.$_nodePrecomponents || {}
        window.$_nodePrecomponents[this.nodeInfo.id] = this
      },
      passScopeToComponentInstance () {
        let scope = this.scope
        let $childInstance = this.$refs[this.nodeInfo.id]
        scope && $childInstance && $childInstance.$set($childInstance.$data, 'inscope', scope.data || scope)
      },
      async doLoad () {
        if (this.nodeInfo.type === 'node') return
        const component = await cLoader.load(this.nodeInfo)
        this.slots = this.calcSlots(component, this.nodeInfo.props)
        if (!this.isNodeRegisted(this.nodeInfo.id)) {
          this.registerNode(this.nodeInfo)
        }
        this.currPage = this.nodeInfo.id
        this.doAfterMounted()
      },
      doAfterMounted () {
        this.$nextTick(() => {
          this.passScopeToComponentInstance()
          this.runAnimate()
          this.initNodeEvent()
        })
      },
      isNodeRegisted (tag) {
        return Boolean(Vue.component(tag))
      },
      isNodeStartRegiste (tag) {
        return tag in (window.$_nodePrecomponents || {})
      }
    }
  }
</script>

