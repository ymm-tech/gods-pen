<template>
  <div class="main-animate widget">
  <div class="content" draggable="false">
    <div class="left-slider">
      <div class="a78">
        <div class="a79">
          <span>图层</span>
        </div>
        <div class="aib">
          <div class="aia">
        <el-tooltip class="item" effect="dark" content="重置时间" placement="top">

            <el-button type="success" size="mini" @click="resetTime">
              <i class="icon el-icon-refresh" ></i>
            </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="isPlay?'暂停':'播放'" placement="top">
            <el-button type="primary" size="mini" @click="play">
              <i v-if="isPlay">暂停</i>
              <i v-else class="icon"> 播放</i>
            </el-button>
        </el-tooltip>
          </div>
        </div>
      </div>
      <div class="a7b" ref="sliderNode" data-deselect-layers="true" @scroll="scroll($event,['scrollTop'])">
        <div>
          <animate-layer-node v-if="rootNode" :info="rootNode"></animate-layer-node>
        </div>
      </div>
    </div>
    <div class="right-slider" @mousedown="mousedown" @mouseup="mouseup" @mousemove="mousemove" @mouseleave="mouseleave">
      <div class="cursor"  @mousedown="timelineStart" :style="{left:((time/1000)*((timeSpace.length)*timeSpace.num)-scrollLeft)+'px'}">
        <div class="cum" >
          <svg width="24px" height="24px" viewBox="0 0 24 24"><g><path fill="#faad14" d="M9,4 L16,4 C17.1045695,4 18,4.8954305 18,6 L18,13.0070582 C18,14.3526183 17.4576726,15.6413868 16.4955882,16.5820916 L13,20 L12,20 L8.50441184,16.5820916 C7.5423274,15.6413868 7,14.3526183 7,13.0070582 L7,6 C7,4.8954305 7.8954305,4 9,4 Z"></path><g transform="translate(12.000000, 7.000000)" fill="#FFFFFF" fill-opacity="0.2"><rect id="Rectangle" x="0" y="0" width="1" height="1"></rect><rect id="Rectangle" x="0" y="3" width="1" height="1"></rect><rect id="Rectangle" x="0" y="6" width="1" height="1"></rect></g></g></svg>
        </div>
        <div class="cuk" >
          <div class="timetip" v-if="cursorPos.time">{{parseFloat(time/1000).toFixed(2)+'s'}}</div>
        </div>
      </div>
      <div class="timeline">
        <div class="aig" style="left: 0px;">
          <div class="aih" >
            <span class="aii" ></span>
          </div>
          <div class="aij" ref="timelineNav" @scroll="scroll($event,['scrollLeft'])">
            <div :style="{width: (timeSpace.allTime*(timeSpace.length)*timeSpace.num) + 'px' }">
              <template v-for="i in timeSpace.allTime">
                <span v-for="j in timeSpace.num" :key="i+'ail'+j" :class="[j==1?'ail':'aik']" :data-unit="i-1" :style="spaceStyle"></span>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="nodeListWarp" ref="timelineItem" @scroll="scroll($event,['scrollLeft','scrollTop'])">
          <div :style="{width: (timeSpace.allTime*timeSpace.length*timeSpace.num) + 'px' }">
            <time-line-node v-if="rootNode" :info="rootNode" :time-space="timeSpace"></time-line-node>
          </div>
      </div>
    </div>
  </div>
  <div class="toolNav">
    <el-form :inline="true" size="mini"  class="demo-form-inline">
      <el-form-item label="总时间">
        <el-input v-model.number="timeSpace.allTime"  style="width:60px" type="number"></el-input>
      </el-form-item>
      <el-form-item label="刻度间隔">
        <el-input v-model.number="timeSpace.length"   style="width:60px" type="number"></el-input>
      </el-form-item>
      <el-form-item label="刻度数">
        <el-select size="mini"  v-model.number="timeSpace.num"   style="width:80px" label="刻度数">
          <el-option label="10" :value="10"></el-option>
          <el-option label="5" :value="5"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
  <div class="forbid-edit-mask" v-show="forbidEdit"></div>
</div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .main-animate {
    position: relative;
    text-align: center;
    padding: 0px !important;
    height: 100%;
    display: flex;
    flex-direction: column;

    .content {
      background: #272726;
      position: relative;
      width: 100%;
      height: 100%;
      user-select: none;
      z-index: 10;
      flex: 1;
      display: flex;

      .left-slider, .right-slider {
        display: flex;
        vertical-align: top;
        height: 100%;
        flex-direction: column;
      }

      .left-slider {
        .a78 {
          align-items: center;
          background: #31333b;
          border-bottom: 1px solid rgba(81, 88, 115, 0.2);
          border-right: 1px solid rgba(81, 88, 115, 0.2);
          color: #ffffff;
          display: flex;
          font-weight: bold;
          font-size: 12px;
          flex 0 0 37px;
          justify-content: space-between;
          padding: 0 6px;
          text-transform: uppercase;
          width: 225px;

          .aib {
            display: flex;

            .aia {
              display: flex;
              margin: 0 2px 0 8px;

              .icon {
                font-size: 12px;
                width: 12px;
                height: 12px;
              }
            }
          }
        }

        .a7b {
          background-color: #262725;
          border-right: 1px solid rgba(23, 23, 25, 0.2);
          height: 100%;
          width: 225px;
          overflow: auto;
        }
      }

      .right-slider {
        overflow: hidden;
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;

        .cursor {
          height: calc(100% - 16px);
          left: -1px;
          position: absolute;
          top: 0;
          transition-property: transform;
          transition-timing-function: linear;
          transition-duration: 0s;
          z-index: 2;

          .cum {
            cursor: ew-resize;
            left: -12px;
            position: absolute;
            width: 24px;
          }

          .cuk {
            background-color: #faad14;
            height: 100%;
            pointer-events: none;
            position: absolute;
            top: 20px;
            width: 1px;

            .timetip {
              position: absolute;
              left: 8px;
              top: 2px;
              padding: 3px 5px;
              border-radius: 3px;
              background-color: #1313138a;
              color: #ffffff;
              font-size: 12px;
            }
          }
        }

        .timeline {
          overflow: hidden;
          user-select: none;
          height: 37px;

          .aig {
            height: 37px;
            position: relative;
            overflow: auto;

            .aih {
              position: absolute;
              background-image: linear-gradient(to bottom, rgba(155, 178, 242, 0.1), rgba(98, 123, 224, 0.15));
              background-blend-mode: multiply;
              height: 49px;
              z-index: 1;
            }

            .aij {
              bottom: 0;
              line-height: 1;
              position: absolute;
              white-space: nowrap;
              width: 100%;
              padding-top: 15px;
              overflow: auto;

              .ail {
                background-color: rgba(250, 173, 19, 0.8);
                display: inline-block;
                height: 10px;
                width: 1px;
                position: relative;

                &::after {
                  bottom: 13px;
                  color: rgba(250, 173, 19, 0.8);
                  content: attr(data-unit);
                  display: block;
                  font-size: 10px;
                  font-weight: 500;
                  height: 10px;
                  left: -5px;
                  position: absolute;
                  text-align: center;
                  vertical-align: middle;
                  width: 10px;
                }
              }

              .aik {
                background-color: rgba(250, 173, 19, 0.8);
                display: inline-block;
                height: 6px;
                width: 1px;
              }
            }
          }
        }

        .nodeListWarp {
          flex: 1;
          overflow: auto;
        }
      }
    }

    .toolNav {
      height: 30px;
      background-color: #353535;
      text-align: right;
      overflow: hidden;
    }
  }
</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import Metadata from '../../../store/metadata'
  import AnimateLayerNode from './LayerNode'
  import TimeLineNode from './TimeLineNode'

  export default {
    mixins: [BaseComponent],
    name: 'animate',
    components: {AnimateLayerNode, TimeLineNode},
    props: {
      active: {
        type: [Number, Boolean],
        default: 0
      }
    },
    data: function () {
      return {
        cursorPos: {
          time: null,
          startX: null
        },
        allNodeInfo: window.Editor.nodeInfo,
        time: 0, // 当前时间 单位 ms
        timeSpace: {
          allTime: 15, // 总时间 单位 s
          length: 15,  // 刻度间隔
          num: 10  // 刻度间隔
        },
        scrollLeft: 0,
        scrollTop: 0,
        isPlay: false,
        forbidEdit: false
      }
    },
    computed: {
      rootNode () {
        return this.allNodeInfo
      },
      spaceStyle () {
        return {
          'margin-right': `${this.timeSpace.length - 1}px`
        }
      }
    },
    mounted: function () {
      this.ema.bind('edit-type.change', type => {
        this.forbidEdit = type !== 'EDITOR'
      })
    },
    watch: {
      scrollTop: function (params) {
        this.$refs['sliderNode'].scrollTop = params
        this.$refs['timelineItem'].scrollTop = params
      },
      scrollLeft: function (params) {
        this.$refs['timelineNav'].scrollLeft = params
        this.$refs['timelineItem'].scrollLeft = params
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
      mousedown (ev) {
        this.ema.fire('animate.rightslider.movedown', ev)
      },
      mousemove (ev) {
        this.ema.fire('animate.rightslider.movemove', ev)
        this.timelineMove(ev)
      },
      mouseup (ev) {
        this.ema.fire('animate.rightslider.moveup', ev)
        this.timelineEnd(ev)
      },
      mouseleave (ev) {
        if (this.cursorPos.time === null) return
        this.mouseup(ev)
      },
      timelineStart (ev) {
        this.cursorPos.startX = ev.clientX
        this.cursorPos.time = this.time
        this.ema.fire('animate.timeline.move.start')
      },
      timelineMove (ev) {
        if (this.cursorPos.startX) {
          this.time = this.cursorPos.time + ((ev.clientX - this.cursorPos.startX) / (this.timeSpace.length * this.timeSpace.num)) * 1000
          this.ema.fire('animate.timeline.move', (this.time / 1000).toFixed(2), this.timeSpace.allTime)
        }
      },
      timelineEnd (ev) {
        this.cursorPos.startX = null
        this.cursorPos.time = null
        this.ema.fire('animate.timeline.move.end')
      },

      scroll (event, keys) {
        if (keys.indexOf('scrollTop') != -1) {
          this.scrollTop = event.target.scrollTop
        }
        if (keys.indexOf('scrollLeft') != -1) {
          this.scrollLeft = event.target.scrollLeft
        }
      },
      resetTime () {
        this.time = 0
      },
      play (bool) {
        if (this.isPlay) {
          if (this.timerInterval) {
            clearInterval(this.timerInterval)
            this.timerInterval = null
            this.ema.fire('animate.timeline.move.end')
          }
        } else {
          this.ema.fire('animate.timeline.move.start')
          this.timerInterval = setInterval(() => {
            this.time += 16
            if (this.time >= this.timeSpace.allTime * 1000) {
              clearInterval(this.timerInterval)
              this.time = 0
            }
            this.ema.fire('animate.timeline.move', (this.time / 1000).toFixed(2), this.timeSpace.allTime)
          }, 16)
        }
        this.isPlay = !this.isPlay
      }
    }
  }
</script>

