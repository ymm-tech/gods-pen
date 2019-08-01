<template>
  <div class="styleEditorWarp">
    <el-form size="mini" label-position="left" label-width="50px" :model="info">
      <el-form-item label="宽">
        <num :styleAttr.sync="info.width" :max="900"></num>
      </el-form-item>
      <el-form-item label="高">
        <num :styleAttr.sync="info.height"></num>
      </el-form-item>
      <el-form-item label="溢出">
        <el-select v-model="info['overflow']" placeholder="超出内容处理">
          <el-option v-for='item in Metadata.style.overflow' :key="item.value" :label="item.label || item.value" :value="item.value" :title="item.desc">
            <span style="float: left">{{ item.label || item.value }}</span>
            <a style="float: right; font-size: 13px;" class="iconfont icon-info-light" :title="item.desc"></a>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="显示">
        <el-select v-model="info['display']" placeholder="内部元素布局">
          <el-option v-for='item in Metadata.style.display' :key="item.value" :label="item.label || item.value" :value="item.value" :title="item.desc">
            <span style="float: left">{{ item.label || item.value }}</span>
            <a style="float: right; font-size: 13px;" class="iconfont icon-info-light"></a>
          </el-option>
        </el-select>
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
    mounted: function () {
    },
    methods: {
      handleClick (tab, event) {
      }
    }
  }
</script>

