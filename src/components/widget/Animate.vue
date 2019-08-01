<template>
  <div class="main-animate widget">
    <el-button-group>
      <el-button type="primary" icon="el-icon-circle-plus" size="mini" @click="addItem">添加动画</el-button>
      <el-button type="primary" icon="el-icon-success" size="mini" @click="runAnimate">运行动画</el-button>
    </el-button-group>
    <div class="listWarp">
      <el-collapse v-model="activeNames">
        <el-collapse-item v-for="(item,index) in inContent" :key="index" :name='index'>
          <template slot="title">
            <div class="headerin">
              动画{{index+1}}&nbsp;
              <el-tag type="success">{{item.type|animateFilter}}</el-tag>
              <i class="header-icon el-icon-error" @click="deleteAnimateQueue(index)"></i>
            </div>
          </template>
          <el-form size="mini" label-position="left" label-width="80px">
            <el-form-item label="动画类型">
              <el-select size="mini" v-model="item.type" placeholder="请选择活动区域">
                <el-option-group v-for="group in Metadata.Animate" :key="group.value" :label="group.label||group.value">
                  <el-option v-for="itemin in group.options" :key="itemin.value" :label="itemin.label||itemin.value" :value="itemin.value">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="动画时间">
              <el-slider class="slider" size="mini" :min="0.1" :max="5" v-model="item.duration" :step="0.1"></el-slider>
              <el-input class="input" type='number' :min="0.1" :max="5" size="mini" v-model.number="item.duration"></el-input>
            </el-form-item>
            <el-form-item label="延迟时间">
              <el-slider class="slider" size="mini" :max="20" :min="0" v-model="item.delay" :step="0.1"></el-slider>
              <el-input class="input" type='number' :max="20" :min="0" size="mini" v-model.number="item.delay"></el-input>
            </el-form-item>
            <el-form-item v-show="!item.infinite" label="播放次数">
              <el-slider class="slider" size="mini" :max="20" :min="1" v-model="item.countNum"></el-slider>
              <el-input class="input" type='number' :max="20" :min="1" size="mini" v-model.number="item.countNum"></el-input>
            </el-form-item>
            <el-form-item label="循环播放">
              <el-checkbox v-model="item.infinite"></el-checkbox>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="forbid-edit-mask" v-show="forbidEdit"></div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .main-animate {
    position: relative;
    text-align: center;
    padding: 5px !important;

    .listWarp {
      text-align: left;
      padding: 10px;

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

      .headerin {
        position: relative;
        width: 100%;

        .header-icon {
          position: absolute;
          right: 30px;
          top: 16px;
          font-size: 20px;
          color: #dddddd;

          &:hover {
            color: red;
          }
        }
      }
    }
  }
</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import Metadata from '../../store/metadata'
  export default {
    mixins: [BaseComponent],
    name: 'control',
    components: {},
    props: {
      active: {
        type: [Number, Boolean],
        default: 0
      }
    },
    data: function () {
      return {
        nodeInfo: null,
        content: [],
        inContent: [],
        forbidEdit: false,
        activeNames: []
      }
    },

    mounted: function () {
      window.$vue && this.onSelectOne(window.$vue)
      this.inContent = [].concat(this.content)
      this.ema.bind('select.oneInfo', ({vm}) => {
        this.onSelectOne(vm)
      })
      this.ema.bind('edit-type.change', type => {
        this.forbidEdit = type !== 'EDITOR'
      })
      this.ema.bind('select.noOne', () => {
        this.content = []
      })
    },
    watch: {
      active: function (params) {
        if (this.active) {
          window.$vue && this.onSelectOne(window.$vue)
        }
      },
      'inContent': {
        handler (newValue, oldValue) {
          if (!this.compareArray(this.inContent, this.content)) {
            this.nodeInfo.animate = newValue
          }
        },
        deep: true
      },
      'content' (newValue, oldValue) {
        if (!this.compareArray(this.inContent, this.content)) {
          this.inContent = [].concat(this.content)
        }
      }
    },
    filters: {
      animateFilter: function (value) {
        var temp = []
        Metadata.Animate.forEach(element => {
          temp = temp.concat(element.options)
        })
        var info = temp.find(element => {
          if (element.value == value) {
            return true
          }
        })
        return info ? info.label : value
      }
    },
    methods: {
      onSelectOne: function (vm) {
        this.nodeInfo = vm.nodeInfo
        this.content = vm.nodeInfo.animate
      },
      addItem: function () {
        this.inContent.push({
          type: '',
          duration: 0,
          delay: 0,
          countNum: 1,
          infinite: false
        })
      },
      deleteAnimateQueue (index) {
        this.inContent.splice(index, 1)
      },
      runAnimate () {
        // 获取全局选择对象。并运行动画
        if (window.$vue) {
          window.$vue.runAnimate({clearFirst: 1})
        }
      },
      compareArray (arr1, arr2) {
        const arr1Length = arr1.length
        const arr2Length = arr2.length
        if (arr1Length !== arr2Length) {
          return false
        }
        for (let i = 0; i < arr1Length; i++) {
          for (var attr in arr1[i]) {
            if (arr1[i][attr] !== arr2[i][attr]) {
              return false
            }
          }
        }
        return true
      }
    }
  }
</script>

