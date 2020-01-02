<template>
  <div class="animatePicker">
    <div class="tabsWarp">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="group in Metadata.Animate" :key="group.value" :name="group.value" :label="group.label||group.value" >
        <div class="itemWarp">
        <div class="item" :class="{active:isActive(itemin.value)}" v-for="itemin in group.options" :key="itemin.value" @click="selectOne(itemin.value)" @mouseenter="preview($event,itemin,true)" @mouseleave="preview($event,itemin,false)">
          <div class="icon" >
            <img src="../../../assets/images/logo.png">
          </div>
          <div class="label">
            {{itemin.label||itemin.value}}
          </div>
        </div>
        </div>
      </el-tab-pane>
      <el-tab-pane  key="setting" name="设置" label="设置" >
          <span slot="label"><i class="el-icon-setting"></i></span>
          <div class="itemWarp">
            <el-form  size="mini" label-width="80px" class="demo-ruleForm">
              <el-form-item label="速度曲线" prop="region">
                <el-select v-model="info.timingFunction">
                  <el-option v-for="group in Metadata.AnimationTimingFunction" :key="group.value" :value="group.value" :label="group.label||group.value" ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="无限循环" prop="delivery">
                <el-switch :value="info.infinite" @change="infiniteChange"></el-switch>
              </el-form-item>
              <el-form-item v-if="!info.infinite" label="循环次数" prop="name">
                <el-input v-model="info.countNum" type="number"></el-input>
              </el-form-item>
            </el-form>
          </div>
      </el-tab-pane>
    </el-tabs>
    </div>
    <div class="toolNav">
       <el-form :inline="true" size="mini" label-width="80px" class="ruleForm">
          <el-form-item  label="速度曲线" prop="region">
            <el-select style="width:100px"  v-model="info.timingFunction">
              <el-option v-for="group in Metadata.AnimationTimingFunction" :key="group.value" :value="group.value" :label="group.label||group.value" ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-tooltip class="item" effect="dark" content="删除动画" placement="top">
          <i class="delete el-icon-delete" @click="deleteOne"></i>
        </el-tooltip>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .animatePicker {
    display: flex;
    flex-direction: column;

    .tabsWarp {
      flex: 1;

      .itemWarp {
        overflow: auto;
        height: 400px;

        .item {
          float: left;
          width: 60px;
          height: 60px;
          border: 1px solid #353535;
          margin: 4px;
          text-align: center;
          background-color: #313131;
          border-radius: 4px;
          cursor: pointer;

          &:hover {
            border: 1px solid #d48806;
          }

          &.active {
            border: 1px solid #d48806;
          }

          .icon {
            width: 40px;
            height: 40px;
            margin: auto;
            animation-duration: 1s;
            animation-iteration-count: infinite;
            animation-fill-mode: both;

            img {
              width: 100%;
            }
          }

          .label {
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
          }
        }
      }
    }

    .toolNav {
      height: 30px;
      margin-top: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 19px;

      .ruleForm {
        flex: 1;
        height: 30px;
      }

      .delete {
        flex-wrap;

        &:hover {
          color: #faad14;
          cursor: pointer;
        }
      }
    }
  }
</style>
<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import BaseNode from 'src/extend/BaseNode'
  export default {
    mixins: [BaseNode, BaseComponent],
    name: 'timeLineNode',
    props: {
      value: {
        type: String,
        default: ''
      },
      animates: {
        type: Array,
        default () {
          return []
        }
      },
      info: {

      }
    },
    data: function () {
      return {
        activeName: 'Attention Seekers',
        currentSelect: ''
      }
    },
    watch: {
    },
    computed: {
    },
    beforeDestroy: function () {
    },
    mounted () {
      this.currentSelect = this.value
    },
    methods: {
      isActive (key) {
        if (this.currentSelect == key) {
          return true
        } else {
          return false
        }
      },
      infiniteChange (flag) {
        if (flag == true && this.animates.indexOf(this.info) < (this.animates.length - 1)) {
          this.$confirm('开启无限循环，会删除该动画之后的动画效果', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.info.infinite = flag
            this.info.countNum = 1
            this.animates.splice(this.animates.indexOf(this.info) + 1, this.animates.length)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        } else {
          this.info.infinite = flag
        }
      },
      preview (event, cssInfo, flag) {
        if (flag) {
          event.currentTarget.firstElementChild.style.animationName = cssInfo.value
          event.currentTarget.firstElementChild.style.animationTimingFunction = this.info.timingFunction
        } else {
          event.currentTarget.firstElementChild.style.animationTimingFunction = ''
          event.currentTarget.firstElementChild.style.animationName = ''
        }
      },
      selectOne (value) {
        this.currentSelect = value
        this.info.type = value
      },
      deleteOne () {
        this.animates.splice(this.animates.indexOf(this.info), 1)
        this.ema.fire('animate.cell.hideOtherPicker', null)
      }
    }
  }
</script>

