<template>
  <div class="tool" fixed-tool="" @mousedown.stop="" @mouseup.stop="" @mousemove.stop="">
    <el-popover ref="popover4" placement="right" width="180" trigger="click">
      <el-form :model="setting" size="mini" label-width="90px">
        <!-- <el-form-item label="网格开关">
          <el-switch v-model="setting.open"></el-switch>
        </el-form-item> -->
        <el-form-item label="参考线颜色">
          <el-color-picker v-model="setting.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="智能参考线">
          <el-switch v-model="setting.line"></el-switch>
        </el-form-item>
        <el-form-item label="吸附效果">
          <el-switch v-model="setting.sorb"></el-switch>
        </el-form-item>
      </el-form>
    </el-popover>
    <el-tooltip class="item" effect="dark" :enterable="false" content="撤消(ctrl+z)" placement="right-start">
      <a class="item" @click="revocation">
        <i class="iconfont icon-revocation"></i>
      </a>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :enterable="false" content="恢复(ctrl+y)" placement="right-start">
      <a class="item" @click="forword">
        <i class="iconfont icon-forward"></i>
      </a>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :enterable="false" content="预览" placement="right-start">
      <a class="item" @click="preview">
        <i class="iconfont el-icon-view"></i>
      </a>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :enterable="false" content="保存" placement="right-start">
      <a class="item" @click.stop="save">
        <i class="iconfont icon-save"></i>
      </a>
    </el-tooltip>
    <!-- <el-tooltip class="item" effect="dark" :enterable="false" content="保存为模板" placement="right-start">
      <a class="item" @click.stop="saveTemp">
        <i class="iconfont icon-templatedefault"></i>
      </a>
    </el-tooltip> -->
    <el-tooltip class="item" effect="dark" :enterable="false" content="参考线" placement="right-start">
      <a class="item" v-popover:popover4>
        <i class="iconfont icon-grid"></i>
      </a>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :enterable="false" content="psd" placement="right-start">
      <a class="item" @click.stop="psd">
        <i class="iconfont el-icon-picture-outline"></i>
      </a>
    </el-tooltip>

    <!-- <el-tooltip class="item" effect="dark" :enterable="false" content="手机框" placement="right-start">
      <a class="item" @click.stop="phoneDisplay">
        <i class="iconfont icon-phone"></i>
      </a>
    </el-tooltip> -->

  </div>

</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .tool {
    position: fixed;
    bottom: 50%;
    right: 50%;
    margin: auto;
    z-index: 990;
    width: 50px;
    text-align: center;
    transform: translate(257px, 100px);

    .item {
      float: left;
      width: 40px;
      height: 40px;
      background-color: rgba(0, 0, 0, 0.5);
      color: #ffffff;
      line-height: 40px;

      .iconfont {
        font-size: 20px;
      }

      &:hover {
        color: #999;
        background-color: rgba(0, 0, 0, 0.8);
      }
    }
  }
</style>

<script type="text/ecmascript-6">
  /**
   * 页面编辑右边的小工具条
   * 回退，前进，保存页面，保存模板，预览等功能
   */
  import BaseComponent from 'src/extend/BaseComponent'
  import common from '../assets/js/common'
  export default {
    mixins: [BaseComponent],
    components: {},
    name: 'SliderTool',
    props: {
    },
    data: function () {
      return {
        setting: {
          open: true, // 网格开关
          line: true, // 智能参考线显示
          color: '#409EFF', // 参考线颜色
          phoneline: true, // 手机框
          sorb: true // 是否拖拽吸附
        }
      }
    },
    watch: {
      setting: {
        deep: true,
        handler: function (newVal) {
          this.$store.dispatch('SettingChange', newVal)
          window.localStorage.setItem('EditorSetting', JSON.stringify(newVal))
        }
      }
    },
    mounted: function () {
      /**
 * 读取本地设置信息
 */
      try {
        var EditorSetting = JSON.parse(window.localStorage.getItem('EditorSetting'))
        if (EditorSetting) {
          Object.assign(this.setting, EditorSetting)
        }
      } catch (error) {}
    },
    methods: {
      /**
       * 预览
       */
      preview: function () {
        var urlInfo = common.parseURL(window.location.href)
        this.openDialog({
          name: 'd-Preview',
          data: {
            key: urlInfo.params && urlInfo.params.key
          }
        })
      },
      /**
       * 历史回退
       **/
      revocation: function () {
        this.ema.fire('history.back')
      },
      /**
       * 历史前进
       **/
      forword: function () {
        this.ema.fire('history.forword')
      },
      /**
       * 保存
       **/
      save: function () {
        this.ema.fire('pageInfo.save', true)
      },
      /**
       * 保存模板
       **/
      saveTemp: function () {
        this.ema.fire('pageInfo.saveTemp')
      },
      phoneDisplay: function () {

      },
      /**
       * psd 操作
       */
      psd: function () {
        this.ema.fire('pageInfo.psd')
      }
    }
  }
</script>

