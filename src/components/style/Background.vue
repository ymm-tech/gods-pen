<template>
  <div class="styleEditorWarp">
    <el-form size="mini" label-position="left" label-width="70px" :model="info">
      <el-form-item label="图片">
        <resource type="image" :url.sync="backgroundImage"></resource>
      </el-form-item>
      <el-form-item label="填充" v-show="backgroundImage">
        <el-select v-model="backgroundFill" placeholder="填充方式">
          <el-option
            v-for="item in Metadata.style.backgroundFill"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :title="item.desc">
            <span style="float: left">{{ item.label }}</span>
            <a style="float: right; font-size: 13px;" class="iconfont icon-info-light" :title="item.desc"></a>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="颜色">
        <y-color-picker v-model="info['background-color']" show-alpha></y-color-picker>
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
  import YColorPicker from './ColorPicker'
  import Resource from '../attr/Resource'

  export default {
    mixins: [BaseComponent],
    name: 'StyleBackground',
    components: {Resource, YColorPicker},
    props: {
      info: {
        required: true,
        type: Object
      }
    },
    data: function () {
      return {
        backgroundFill: ''
      }
    },
    watch: {
      info () {
        this.backgroundFill = ''
      },
      backgroundFill (val, pre) {
        if (!val) return
        this.transferFillToCss(val)
      }
    },
    computed: {
      backgroundImage: {
        get: function () {
          var newVal = this.info['background-image']
          if (newVal) {
            return newVal.replace(/url\(['"\s]*(.+?)['"\s]*\)/, '$1')
          }
          return ''
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
    methods: {
      colorChange: function (e) {
        if (e == 'transparent') {
          e = 'rgba(0, 0, 0, 0)'
        }
        this.info['background-color'] = e
      },
      transferFillToCss (fillType) {
        var info = this.resetBg()
        switch (fillType) {
          case 'repeat':
            info['background-repeat'] = 'repeat'
            break
          case 'repeat-x':
            info['background-repeat'] = 'repeat-x'
            info['background-size'] = 'auto 100%'
            break
          case 'repeat-y':
            info['background-repeat'] = 'repeat-y'
            info['background-size'] = '100% auto'
            break
          case 'contain':
            info['background-size'] = 'contain'
            break
          case 'center':
            info['background-size'] = 'contain'
            info['background-position'] = 'center center'
            break
          case 'cover':
            info['background-size'] = 'cover'
            info['background-position'] = 'center center'
            break
          case 'stretch':
            info['background-size'] = '100% 100%'
            info['background-position'] = '0 0'
            break
        }
        this.$reactiveSet(this.info, info)
      },
      resetBg () {
        var info = {}
        var dontBeHere = ['background-position-x', 'background-position-y', 'background-size-x', 'background-size-y']
        this.$reactiveDelete(this.info, dontBeHere)
        info['background-repeat'] = 'no-repeat'
        info['background-position'] = '0 0'
        info['background-size'] = 'auto auto'
        return info
      }
    }
  }
</script>

