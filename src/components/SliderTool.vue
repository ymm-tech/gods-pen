<template>
  <div class="tool" fixed-tool="" @mousedown.stop="" @mouseup.stop="" @mousemove.stop="">
    <el-popover ref="popover4" placement="right" width="180" trigger="click">
      <el-form :model="Setting" size="mini" label-width="90px">
        <el-form-item label="参考线颜色">
          <el-color-picker @change="onSettingChange($event, 'color')" :value="Setting.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="智能参考线">
          <el-switch @change="onSettingChange($event, 'line')" :value="Setting.line"></el-switch>
        </el-form-item>
        <el-form-item label="吸附效果">
          <el-switch @change="onSettingChange($event, 'sorb')" :value="Setting.sorb"></el-switch>
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
    top: 35%;
    top: calc(50% - 125px)
    right: 0;
    margin: auto;
    z-index: 990;
    width: 60px;
    text-align: center;

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
        right: 0,
        setting: {
          open: true, // 网格开关
          line: true, // 智能参考线显示
          color: '#409EFF', // 参考线颜色
          phoneline: true, // 手机框
          sorb: true // 是否拖拽吸附
        }
      }
    },
    mounted: function () {
    },
    methods: {
      onSettingChange (v, k) {
        this.$store.dispatch('SettingChange', {[k]: v})
      },
      /**
       * 预览
       */
      preview: function () {
        var urlInfo = common.parseURL(window.location.href)
        this.ema.fire('pageInfo.save', true, () => {
          if ((/desktop/i).test(this.Setting.phoneSize.name)) {
            return window.open(`${this.Config.previewHost}` + urlInfo.params.key + '?preview=1')
          }
          this.openDialog({
            name: 'd-Preview',
            data: {
              key: urlInfo.params && urlInfo.params.key
            }
          })
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
        this.ema.fire('pageInfo.save')
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
      },
      computeRight () {
        const stage = document.querySelector('#appWarp')
        const rect = stage && stage.getBoundingClientRect()
        if (!rect) return
        this.right = (rect.width - parseFloat(this.Setting.phoneSize.width)) / 2 - 80 + 'px'
      }
    }
  }
</script>

