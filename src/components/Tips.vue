<template>
  <div class="tips" :style="{width: width}" v-show='visible'>
    <div class="bell">
      <i class="el-icon-question"></i>
    </div>
    <el-carousel indicator-position="none" height='20' arrow="never" :interval='3000' style="height: 20px; overflow: hidden;">
      <el-carousel-item style="height: 20px" v-for="(tip, index) in tips" :key="index">
        <div class="el-carousel-item" v-html="tip"></div>
      </el-carousel-item>
    </el-carousel>
    <div class="close" @click="close">
      <i class="el-icon-close"></i>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .tips {
    width: 100%;
    height: 20px;
    padding-left: 26px;

    .bell {
      position: absolute;
      left: 6px;
      top: 2px;
      font-size: 14px;
      color: #999;
    }

    .close {
      position: absolute;
      right: 0px;
      top: 2px;
      font-size: 14px;
      color: #999;
      z-index: 4;
    }

    .el-carousel-item {
      padding-left: 0;
      padding-right: 10px;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #999;
      font-size: 12px;
      line-height: 20px;
    }
  }
</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'

  const tips = [
    '鼠标拖动位于组件四角的调整点时，同时按住 <em>shift</em> 键可以保持比例缩放哦',
    '组件树中，「fx」图标表示当前节点添加了脚本，「箱子」图标表示当前节点被封装了',
    '双击组件树中某个节点时，可以切换组件的「封装」状态',
  ]

  export default {
    mixins: [BaseComponent],
    components: {},
    name: 'tips',
    props: {},
    data: function () {
      return {
        tips: tips,
        width: 500,
        visible: true,
      }
    },
    mounted () {
      var box = this.$parent.$el.getBoundingClientRect()
      this.width = box.width + 'px'
    },
    methods: {
      close () {
        this.visible = false
      },
    }
  }
</script>

