<template>
  <div class="styleEditor">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="大小位置" name="size">
        <el-form size="mini" label-position="left" label-width="80px" :model="info">
          <el-form-item label="宽">
            <num :styleAttr.sync="info.width" :max="900"></num>
          </el-form-item>
          <el-form-item label="高">
            <num :styleAttr.sync="info.height"></num>
          </el-form-item>
          <el-form-item label="X">
            <num :styleAttr.sync="info.left" :max="1500"></num>
          </el-form-item>
          <el-form-item label="Y">
            <num :styleAttr.sync="info.top" :max="1500"></num>
          </el-form-item>
          <el-form-item label="旋转">
            <el-input size="mini" v-model="info.transform" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="悬浮">
            <el-checkbox v-model="fixed">固定位置,不随页面滚动(预览可见)</el-checkbox>
          </el-form-item>
          <el-form-item label="透明度">
            <el-slider class="slider" size="mini" :min="0" :max="1" v-model.number="info.opacity" :step="0.1"></el-slider>
            <el-input class="input" type='number' :min="0.1" :max="1" :step='0.1' size="mini" v-model.number="info.opacity" placeholder="0-1"></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="对齐" name="align">
        <align :info="info"></align>
      </el-collapse-item>
      <el-collapse-item title="背景" name="background">
        <editor-background :info="info"></editor-background>
      </el-collapse-item>
      <el-collapse-item title="边框" name="border">
        <el-form size="mini" label-position="left" label-width="80px" :model="info">
          <el-form-item label="样式">
            <el-select v-model="style.borderStyle" placeholder="边框类型">
              <el-option v-for='item in Metadata.style.borderStyle' :key="item.value" :label="item.label || item.value" :value="item.value" :title="item.desc">
                <span style="float: left">{{ item.label || item.value }}</span>
                <a style="float: right; font-size: 13px;" class="iconfont icon-info-light" :title="item.desc"></a>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="宽度">
            <el-slider class="slider" size="mini" :min="0" :max="50" v-model.number="style.borderWidth" :step="1"></el-slider>
            <el-input class="input" type='number' :min="0" :max="50" :step='1' size="mini" v-model.number="style.borderWidth"  placeholder="0-50"></el-input>
          </el-form-item>
          <!--<el-form-item label="宽度">-->
          <!--<num :styleAttr.sync="info['border-width']" :min="0" :max="50"></num>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="圆角">-->
          <!--<num :styleAttr.sync="info['border-radius']" :max="500"></num>-->
          <!--</el-form-item>-->
          <el-form-item label="圆角">
            <el-slider class="slider" size="mini" :min="0" :max="25" v-model.number="style.borderRadius" :step="1"></el-slider>
            <el-input class="input" type='number' :min="0" :max="25" :step='1' size="mini" v-model.number="style.borderRadius" placeholder="0-25"></el-input>
          </el-form-item>
          <el-form-item label="颜色">
            <el-color-picker v-model="info['border-color']" @active-change="colorChange" show-alpha></el-color-picker>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <!--<el-collapse-item title="文字样式" name="text">-->
      <!--<editor-text :info="info"></editor-text>-->
      <!--</el-collapse-item>-->
      <el-collapse-item title="阴影" name="boxShadow">
        <el-form size="mini" label-position="left" label-width="80px" :model="info">
          <el-form-item label="阴影大小">
            <el-slider class="slider" size="mini" :min="0" :max="25" v-model.number="boxShadow.shadow" :step="1"></el-slider>
            <el-input class="input" type='number' :min="0" :max="25" :step='1' size="mini" v-model.number="boxShadow.shadow" placeholder="0-25"></el-input>
          </el-form-item>
          <el-form-item label="阴影模糊">
            <el-slider class="slider" size="mini" :min="0" :max="25" v-model.number="boxShadow.blur" :step="1"></el-slider>
            <el-input class="input" type='number' :min="0" :max="25" :step='1' size="mini" v-model.number="boxShadow.blur" placeholder="0-25"></el-input>
          </el-form-item>
          <el-form-item label="阴影方向">
            <el-slider class="slider" size="mini" :min="0" :max="359" v-model.number="boxShadow.angle" :step="10"></el-slider>
            <el-input class="input" type='number' :min="0" :max="359" :step='1' size="mini" v-model.number="boxShadow.angle" placeholder="0-359"></el-input>
          </el-form-item>
          <el-form-item label="阴影颜色">
            <el-color-picker v-model="boxShadow.color" @active-change="colorChange" show-alpha></el-color-picker>
          </el-form-item>
          <!--<el-form-item label="内边距">-->
          <!--<num :styleAttr.sync="info['padding']" :min="0" :max="400"></num>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="外边距">-->
          <!--<num :styleAttr.sync="info['margin']" :min="0" :max="400"></num>-->
          <!--</el-form-item>-->
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="内外边距" name="margin">
        <el-form size="mini" label-position="left" label-width="80px" :model="info">
          <el-form-item label="内边距">
            <el-slider class="slider" size="mini" :min="0" :max="25" v-model.number="style.padding" :step="1"></el-slider>
            <el-input class="input" type='number' :min="0" :max="25" :step='1' size="mini" v-model.number="style.padding" placeholder="0-25"></el-input>
          </el-form-item>
          <el-form-item label="外边距">
            <el-slider class="slider" size="mini" :min="0" :max="25" v-model.number="style.margin" :step="1"></el-slider>
            <el-input class="input" type='number' :min="0" :max="25" :step='1' size="mini" v-model.number="style.margin" placeholder="0-25"></el-input>
          </el-form-item>
          <!--<el-form-item label="内边距">-->
          <!--<num :styleAttr.sync="info['padding']" :min="0" :max="400"></num>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="外边距">-->
          <!--<num :styleAttr.sync="info['margin']" :min="0" :max="400"></num>-->
          <!--</el-form-item>-->
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .styleEditor {
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
  }

</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import EditorBackground from './Background'
  import Align from './Align'
  import Num from './Num'
  import { isNullOrUndefined } from '../../assets/js/common'

  export default {
    mixins: [BaseComponent],
    name: 'BaseStyleEditor',
    components: {Num, EditorBackground, Align},
    props: {
      info: {
        required: true,
        type: Object
      },
      nodeId: {
        type: String
      }
    },
    data: function () {
      return {
        fixed: false,
        activeNames: ['size', 'border', 'align', 'background', 'border', 'boxShadow', 'margin', 'text'],
        style: {
          borderStyle: 'none',
          borderWidth: 0,
          borderRadius: 0,
          margin: 0,
          padding: 0
        },
        boxShadow: {
          shadow: 0,
          blur: 0,
          angle: 0,
          color: 'rgba(0,0,0,1)'
        }
      }
    },
    computed: {
      fixed_id () {
        return `${this.fixed}_____${this.nodeId}`
      }
    },
    watch: {
      style: {
        deep: true,
        handler: function (newVal) {
          if (newVal.borderWidth === '') newVal.borderWidth = 0
          if (newVal.borderRadius === '') newVal.borderRadius = 0
          if (newVal.margin === '') newVal.margin = 0
          if (newVal.padding === '') newVal.padding = 0
          this.$set(this.info, 'border-width', `${newVal.borderWidth}px`)
          this.$set(this.info, 'border-style', `${newVal.borderStyle}`)
          this.$set(this.info, 'border-radius', `${newVal.borderRadius}px`)
          this.$set(this.info, 'margin', `${newVal.margin}px`)
          this.$set(this.info, 'padding', `${newVal.padding}px`)
        }
      },
      boxShadow: {
        deep: true,
        handler: function (newVal) {
          let shadowH
          let shadowV
          let shadow = newVal.shadow
          let angle = newVal.angle
          if (angle === '') newVal.angle = 0
          if (shadow === '') newVal.shadow = 0
          if (newVal.blur === '') newVal.blur = 0
          let PIangle = function(num) {
            return 2 * Math.PI / 360 * num
          }
          if (angle == 0) {
            shadowH = 0
            shadowV = shadow
          } else if (angle > 0 && angle < 90) {
            shadowH = -parseInt(Math.sin(PIangle(angle)) * shadow)
            shadowV = parseInt(Math.sin(PIangle(90 - angle)) * shadow)
          } else if (angle == 90) {
            shadowH = -shadow
            shadowV = 0
          } else if (angle > 90 && angle < 180) {
            shadowH = -parseInt(Math.sin(PIangle(180 - angle)) * shadow)
            shadowV = -parseInt(Math.sin(PIangle(angle - 90)) * shadow)
          } else if (angle == 180) {
            shadowH = 0
            shadowV = -shadow
          } else if (angle > 180 && angle < 270) {
            shadowH = parseInt(Math.sin(PIangle(angle - 180)) * shadow)
            shadowV = -parseInt(Math.sin(PIangle(270 - angle)) * shadow)
          } else if (angle == 270) {
            shadowH = shadow
            shadowV = 0
          } else if (angle > 270 && angle < 360) {
            shadowH = parseInt(Math.sin(PIangle(360 - angle)) * shadow)
            shadowV = parseInt(Math.sin(PIangle(angle - 270)) * shadow)
          }
          this.$set(this.info, 'box-shadow', `${newVal.color} ${shadowH}px ${shadowV}px ${newVal.blur}px`)
        }
      },
      info: {
        deep: true,
        handler: function (newVal, oldVal) {
          if (newVal.opacity === '') newVal.opacity = 0
          this.makeCssCode()
          this.makeFixed()
        },
        immediate: true
      },
      fixed_id: function (now, old) {
        now = now.split('_____')
        old = (old || '').split('_____')
        if (now[1] !== old[1]) return
        var currentNode = window.$vue
        this.info.position = now[0] === 'true' ? 'fixed' : !currentNode.stacked ? 'relative' : 'absolute'
        if (this.info.position === 'relative') {
          this.info.left = null
          this.info.top = null
        }
      }
    },
    mounted: function () {
      this.style = {
        borderWidth: this.info['border-width'] ? parseFloat(this.info['border-width']) : 0,
        borderRadius: this.info['border-radius'] ? parseFloat(this.info['border-radius']) : 0,
        borderStyle: this.info['border-style'] ? this.info['border-style'] : 'none',
        margin: this.info['margin'] ? parseFloat(this.info['margin']) : 0,
        padding: this.info['padding'] ? parseFloat(this.info['padding']) : 0
      }
    },
    methods: {
      makeFixed: function () {
        this.fixed = this.info && this.info.position == 'fixed'
      },
      makeCssCode: function () {
        var style = []
        if (this.info) {
          // opacity
          var opacity = isNullOrUndefined(this.info.opacity) ? 1 : Number(this.info.opacity) || 1
          this.$set(this.info, 'opacity', opacity)
          for (const key in this.info) {
            if (this.info.hasOwnProperty(key) && key != 'bakedPosition') {
              const element = this.info[key]
              element && style.push(`${key} : ${element};`)
            }
          }
          style = style.sort(function (a, b) {
            return a.key > b.key
          })
          style = style.join('\n    ')
        } else {
          style = ''
        }
        this.cssCode = `.in{
    ${style}
}`
      },
      saveCss (tab, event) {
        var styles = {}
        var codes = this.cssCode
        codes = codes.match(/.*\n/ig) || []
        codes.forEach(element => {
          var item = element.split(/:(?!\/\/)/)
          if (item.length == 2) {
            var k = item[0].trim()
            var val = item[1].trim().replace(/;$/, '')
            if (val !== 'null') {
              styles[k] = val
            }
          }
        })
        this.$emit('update:info', styles)
      },
      colorChange: function (e, key) {
        this.$set(this.info, 'border-color', e)
      },
    }
  }
</script>

