<template>
  <div class="styleEditor">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="大小" name="size">
        <el-form size="mini" label-position="left" label-width="80px" :model="info">
          <el-form-item label="宽">
            <num onlypx :styleAttr.sync="info.width" :max="900"></num>
          </el-form-item>
          <el-form-item label="高">
            <num onlypx :styleAttr.sync="info.height"></num>
          </el-form-item>
          <el-form-item label="最大宽度">
            <num onlypx :styleAttr.sync="info['max-width']" :max="900"></num>
          </el-form-item>
          <el-form-item label="最大高度">
            <num onlypx :styleAttr.sync="info['max-height']"></num>
          </el-form-item>
          <el-form-item label="最小宽度">
            <num onlypx :styleAttr.sync="info['min-width']" :max="900"></num>
          </el-form-item>
          <el-form-item label="最小高度">
            <num onlypx :styleAttr.sync="info['min-height']"></num>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="位置" name="position">
        <el-form size="mini" label-position="left" label-width="80px" :model="info">
          <el-form-item label="模式">
            <el-select v-model="info.position" placeholder="定位类型">
              <el-option v-for="item in ['relative', 'absolute']" :key="item" :label="item" :value="item" :title="item">
                <span style="float: left">{{ item }}</span>
                <a style="float: right; font-size: 13px;" class="iconfont icon-info-light" :title="item"></a>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="left">
            <num onlypx :styleAttr.sync="info.left"></num>
          </el-form-item>
          <el-form-item label="top">
            <num onlypx :styleAttr.sync="info.top" :max="900"></num>
          </el-form-item>
          <el-form-item label="right">
            <num onlypx :styleAttr.sync="info.right"></num>
          </el-form-item>
          <el-form-item label="bottom">
            <num onlypx :styleAttr.sync="info.bottom"></num>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="背景" name="background">
        <el-form size="mini" label-position="left" label-width="80px" :model="info">
          <el-form-item label="图片">
            <resource type="image" :url.sync="backgroundImage"></resource>
          </el-form-item>
          <el-form-item label="颜色">
            <el-color-picker v-model="info['background-color']" show-alpha></el-color-picker>
          </el-form-item>
          <template v-if="backgroundImage">
            <el-form-item label="repeat">
              <el-select v-model="info['background-repeat']">
                <el-option v-for="item in backgroundRepeat" :key="item.val" :label="item.desc" :value="item.val"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="size">
              <el-select v-model="info['background-size']">
                <el-option v-for="item in backgroundSize" :key="item.val" :label="item.desc" :value="item.val"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="position">
              <el-select v-model="info['background-position']">
                <el-option v-for="item in backgroundPosition" :key="item.val" :label="item.desc" :value="item.val"></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="内边距" name="padding">
        <el-form size="mini" label-position="left" label-width="80px" :model="info">
          <el-form-item label="top">
            <num onlypx :styleAttr.sync="info['padding-top']" :min="0" :max="50"></num>
          </el-form-item>
          <el-form-item label="right">
            <num onlypx :styleAttr.sync="info['padding-right']" :min="0" :max="50"></num>
          </el-form-item>
          <el-form-item label="bottom">
            <num onlypx :styleAttr.sync="info['padding-bottom']" :min="0" :max="50"></num>
          </el-form-item>
          <el-form-item label="left">
            <num onlypx :styleAttr.sync="info['padding-left']" :min="0" :max="50"></num>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="外边距" name="margin">
        <el-form size="mini" label-position="left" label-width="80px" :model="info">
          <el-form-item label="top">
            <num onlypx :styleAttr.sync="info['margin-top']" :min="0" :max="50"></num>
          </el-form-item>
          <el-form-item label="right">
            <num onlypx :styleAttr.sync="info['margin-right']" :min="0" :max="50"></num>
          </el-form-item>
          <el-form-item label="bottom">
            <num onlypx :styleAttr.sync="info['margin-bottom']" :min="0" :max="50"></num>
          </el-form-item>
          <el-form-item label="left">
            <num onlypx :styleAttr.sync="info['margin-left']" :min="0" :max="50"></num>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="边框" name="border">
        <el-form size="mini" label-position="left" label-width="80px" :model="info">
          <el-form-item label="宽度">
            <num onlypx :styleAttr.sync="info['border-width']" :min="0" :max="50"></num>
          </el-form-item>
          <el-form-item label="样式">
            <el-select v-model="info['border-style']" placeholder="边框样式">
              <el-option v-for='item in borderStyle' :key="item.val" :label="item.desc" :value="item.val"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="颜色">
            <el-color-picker v-model="info['border-color']" show-alpha></el-color-picker>
          </el-form-item>
          <el-form-item label="圆角">
            <num onlypx :styleAttr.sync="info['border-radius']" :max="500"></num>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
.styleEditor {
  .input {
    width: 68px;
  }
  .slider {
    width: 90px;
    float: left;
    margin-right: 15px;
    margin-left: 10px;
    position: relative;
    bottom: 5px;
    display: inline-block;
  }
}

</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import Resource from '../attr/Resource'
  import Num from './Num'

  const CONSTANT = {
    backgroundSize: [
      {val: 'contain', desc: 'contain'},
      {val: 'cover', desc: 'cover'},
      {val: 'none', desc: 'none'},
      {val: 'scaleDown', desc: 'scaleDown'},
      {val: '100% 100%', desc: 'fill'},
      {val: '100% auto', desc: 'fitWidth'},
      {val: 'auto 100%', desc: 'fitHeight'},
    ],
    backgroundRepeat: [
      {val: 'repeat', desc: 'repeat'},
      {val: 'repeat-x', desc: 'repeat-x'},
      {val: 'repeat-y', desc: 'repeat-y'},
      {val: 'no-repeat', desc: 'no-repeat'},
    ],
    backgroundPosition: [
      {val: 'left top', desc: 'left top'},
      {val: 'center top', desc: 'center top'},
      {val: 'right top', desc: 'right top'},
      {val: 'left center', desc: 'left center'},
      {val: 'center', desc: 'center'},
      {val: 'center center', desc: 'center center'},
      {val: 'right center', desc: 'right center'},
      {val: 'left bottom', desc: 'left bottom'},
      {val: 'center bottom', desc: 'center bottom'},
      {val: 'right bottom', desc: 'right bottom'},
    ],
    borderStyle: [
      {val: 'solid', desc: 'solid'},
      {val: 'none', desc: 'none'},
    ]
  }

  export default {
    mixins: [BaseComponent],
    name: 'BaseStyleEditor',
    components: {Num, Resource},
    props: {
      info: {
        required: true,
        type: Object
      },
      nodeId: {
        type: String
      }
    },
    data: function () {
      return {
        activeNames: ['size', 'position', 'border', 'align', 'background', 'border', 'padding', 'margin', 'text'],
        backgroundSize: CONSTANT.backgroundSize,
        backgroundRepeat: CONSTANT.backgroundRepeat,
        backgroundPosition: CONSTANT.backgroundPosition,
        borderStyle: CONSTANT.borderStyle
      }
    },
    computed: {
      backgroundImage: {
        get: function () {
          var newVal = this.info['background-image']
          return newVal ? newVal.replace(/url\(['"\s]*(.+?)['"\s]*\)/, '$1') : null
        },
        set: function (newVal) {
          if (newVal) {
            this.$set(this.info, 'background-image', `url('${newVal}')`)
          } else {
            this.$set(this.info, 'background-image', null)
          }
        }
      }
    },
    watch: {
    },
    mounted: function () {},
    methods: {
    }
  }
</script>

