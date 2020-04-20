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
          <el-form-item v-if="!showPosition" label="居中">
            <el-switch size="mini" v-model="marginAuto"></el-switch>
          </el-form-item>
          <editor-position v-if="showPosition" :info="info"></editor-position>
          <el-form-item label="透明度">
            <div class="sliderWarp">
            <el-slider class="slider" size="mini" :min="0" :max="1" v-model.number="opacity" :step="0.1"></el-slider>
            <el-input class="input" type='number' :min="0.1" :max="1" :step='0.1' size="mini" v-model.number="opacity" placeholder="0-1"></el-input>
            </div>
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
            <div class="sliderWarp">
            <el-select v-model="border.style" placeholder="边框类型">
              <el-option v-for='item in Metadata.style.borderStyle' :key="item.value" :label="item.label || item.value" :value="item.value" :title="item.desc">
                <span style="float: left">{{ item.label || item.value }}</span>
                <a style="float: right; font-size: 13px;" class="iconfont icon-info-light" :title="item.desc"></a>
              </el-option>
            </el-select>
            <el-color-picker v-model="border.color" show-alpha></el-color-picker>
            </div>
          </el-form-item>
          <el-form-item label="宽度">
            <div class="sliderWarp">
            <el-slider class="slider" size="mini" :min="0" :max="50" v-model.number="border.width" :step="1"></el-slider>
            <el-input class="input" type='number' :min="0" :max="50" :step='1' size="mini" v-model.number="border.width"  placeholder="0-50"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="圆角">
            <div class="sliderWarp">
              <el-slider class="slider" size="mini" :min="0" :max="50" v-model.number="borderRadius" :step="1"></el-slider>
              <el-input class="input" type='number' :min="0" :max="50" :step='1' size="mini" v-model.number="borderRadius" placeholder="0-50"></el-input>
            </div>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="阴影" name="boxShadow">
        <el-form size="mini" label-position="left" label-width="80px" :model="info">
          <el-form-item label="阴影大小">
            <div class="sliderWarp">
            <el-slider class="slider" size="mini" :min="-150" :max="150" v-model.number="boxShadow.spread" :step="1"></el-slider>
            <el-input class="input" type='number' :min="-150" :max="150" :step='1' size="mini" v-model.number="boxShadow.spread" placeholder="+-150"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="模糊半径">
            <div class="sliderWarp">
            <el-slider class="slider" size="mini" :min="0" :max="150" v-model.number="boxShadow.blur" :step="1"></el-slider>
            <el-input class="input" type='number' :min="0" :max="150" :step='1' size="mini" v-model.number="boxShadow.blur" placeholder="0-150"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="横向偏移">
            <div class="sliderWarp">
            <el-slider class="slider" size="mini" :min="-150" :max="150" v-model.number="boxShadow.x" :step="1"></el-slider>
            <el-input class="input" type='number' :min="-150" :max="150" :step='1' size="mini" v-model.number="boxShadow.x" placeholder="+-150"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="纵向偏移">
            <div class="sliderWarp">
            <el-slider class="slider" size="mini" :min="-150" :max="150" v-model.number="boxShadow.y" :step="1"></el-slider>
            <el-input class="input" type='number' :min="-150" :max="150" :step='1' size="mini" v-model.number="boxShadow.y" placeholder="+-150"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="阴影颜色">
            <el-color-picker v-model="boxShadow.color" show-alpha></el-color-picker>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="边距" name="margin">
        <el-form size="mini" label-position="left" label-width="80px" :model="info">
          <el-form-item label="内边距">
            <div class="sliderWarp">
            <el-slider class="slider" size="mini" :min="0" :max="100" v-model.number="padding" :step="1"></el-slider>
            <el-input class="input" type='number' :min="0" :max="100" :step='1' size="mini" v-model.number="padding" placeholder="0-25"></el-input>
            </div>
          </el-form-item>
          <template v-if="!fixedOrAbsolute">
            <el-form-item label="上边距">
            <div class="sliderWarp">
              <el-slider class="slider" size="mini" :min="0" :max="250" v-model.number="margin.top" :step="1"></el-slider>
              <el-input class="input" type='number' :min="0" :max="250" :step='1' size="mini" v-model.number="margin.top" placeholder="0-25"></el-input>
            </div>
          </el-form-item>
            <el-form-item label="左边距">
              <div class="sliderWarp">
              <el-slider class="slider" size="mini" :min="0" :max="250" v-model.number="margin.left" :step="1"></el-slider>
              <el-input class="input" type='number' :min="0" :max="250" :step='1' size="mini" v-model.number="margin.left" placeholder="0-25"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="右边距">
              <div class="sliderWarp">
              <el-slider class="slider" size="mini" :min="0" :max="250" v-model.number="margin.right" :step="1"></el-slider>
              <el-input class="input" type='number' :min="0" :max="250" :step='1' size="mini" v-model.number="margin.right" placeholder="0-25"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="下边距">
              <div class="sliderWarp">
              <el-slider class="slider" size="mini" :min="0" :max="250" v-model.number="margin.bottom" :step="1"></el-slider>
              <el-input class="input" type='number' :min="0" :max="250" :step='1' size="mini" v-model.number="margin.bottom" placeholder="0-25"></el-input>
              </div>
            </el-form-item>
          </template>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="文字样式" name="text">
        <editor-text :info="info"></editor-text>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .styleEditor {
    .sliderWarp {
      display: flex;
    }

    .input {
      width: 68px;
    }

    .slider {
      width: 90px;
      flex: 1;
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
  import common from 'src/assets/js/common'
  import EditorBackground from './Background'
  import Align from './Align'
  import Num from './Num'
  import EditorPosition from './Position'
  import EditorText from './Text'

  export default {
    mixins: [BaseComponent],
    name: 'BaseStyleEditor',
    components: {Num, EditorBackground, Align, EditorPosition, EditorText},
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
        showPosition: false,
        activeNames: ['size', 'border', 'align', 'background', 'border', 'boxShadow', 'margin', 'text'],
        padding: 0,
          borderRadius: 0,
        border: {
          style: '',
          width: 0,
          color: '',
        },
        opacity: 1,
        margin: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        },
        boxShadow: {
          spread: 0,
          blur: 0,
          x: 0,
          y: 0,
          color: 'rgba(0,0,0,1)',
          inset: ''
        }
      }
    },
    computed: {
      fixedOrAbsolute () {
        if (this.info.position && (this.info.position == 'fixed' || this.info.position == 'absolute')) {
          return true
        } else {
          return false
        }
      },
      marginAuto: {
        get () {
          const style = this.info
          return /^\s*auto/.test(style['margin-left']) && /^\s*auto/.test(style['margin-right'])
        },
        set (val) {
          if (val) {
            this.$set(this.info, 'margin-left', 'auto')
            this.$set(this.info, 'margin-right', 'auto')
          } else {
            this.$delete(this.info, 'margin-left')
            this.$delete(this.info, 'margin-right')
          }
        }
      },
      boxShadowStr: {
        get () {
          return `${this.boxShadow.x}px ${this.boxShadow.y}px ${this.boxShadow.blur}px ${!this.boxShadow.spread ? '' : this.boxShadow.spread + 'px'} ${this.boxShadow.color || ''} ${this.boxShadow.inset || ''}`.trim()
        },
        set (str = '') {
          const raw = str.replace(/,\s+/g, ',').split(/\s+/)
          const arr = []
          let inset = ''
          let color = ''
          for (let attr of raw) {
            if (/^-?[\d.]+/.test(attr)) arr.push(parseFloat(attr))
            else if (/inset/.test(attr)) inset = 'inset'
            else if (/^(#|rgb)/.test(attr)) color = attr.replace(/,\s*/g, ', ')
          }
          const [x = 0, y = 0, blur = 0, spread = 0] = arr
          this.boxShadow = {
            x, y, blur, spread, color, inset
          }
        }
      },
      marginStr: {
        get () {
          return ['top', 'right', 'bottom', 'left'].map(v => `${this.margin[v] || 0}px`).join(' ')
        },
        set (val) {
          const info = common.trbl(val, '')
          this.margin = Object.keys(info).reduce((o, k) => {
            let val = info[k]
            o[k] = /px$/.test(val) ? parseFloat(val) : val || 0
            return o
          }, {})
        }
      },
      borderStr: {
        set (val = '') {
          const raw = val.replace(/,\s+/g, ',').split(/\s+/)
          let color = ''
          let width = 0
          let style = ''
          for (let attr of raw) {
            if (/^(rgba|#)/.test(attr)) color = attr.replace(/,\s*/g, ', ')
            if (/^[\d.]+/.test(attr)) width = parseFloat(attr)
            if (/^[a-z]+$/.test(attr)) style = attr
          }
          this.border = {
            color, width, style
      }
    },
        get () {
          return `${this.border.style} ${this.border.width}px ${this.border.color}`
        }
      },
      borderRadiusStr: {
        get () {
          return this.borderRadius + 'px'
        },
        set (val = '') {
          this.borderRadius = parseFloat(val) || 0
          }
      },
      paddingStr: {
        set (val = '') {
          this.padding = parseFloat(val) || 0
        },
        get () {
          return this.padding + 'px'
          }
        }
      },
    watch: {
      boxShadowStr (val = '') {
        this.$set(this.info, 'box-shadow', val)
      },
      marginStr (val = '') {
        this.$set(this.info, 'margin', val)
      },
      borderStr (val = '') {
        this.$set(this.info, 'border', val)
      },
      borderRadiusStr (val = '') {
        this.$set(this.info, 'border-radius', val)
      },
      paddingStr (val = '') {
        this.$set(this.info, 'padding', val)
      },
      opacity (val = 1) {
        this.$set(this.info, 'opacity', val)
      },
      info: {
        deep: true,
        handler: function (newVal, oldVal) {
          this.showPosition = window.$vue && !window.$vue.isRootNode && this.fixedOrAbsolute
          this.boxShadowStr = newVal['box-shadow']
          this.marginStr = newVal['margin']
          this.borderStr = newVal['border']
          this.borderRadiusStr = newVal['border-radius']
          this.paddingStr = newVal['padding']
          this.opacity = newVal['opacity'] || 1
        },
        immediate: true
      },
    },
    mounted: function () {
    },
    methods: {
      makeCssCode: function () {
        var style = []
        if (this.info) {
          for (const key in this.info) {
            if (this.info.hasOwnProperty(key) && key != 'bakedPosition') {
              const element = this.info[key]
              element && style.push([key, element])
            }
          }
          style = style.sort(function (a, b) {
            return (a[0] && a[0].length) > (b[0] && b[0].length) ? 1 : -1
          })
          style = style.map(([k, v] = []) => `${k} : ${v};`).join('\n    ')
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
    }
  }
</script>

