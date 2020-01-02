<template>
  <div class="timeLineNodeCell" @click.stop  :style="cellStyle"  @mousedown="mousedown($event,'center')">
    <div class="timeLineNodeCellOne"  :style="oneCellStyle">
      <el-popover
        placement="top"
        width="300"
        height="400"
        :value="showpicker"
        trigger="click">
        <animate-picker :value="info.type" :info="info" :animates="animates"></animate-picker>
        <div slot="reference" class="cellItem"  @click.stop="selectOne"  :class="{active:isActive}">
        {{info.label||info.type||'无'}}<i class="el-icon-edit"></i>
        </div>
      </el-popover>
      <div class="presentation left" @click.stop @mousedown.stop="mousedown($event,'left')" ></div>
      <div class="presentation right" @click.stop @mousedown.stop="mousedown($event,'right')" ></div>
        <el-tooltip class="item" effect="dark" content="向前插入动画" placement="top">
          <i class="add left el-icon-circle-plus" @click.stop="addFrame(0)" ></i>
        </el-tooltip>
        <el-tooltip v-if="!info.infinite" class="item" effect="dark" content="向后插入动画" placement="top">
          <i class="add right el-icon-circle-plus" @click.stop="addFrame(1)" ></i>
        </el-tooltip>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .timeLineNodeCell {
    background-color: #5a0808;
    display: inline-block;
    text-align: center;
    height: 28px;
    margin: 1px 0;
    vertical-align: middle;
    line-height: 28px;
    color: #fff;
    position: relative;
    overflow: hidden;
    font-size: 12px;
    background: repeating-linear-gradient(135deg, #272726, #272726 10px, #31343c 10px, #31343c 20px);
    box-shadow: inset 0 0 4px 1px #131313;

    .timeLineNodeCellOne {
      background-color: #5a0808b3;
      position: relative;
      border-radius: 2px;
      overflow: hidden;
      box-shadow: inset 0 0 4px 1px #5a0808b3;

      .el-icon-edit {
        cursor: pointer;
      }

      &:hover {
        .presentation {
          background-color: rgba(255, 255, 255, 0.8);
          width: 8px;
          opacity: 0.3;
        }

        .add {
          opacity: 0.3;
        }
      }

      .add {
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        height: 100%;
        position: absolute;
        opacity: 0;
        top: 8px;

        &:hover {
          opacity: 1;
        }

        &.right {
          right: 10px;
        }

        &.left {
          left: 10px;
        }
      }

      .presentation {
        background-color: rgba(255, 255, 255, 0.8);
        cursor: ew-resize;
        height: 100%;
        position: absolute;
        width: 1px;
        opacity: 0.3;
        top: 0;

        &:hover {
          opacity: 1;
        }

        &.right {
          right: 0;
        }

        &.left {
          left: 0;
        }
      }
    }
  }
</style>
<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import BaseNode from 'src/extend/BaseNode'
  import AnimatePicker from './AnimatePicker'

  export default {
    mixins: [BaseNode, BaseComponent],
    name: 'timeLineNode',
    components: {AnimatePicker},
    props: {
      info: {
        type: Object
      },
      animates: {
        type: Array,
        default () {
          return []
        }
      },
      timeSpace: {
        type: Object,
        default () {
          return {
            num: 5,
            length: 18
          }
        }
      }
    },
    data: function () {
      return {
        showpicker: false,
        isActive: false,
        touchFlag: null,
        ismoved: false,
        touchStart: {
          x: null,
          delay: null,
          duration: null,
        },
      }
    },
    watch: {
      info: {
        deep: true,
        handler: function (newVal, oldVal) {
        }
      }
    },
    computed: {
      cellStyle () {
        let data = {
          marginLeft: (this.info.delay * (this.timeSpace.length * this.timeSpace.num) || 0) + 'px',
          width: (this.info.duration * this.info.countNum) * (this.timeSpace.num * this.timeSpace.length) + 'px'
        }
        var preTime = 0
        for (let index = 0; index < this.animates.length; index++) {
          const element = this.animates[index]
          if (this.info === element) {
            break
          }
          preTime += element.duration * element.countNum + element.delay
        }
        if (this.info.infinite) {
          data.width = (this.timeSpace.allTime - preTime - this.info.delay) * (this.timeSpace.num * this.timeSpace.length) + 'px'
        }
        return data
      },
      oneCellStyle () {
        return {
          width: (this.info.duration) * (this.timeSpace.num * this.timeSpace.length) + 'px'
        }
      }
    },
    beforeDestroy: function () {
    },
    mounted () {
      this.ema.bind('animate.rightslider.movemove', (ev) => {
        if (this.touchFlag) {
          this.mousemove(ev)
        }
        this.ismoved = false
      })
      this.ema.bind('animate.rightslider.moveup', (ev) => {
        this.mouseup(ev)
      })
      this.ema.bind('animate.cell.hideOtherPicker', (info) => {
        if (this.info !== info) {
          this.showpicker = false
        }
      })
    },
    methods: {
      mousedown (event, flag) {
        this.touchFlag = flag
        this.touchStart.x = event.x
        this.touchStart.delay = this.info.delay || 0
        this.touchStart.duration = this.info.duration
      },
      mouseup (event, flag) {
        this.touchFlag = null
        this.touchStart.x = null
        this.touchStart.delay = null
        this.touchStart.duration = null
      },
      mousemove (event) {
        this.ismoved = true
        let changeLength = event.x - this.touchStart.x
        let changeTime = changeLength / (this.timeSpace.num * this.timeSpace.length)
        if (this.touchFlag == 'left') {
          // 如果是做面
          this.info.delay = Math.max(0, this.touchStart.delay + changeTime)
          this.info.duration = Math.max(0.5, this.touchStart.duration - changeTime)
        } else if (this.touchFlag == 'right') {
          // 如果是做面
          this.info.duration = Math.max(0.5, this.touchStart.duration + changeTime)
        } else if (this.touchFlag == 'center') {
          this.info.delay = Math.max(0, this.touchStart.delay + changeTime)
        }
      },
      selectOne (ev) {
        if (!this.ismoved) {
          this.showpicker = !this.showpicker
          this.ismoved = false
        }
        if (this.showpicker == true) {
          this.ema.fire('animate.cell.hideOtherPicker', this.info)
        }
      },
      addFrame (flag) {
        var index = this.animates.indexOf(this.info)
        index = index + flag
        if (index >= this.animates.length) {
          index = this.animates.length
        }
        this.animates.splice(index, 0, {
          type: '',
          duration: 1,
          delay: 0,
          countNum: 1,
          infinite: false
        })
      }

    }
  }
</script>

