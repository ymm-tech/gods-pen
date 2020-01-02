<template>
  <div class="timeLineNode">
    <div v-if="level!=0" class="cellItem"   @click="selectOne" @contextmenu.prevent.stop="showContextMenu(info,$event)" :class="{active:isActive}">
      <div class="cellItemWarp" >
        <cell  v-for="(animate,i) in info.animate" :key="i" :animates="info.animate" :info="animate" :time-space="timeSpace"></cell>
      </div>
        <el-tooltip class="item" effect="dark" content="插入动画" placement="top">
          <i class="addFrame el-icon-circle-plus" v-if="info.animate==null||info.animate.length==0"  @click="addFrame($event,info)" />
        </el-tooltip>
    </div>
    <div class="ced">
      <template v-for="item in info.child" >
        <time-line-node :key="item.id" :info="item" :level="level+1" :time-space="timeSpace"></time-line-node>
      </template>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .timeLineNode {
    position: relative;
    font-size: 16px;

    .cellItem {
      background-color: #282929;
      color: #838383;
      cursor: pointer;
      position: relative;
      height: 30px;
      text-align: left;
      vertical-align: middle;

      .cellItemWarp {
        background-color: #131313;
        border-radius: 5px;
        display: inline-block;
        overflow: hidden;
        cursor: grab;
      }

      &:hover {
        background-color: #31343c;
        color: #faad13;
      }

      &.active {
        background-color: #31343c;
        color: #faad13;
      }

      .label {
        align-items: left;
        margin-left: 2px;
        font-size: 12px;
        vertical-align: middle;
        line-height: 30px;
        text-shadow: 1px 1px 0px #000;
      }

      .addFrame {
        position: absolute;
        top: 3px;
        left: 0px;
        font-size: 12px;
        margin: auto 20px;

        &:hover {
          color: #faad14;
        }
      }
    }

    .ced {
    }
  }
</style>
<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import BaseNode from 'src/extend/BaseNode'
  import cloneDeep from 'lodash/cloneDeep'
  import Cell from './Cell'

  export default {
    mixins: [BaseNode, BaseComponent],
    name: 'timeLineNode',
    components: {Cell},
    props: {
      info: {
        required: true,
        type: Object
      },
      level: {
        default: 0
      },
      timeSpace: {
        type: Object,
        default () {
          return {
            num: 5,
            length: 18
          }
        }
      }
    },
    data: function () {
      return {
        isActive: false,
        showAddFramePos: null,
      }
    },
    watch: {
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
      }
    },
    computed: {

      // ...mapState({
      //   Config: state => state.Config,
      //   Metadata: state => state.Metadata,
      //   app: state => state.app,
      //   DataHub: state => state.DataHub,
      // })
    },
    beforeDestroy: function () {
    },

    mounted () {
      this.isActive = window.$vue && window.$vue.nodeInfo.id == this.info.id
      this.ema.bind('select.one', (id, keepContextMenu) => {
        if (id != this.info.id) {
          this.isActive = false
        } else {
          this.isActive = true
        }
      })
      this.ema.bind('select.noOne', () => {
        this.isActive = false
      })
    },
    methods: {
      selectOne () {
        this.ema.fire('select.one', this.info.id)
      },
      timelineMousemove (ev) {
        // this.ema.fire('timelineNode.mousemove', ev)
      },
      /**
       * 显示右键菜单
       */
      showContextMenu: function (info, event) {
        console.log(event)
        this.showAddFramePos = event.offsetX
      },
      addFrame (ev, info) {
        info.animate.push({
          type: '',
          duration: 1,
          delay: 0,
          countNum: 1,
          infinite: false
        })
        this.showAddFramePos = null
      }
    }
  }
</script>

