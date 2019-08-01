<template>
  <div class="styleEditorWarp">
    <el-form size="mini" label-position="left" label-width="50px" :model="info">
      <el-form-item label="字体:">
        <el-select v-model="info['font-family']" placeholder="字体">
          <el-option v-for='item in Metadata.style.fontFamily' :key="item.value" :label="item.label || item.value" :value="item.value" :title="item.desc">
            <span style="float: left">{{ item.label || item.value }}</span>
            <a style="float: right; font-size: 13px;" class="iconfont icon-info-light"></a>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对齐:">
        <el-select v-model="info['text-align']" placeholder="对齐方式">
          <el-option v-for='item in Metadata.style.textAlign' :key="item.value" :label="item.label || item.value" :value="item.value" :title="item.desc">
            <span style="float: left">{{ item.label || item.value }}</span>
            <a style="float: right; font-size: 13px;" class="iconfont icon-info-light"></a>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="加粗:">
        <el-select v-model="info['font-weight']" placeholder="加粗大小">
          <el-option v-for='item in Metadata.style.fontWeight' :key="item.value" :label="item.desc || item.value" :value="item.value" :title="item.desc">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字号:">
        <num :styleAttr.sync="info['font-size']" :min="10" :max="100"></num>
      </el-form-item>
      <el-form-item label="行高:">
        <num :styleAttr.sync="info['line-height']" :max="100"></num>
      </el-form-item>
      <el-form-item label="颜色:">
        <y-color-picker v-model="info['color']" show-alpha></y-color-picker>
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
  import YColorPicker from './ColorPicker'

  export default {
    mixins: [BaseComponent],
    name: 'StyleText',
    components: {Num, YColorPicker},
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

