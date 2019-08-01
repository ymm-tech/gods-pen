<template>
  <div class="styleEditorWarp">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="宽度" name="width">
        <el-form size="mini" label-position="left" label-width="50px" :model="info">
          <el-form-item>
            <slot name='label'>
              <span class="openDetail" @click="detail1=!detail1">展开</span>
            </slot>
            <num :styleAttr.sync="info['border-width']" :min="0" :max="50"></num>
          </el-form-item>
          <div v-if='detail1'>
            <el-form-item label="顶部:">
              <num :styleAttr.sync="info['border-top-width']" :min="0" :max="50"></num>
            </el-form-item>
            <el-form-item label="右边:">
              <num :styleAttr.sync="info['border-right-width']" :min="0" :max="50"></num>
            </el-form-item>
            <el-form-item label="底部:">
              <num :styleAttr.sync="info['border-bottom-width']" :min="0" :max="50"></num>
            </el-form-item>
            <el-form-item label="左边:">
              <num :styleAttr.sync="info['border-left-width']" :min="0" :max="50"></num>
            </el-form-item>
          </div>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="样式" name="style">
        <el-form size="mini" label-position="left" label-width="50px" :model="info">
          <el-form-item>
            <slot name='label'>
              <span class="openDetail" @click="detail2=!detail2">展开</span>
            </slot>
            <el-select v-model="info['border-style']" placeholder="边框类型">
              <el-option v-for='item in Metadata.style.borderStyle' :key="item.value" :label="item.label || item.value" :value="item.value" :title="item.desc">
                <span style="float: left">{{ item.label || item.value }}</span>
                <a style="float: right; font-size: 13px;" class="iconfont icon-info-light" :title="item.desc"></a>
              </el-option>
            </el-select>
          </el-form-item>
          <div v-if='detail2'>
            <el-form-item label="顶部:">
              <el-select v-model="info['border-top-style']" placeholder="边框类型">
                <el-option v-for='item in Metadata.style.borderStyle' :key="item.value" :label="item.label || item.value" :value="item.value" :title="item.desc">
                  <span style="float: left">{{ item.label || item.value }}</span>
                  <a style="float: right; font-size: 13px;" class="iconfont icon-info-light" :title="item.desc"></a>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="右边:">
              <el-select v-model="info['border-right-style']" placeholder="边框类型">
                <el-option v-for='item in Metadata.style.borderStyle' :key="item.value" :label="item.label || item.value" :value="item.value" :title="item.desc">
                  <span style="float: left">{{ item.label || item.value }}</span>
                  <a style="float: right; font-size: 13px;" class="iconfont icon-info-light" :title="item.desc"></a>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="底部:">
              <el-select v-model="info['border-bottom-style']" placeholder="边框类型">
                <el-option v-for='item in Metadata.style.borderStyle' :key="item.value" :label="item.label || item.value" :value="item.value" :title="item.desc">
                  <span style="float: left">{{ item.label || item.value }}</span>
                  <a style="float: right; font-size: 13px;" class="iconfont icon-info-light" :title="item.desc"></a>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="左边:">
              <el-select v-model="info['border-left-style']" placeholder="边框类型">
                <el-option v-for='item in Metadata.style.borderStyle' :key="item.value" :label="item.label || item.value" :value="item.value" :title="item.desc">
                  <span style="float: left">{{ item.label || item.value }}</span>
                  <a style="float: right; font-size: 13px;" class="iconfont icon-info-light" :title="item.desc"></a>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="颜色" name="color">
        <el-form size="mini" label-position="left" label-width="50px" :model="info">
          <el-form-item>
            <slot name='label'>
              <span class="openDetail" @click="detail3=!detail3">展开</span>
            </slot>
            <y-color-picker v-model="info['border-color']"  show-alpha></y-color-picker>
          </el-form-item>
          <div v-if='detail3'>
            <el-form-item label="顶部:">
              <y-color-picker v-model="info['border-top-color']" show-alpha></y-color-picker>
            </el-form-item>
            <el-form-item label="右边:">
              <y-color-picker v-model="info['border-right-color']" show-alpha></y-color-picker>
            </el-form-item>
            <el-form-item label="底部:">
              <y-color-picker v-model="info['border-bottom-color']" show-alpha></y-color-picker>
            </el-form-item>
            <el-form-item label="左边:">
              <y-color-picker v-model="info['border-left-color']" show-alpha></y-color-picker>
            </el-form-item>
          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .styleEditorWarp {
    padding: 0 10px;

    h4 {
      position: relative;
      left: -10px;
      margin-bottom: 3px;
      border-bottom: 1px solid #dddddd;
      width: 100%;
      padding-bottom: 5px;
    }
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
  import YColorPicker from './ColorPicker'
  import Num from './Num'

  export default {
    mixins: [BaseComponent],
    name: 'StyleBorder',
    components: {Num, YColorPicker},

    props: {
      info: {
        required: true,
        type: Object
      }
    },
    data: function () {
      return {
        activeNames: ['width', 'color', 'style'],
        detail1: false,
        detail2: false,
        detail3: false
      }
    },
    methods: {
      handleClick (tab, event) {
      }
    }
  }
</script>

