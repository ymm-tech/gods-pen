<template>
  <div class="animateLayerNode">
    <div v-if="level!=0" class="cellItem" @click="selectOne" :class="{active:isActive}">
      <div class="label">
        <div class="space" :style="spaceStyle"> </div>
        {{info.label}}
      </div>
    </div>
    <div class="ced">
      <template>
        <animate-layer-node v-for="item in info.child" :key="item.id" :info="item" :level="level+1"></animate-layer-node>
      </template>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .animateLayerNode {
    position: relative;
    font-size: 16px;

    .cellItem {
      background-color: #282929;
      color: #838383;
      cursor: pointer;
      position: relative;
      width: 100%;
      height: 30px;
      text-align: left;
      vertical-align: middle;

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

        .space {
          display: inline-block;
        }
      }
    }

    .ced {
      background-color: #526ede;
    }
  }
</style>
<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import BaseNode from 'src/extend/BaseNode'
  import cloneDeep from 'lodash/cloneDeep'

  export default {
    mixins: [BaseNode, BaseComponent],
    name: 'animateLayerNode',
    props: {
      info: {
        required: true,
        type: Object
      },
      level: {
        default: 0
      }
    },
    data: function () {
      return {
        isActive: false
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
      spaceStyle () {
        return {
          width: this.level * 10 + 'px'
        }
      },

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
      }
    }
  }
</script>

