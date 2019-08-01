<template>
  <div class="styleEditorWarp">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="内边距 Padding" name="padding">

        <el-form size="mini" label-position="left" label-width="50px" :model="info">
          <el-form-item>
            <slot name='label'>
              <span class="openDetail" @click="detail1=!detail1">展开</span>
            </slot>
            <num :styleAttr.sync="info['padding']" :min="0" :max="400"></num>
          </el-form-item>
          <div v-if='detail1'>

            <el-form-item label="顶部:">
              <num :styleAttr.sync="info['padding-top']" :min="0" :max="400"></num>
            </el-form-item>
            <el-form-item label="右边:">
              <num :styleAttr.sync="info['padding-right']" :min="0" :max="400"></num>
            </el-form-item>
            <el-form-item label="底部:">
              <num :styleAttr.sync="info['padding-bottom']" :min="0" :max="400"></num>
            </el-form-item>
            <el-form-item label="左边:">
              <num :styleAttr.sync="info['padding-left']" :min="0" :max="400"></num>
            </el-form-item>
          </div>
        </el-form>

      </el-collapse-item>
      <el-collapse-item title="外边距 Margin" name="margin">
        <el-form size="mini" label-position="left" label-width="50px" :model="info">
          <el-form-item>
            <slot name='label'>
              <span class="openDetail" @click="detail2=!detail2">展开</span>
            </slot>
            <num :styleAttr.sync="info['margin']" :min="0" :max="400"></num>
          </el-form-item>
          <div v-if='detail2'>

            <el-form-item label="顶部:">
              <num :styleAttr.sync="info['margin-top']" :min="0" :max="400"></num>
            </el-form-item>
            <el-form-item label="右边:">
              <num :styleAttr.sync="info['margin-right']" :min="0" :max="400"></num>
            </el-form-item>
            <el-form-item label="底部:">
              <num :styleAttr.sync="info['margin-bottom']" :min="0" :max="400"></num>
            </el-form-item>
            <el-form-item label="左边:">
              <num :styleAttr.sync="info['margin-left']" :min="0" :max="400"></num>
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
  import Num from './Num'

  export default {
    mixins: [BaseComponent],
    name: 'StyleLayout',
    components: {Num},

    props: {
      info: {
        required: true,
        type: Object
      }
    },
    data: function () {
      return {
        activeNames: ['margin', 'padding'],
        detail1: false,
        detail2: false
      }
    },
    methods: {
      handleClick (tab, event) {
      }
    }
  }
</script>

