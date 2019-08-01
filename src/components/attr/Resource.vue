<template>
  <div :class='{"img-attr": type=="image"}'>
    <el-input placeholder="选择资源" size="mini" v-model="inUrl">
      <el-button slot="append" icon="el-icon-upload" @click="selectImage">选择</el-button>
    </el-input>
    <img :src='inUrl' v-if='type=="image"' class='img-show'/>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .richTextEditor {
    padding: 0 10px;

    .collapseItem {
      position: relative;
    }

    .header-icon {
      position: absolute;
      right: 30px;
      top: 18px;
    }
  }
  .img-attr{
    position relative
    display flex
    align-items: center
    .img-show{
      margin 0 20px
      max-width 50px
      max-height 50px
    }
  }
</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  export default {
    mixins: [BaseComponent],
    name: 'ResourceEditor',
    components: {},
    props: {
      url: {
        type: String
      },
      type: {
        type: String,
        default: 'image'
      }
    },
    watch: {
      url: function (newVal, oldVal) {
        this.inUrl = newVal
      },
      inUrl: function (newVal) {
        this.$emit('update:url', newVal)
      }
    },
    data: function () {
      return {
        inUrl: this.url
      }
    },
    mounted: function () {
    },
    methods: {
      selectImage: function () {
        var me = this
        this.openDialog({
          name: 'd-resourceSelect',
          data: {
            type: me.type
          },
          methods: {
            onSelectImage: function (url) {
              me.inUrl = url
            }
          }
        })
      }
    }
  }
</script>

