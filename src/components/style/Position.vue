<template>
  <div class="styleEditorWarp">
    <div class="widget-outer">
      <div id="upper">
        <div class="h-control-group layout horizontal center">
          <el-checkbox
            tabindex="-1"
            class="checkbox"
            :value="notEmpty(info.top)"
            @change="handleCheckChange('top','bottom')"
            title="是否对齐父节点顶边"
          >上</el-checkbox>
          <el-input
            class="input top-input small"
            size="mini"
            tabindex="-1"
            v-model="info.top"
            v-show="notEmpty(info.top)"
            title="本节点顶边和父节点顶边的距离，可输入负值，默认单位为像素（px），也可以输入百分比，根据父节点 height 和百分比数值计算出距离"
          ></el-input>
        </div>

        <div class="layout horizontal center">
          <div class="v-control-group layout vertical end">
            <el-checkbox
              class="v-checkbox"
              tabindex="-1"
              title="是否对齐父节点左边"
              :value="notEmpty(info.left)"
              @change="handleCheckChange('left','right')"
            >左</el-checkbox>
            <el-input
              v-show="notEmpty(info.left)"
              v-model="info.left"
              class="input bottom-input small"
              tabindex="-1"
              size="mini"
              title="本节点左边和父节点左边的距离，可输入负值，默认单位为像素（px），也可以输入百分比，根据父节点 width 和百分比数值计算出距离"
              style=""
            ></el-input>
          </div>

          <div class="content">
            <div v-show="notEmpty(info.top)" style="position: absolute; height: 0px; width: 84px; border-width: 1px 0px 0px; border-style: dashed; border-color: rgb(165, 165, 165); border-image: initial; left: 0px; top: 12px;"></div>
            <div v-show="notEmpty(info.left)" style="position: absolute; height: 84px; width: 0px; border-width: 0px 0px 0px 1px; border-style: dashed; border-color: rgb(165, 165, 165); border-image: initial; top: 0px; left: 12px;"></div>
            <div v-show="notEmpty(info.right)" style="position: absolute; height: 84px; width: 0px; border-width: 0px 0px 0px 1px; border-style: dashed; border-color: rgb(165, 165, 165); border-image: initial; top: 0px; right: 12px;"></div>
            <div v-show="notEmpty(info.bottom)" style="position: absolute; height: 0px; width: 84px; border-width: 1px 0px 0px; border-style: dashed; border-color: rgb(165, 165, 165); border-image: initial; left: 0px; bottom: 12px;"></div>

            <div class="inContent">
              <div v-show="notEmpty(info.left)" class="left-arrow">
                <div class="h-arrow-line"></div>
                <div class="arrow left"></div>
                <div class="arrow right"></div>
              </div>
              <div v-show="notEmpty(info.right)" class="right-arrow">
                <div class="h-arrow-line"></div>
                <div class="arrow left"></div>
                <div class="arrow right"></div>
              </div>
              <div v-show="notEmpty(info.top)" class="top-arrow">
                <div class="v-arrow-line"></div>
                <div class="arrow up"></div>
                <div class="arrow down"></div>
              </div>
              <div v-show="notEmpty(info.bottom)" class="bottom-arrow">
                <div class="v-arrow-line"></div>
                <div class="arrow up"></div>
                <div class="arrow down"></div>
              </div>
            </div>
          </div>

          <div class="v-control-group layout vertical">
            <el-checkbox
              class="v-checkbox"
              tabindex="-1"
              title="是否对齐父节点右边"
              :value="notEmpty(info.right)"
              @change="handleCheckChange('right','left')"
            >右</el-checkbox>
            <el-input
              class="input bottom-input small"
              tabindex="-1"
              size="mini"
              v-show="notEmpty(info.right)"
              v-model="info.right"
              title="本节点右边和父节点右边的距离，可输入负值，默认单位为像素（px），也可以输入百分比，根据父节点 width 和百分比数值计算出距离"
              style=""
            ></el-input>
          </div>
        </div>

        <div class="h-control-group layout horizontal center">
          <el-checkbox
            tabindex="-1"
            class="checkbox"
            :value="notEmpty(info.bottom)"
            @change="handleCheckChange('bottom','top')"
            title="是否对齐父节点底边"
          >下</el-checkbox>
          <el-input
            class="input right-input small"
            size="mini"
            tabindex="-1"
            v-show="notEmpty(info.bottom)"
            v-model="info.bottom"
            title="本节点底边和父节点底边的距离，可输入负值，默认单位为像素（px），也可以输入百分比，根据父节点 height 和百分比数值计算出距离"
          ></el-input>
        </div>
      </div>
    </div>
    <el-form label-position="left">
      <el-form-item label-width="190px" label="固定在屏幕上">
        <el-switch v-model="fixed"></el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .styleEditorWarp {
    padding: 0 10px;

    .widget-outer {
      width: 90%;
      min-width: 300px;
      margin: 10px auto;
      text-align: center;

      .layout {
        >div {
          display: inline-block;
          vertical-align: middle;
        }

        .input {
          width: 80px;
        }
      }

      .content {
        margin: 13px 18px;
        background-color: rgb(85, 85, 86);
        border: 1px solid rgb(42, 42, 42);
        box-shadow: rgb(51, 51, 51) 0px 0px 4px;
        box-sizing: content-box;
        position: relative;
        width: 84px;
        height: 84px;

        .inContent {
          top: 0px;
          left: 0px;
          position: absolute;
          box-sizing: border-box;
          border-radius: 5px;
          border: 1px solid rgb(42, 42, 42);
          background-color: rgb(125, 125, 125);
          margin: 12px;
          height: 60px;
          width: 60px;

          .left-arrow {
            position: absolute;
            top: 50%;
            left: -13px;
          }

          .right-arrow {
            position: absolute;
            top: 50%;
            right: -13px;
          }

          .top-arrow {
            position: absolute;
            top: -13px;
            left: 50%;
          }

          .bottom-arrow {
            position: absolute;
            left: 50%;
            bottom: -13px;
          }

          .h-arrow-line {
            width: 4px;
            margin: 0 4px 0 4px;
            border-top: 1px solid #ccc;
          }

          .v-arrow-line {
            height: 4px;
            margin: 4px 0 4px 0;
            border-left: 1px solid #ccc;
          }

          .arrow {
            position: absolute;

            &.left {
              left: -2.5px;
              top: -2px;

              &::after {
                border: 2.5px solid transparent;
                border-right: 4px solid #ccc;
                position: absolute;
                content: ' ';
              }
            }

            &.right {
              right: 4px;
              top: -2px;

              &::before {
                border: 2.5px solid transparent;
                border-left: 4px solid #ccc;
                position: absolute;
                content: ' ';
              }
            }

            &.up {
              top: -3px;
              left: -2px;

              &::after {
                border: 2.5px solid transparent;
                border-bottom: 4px solid #ccc;
                position: absolute;
                content: ' ';
              }
            }

            &.down {
              bottom: 4px;
              left: -2px;

              &::before {
                border: 2.5px solid transparent;
                border-top: 4px solid #ccc;
                position: absolute;
                content: ' ';
              }
            }
          }
        }
      }

      .h-control-group {
        height: 26px;
        width: 100%;
        padding-left: 40%;
        display: inline-block;
        text-align: left;
        position: relative;

        .checkbox {
          margin-right: 10px;
        }
      }

      .v-control-group {
        text-align: center;
        width: 87px;
        height: 52px;
      }
    }
  }
</style>
<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import {getNoRotateBoundingClientRect} from '../../assets/js/common'

  // import Num from './Num'

  export default {
    mixins: [BaseComponent],
    name: 'StyleSize',
    components: {},
    props: {
      info: {
        required: true,
        type: Object
      }
    },
    data: function () {
      return {
        fixed: this.info && this.info.position == 'fixed',
        top: this.notEmpty(this.info.top),
        left: this.notEmpty(this.info.left),
        right: this.notEmpty(this.info.right),
        bottom: this.notEmpty(this.info.bottom)
      }
    },
    computed: {
    },
    watch: {
      fixed: {
        handler: function (newVal, oldVal) {
          if (this.info.position == 'relative') return
          this.positionChange(newVal)
        },
        immediate: true
      },
      info: {
        handler: function (newVal, oldVal) {
          this.makeFixed()
        },
        immediate: true
      },
    },
    methods: {
      makeFixed: function () {
        this.fixed = this.info && this.info.position == 'fixed'
      },
      notEmpty (value) {
        if (value != null && value != '') {
          return true
        } else {
          return false
        }
      },
      handleCheckChange (direction, faceDirection) {
        if (this.notEmpty(this.info[direction])) {
          this.$delete(this.info, direction)
          this.setOffset(faceDirection)
          if (direction == 'left' || direction == 'right') {
            this.setOffset('width')
          } else if (direction == 'bottom' || direction == 'top') {
            this.setOffset('height')
          }
        } else {
          this.setOffset(direction)
          if (this.notEmpty(this.info[faceDirection])) {
            if (direction == 'left' || direction == 'right') {
              this.$delete(this.info, 'width')
            } else if (direction == 'bottom' || direction == 'top') {
              this.$delete(this.info, 'height')
            }
          }
        }
      },
      setOffset (direction) {
        let selfRect = getNoRotateBoundingClientRect(window.$vue.$el)
        if (direction == 'height' || direction == 'width') {
          this.$set(this.info, direction, `${Math.abs(selfRect[direction]).toFixed(2)}px`)
          return
        }
        let parentRect = null
        if (this.info.position == 'fixed') {
          parentRect = getNoRotateBoundingClientRect(document.querySelector('#stage'))
        } else {
          if (window.$vue.parentNodeVm.nodeInfo) {
            parentRect = getNoRotateBoundingClientRect(window.$vue.parentNodeVm.$el)
          }
        }
        if (parentRect) {
          let dist = 0
          dist = selfRect[direction] - parentRect[direction]
          this.$set(this.info, direction, `${dist.toFixed(2)}px`)
        }
      },
      positionChange (value) {
        if (window.$vue && window.$vue.isRootNode) return
        if (!window.$vue || !window.$vue.nodeInfo.visible) {
          return
        }
        let selfRect = getNoRotateBoundingClientRect(window.$vue.$el)
        let stageRect = getNoRotateBoundingClientRect(document.querySelector('#stage'))
        let parentRect = getNoRotateBoundingClientRect(window.$vue.parentNodeVm.$el)

        let isSetArray = []

          ;['left', 'right', 'top', 'bottom'].forEach(element => {
            if (this.notEmpty(this.info[element])) {
              isSetArray.push(element)
            }
          })
        if (value) {
          this.info.position = 'fixed'
          parentRect = stageRect
        } else {
          this.info.position = 'absolute'
        }
        isSetArray.forEach(direction => {
          let dist = 0
          dist = selfRect[direction] - parentRect[direction]
          this.$set(this.info, direction, `${dist.toFixed(2)}px`)
        })
      },
      handleClick (tab, event) {
      }
    }
  }
</script>

