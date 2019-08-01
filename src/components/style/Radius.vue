<template>
  <div class="styleEditorWarp">
    <el-form size="mini" label-position="left" label-width="50px" :model="info">
      <el-form-item>
        <slot name='label'>
          <span class="openDetail" @click="detail1=!detail1">展开</span>
        </slot>
        <num :styleAttr.sync="info['border-radius']" :max="100"></num>
      </el-form-item>
      <div v-if='detail1'>

        <el-form-item label="左上角:">
          <num :styleAttr.sync="info['border-top-left-radius']" :max="100"></num>
        </el-form-item>
        <el-form-item label="右上角:">
          <num :styleAttr.sync="info['border-top-right-radius']" :max="100"></num>
        </el-form-item>
        <el-form-item label="右下角:">
          <num :styleAttr.sync="info['border-bottom-right-radius']" :max="100"></num>
        </el-form-item>
        <el-form-item label="左下角:">
          <num :styleAttr.sync="info['border-bottom-left-radius']" :max="100"></num>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .styleEditorWarp {
    padding: 0 10px;
  }

  .openDetail {
    position: absolute;
    left: -42px;
    top: 0;
    cursor: pointer;

    &:hover {
      color: #409EFF;
    }
  }
</style>
<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import Num from './Num'

  export default {
    mixins: [BaseComponent],
    name: 'StyleRadius',
    components: {Num},
    props: {
      info: {
        required: true,
        type: Object
      }
    },
    data: function () {
      return {
        detail1: false
      }
    },
    methods: {
      handleClick (tab, event) {
      }
    }
  }
</script>

