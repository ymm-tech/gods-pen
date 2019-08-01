<template>
  <div class="styleEditorWarp">
    <el-form size="mini" label-position="left" label-width="50px" :model="info">
      <el-form-item label="定位">
        <el-select v-model="info.position" placeholder="定位类型">
          <el-option v-for='item in Metadata.style.position' :key="item.value" :label="item.label || item.value" :value="item.value" :title="item.desc">
            <span style="float: left">{{ item.label || item.value }}</span>
            <a style="float: right; font-size: 13px;" class="iconfont icon-info-light" :title="item.desc"></a>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="层级">
        <el-input size="mini" type="number" v-model.number="info['z-index']" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="顶部">
        <num :styleAttr.sync="info.top" :min="-900" :max="900"></num>
      </el-form-item>
      <el-form-item label="右边">
        <num :styleAttr.sync="info.right" :min="-900" :max="900"></num>
      </el-form-item>
      <el-form-item label="底部">
        <num :styleAttr.sync="info.bottom" :min="-900" :max="900"></num>
      </el-form-item>
      <el-form-item label="左边">
        <num :styleAttr.sync="info.left" :min="-900" :max="900"></num>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .styleEditorWarp {
    padding: 0 10px;
  }
</style>
<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import Num from './Num'

  export default {
    mixins: [BaseComponent],
    name: 'StyleSize',
    components: {Num},
    props: {
      info: {
        required: true,
        type: Object
      }
    },
    data: function () {
      return {
      }
    },
    methods: {
      handleClick (tab, event) {
      }
    }
  }
</script>

