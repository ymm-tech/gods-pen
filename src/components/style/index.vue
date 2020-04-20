<template>
  <div class="styleEditor">
    <editor-advanced :node-id='nodeId' v-if="info" :info="info"></editor-advanced>
    <i v-else class="iconfont icon-nodata nodata"></i>
    <div class="forbid-edit-mask" v-show="forbidEdit"></div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .styleEditor {
    height 100%
    position: relative;
    padding-top: 5px;
  }
</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import EditorAdvanced from './Advanced'

  export default {
    mixins: [BaseComponent],
    name: 'StyleEditor',
    components: {EditorAdvanced},
    props: {
      active: {
        type: [Number, Boolean],
        default: 0
      }
    },
    data: function () {
      return {
        info: null,
        forbidEdit: false,
        nodeId: null
      }
    },
    watch: {
      isBase: function (newVal) {
        window.localStorage.setItem('editorStyleStatus', newVal)
      },
      active: function (params) {
        if (this.active) {
          this.info = window.$vue && window.$vue.nodeInfo.style
          this.nodeId = window.$vue && window.$vue.nodeInfo.id
        }
      }
    },
    mounted: function () {
      let me = this
      this.info = window.$vue && window.$vue.nodeInfo.style
      this.nodeId = window.$vue && window.$vue.nodeInfo.id
      this.ema.bind('select.oneInfo', ({vm}) => {
        me.info = vm.nodeInfo.style
        me.nodeId = vm.nodeInfo.id
      })
      this.ema.bind('edit-type.change', type => {
        this.forbidEdit = type !== 'EDITOR'
      })
      this.ema.bind('select.noOne', () => {
        this.info = null
        this.nodeId = null
      })
    },
    methods: {
    }
  }
</script>

