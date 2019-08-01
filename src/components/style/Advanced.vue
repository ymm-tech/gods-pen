<template>
  <div class="styleEditor">
    <el-tabs class='style-tab tab' v-model="activeName">
      <template v-if="flutter">
        <el-tab-pane  label="flutter 模式" name="flutter">
          <editor-flutter :node-id='nodeId' :info="info"></editor-flutter>
        </el-tab-pane>
      </template>
      <template v-if="!flutter">
        <el-tab-pane label="基础模式" name="base">
          <editor-base :node-id='nodeId' :info="info"></editor-base>
        </el-tab-pane>
        <el-tab-pane label="高级模式" name="first">
          <el-collapse v-model="activeNames">
            <el-collapse-item class='collapseItem' v-for="(item,key) in lists" :key='key' :name="key">
              <template slot="title" class=''>
                {{item.label}}
              </template>
              <component :is="item.component" :info="info"></component>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <el-tab-pane label="代码" name="second" lazy>
          <code-editor class='cssEditor' ctype='css' :contents.sync='cssCode'></code-editor>
          <el-button type="primary" class="save" @click="saveCss">保存</el-button>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .styleEditor {
    height 100%
    padding: 0 10px;

    .style-tab {
      height 100%
      display flex
      flex-direction column
    }
    .save {
      width: 50%;
      margin: 10px auto;
      display: block;
    }

    .collapseItem {
      position: relative;
    }

    .header-icon {
      position: absolute;
      right: 30px;
      top: 18px;
    }

    .cssEditor {
      height: 300px;
      width: 100%;
    }
  }
</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import EditorLayout from './Layout'
  import EditorSize from './Size'
  import EditorPosition from './Position'
  import EditorBorder from './Border'
  import EditorRadius from './Radius'
  import EditorText from './Text'
  import Align from './Align'
  import EditorBackground from './Background'
  import CodeEditor from '../code/index'
  import EditorBase from './Base'
  import EditorFlutter from './Flutter'

  export default {
    mixins: [BaseComponent],
    name: 'AdvancedStyleEditor',
    // eslint-disable-next-line
    components: {EditorBase, EditorFlutter, EditorLayout, EditorSize, EditorPosition, EditorBorder, EditorRadius, EditorText, EditorBackground, CodeEditor, Align},
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
        activeName: 'base',
        cssCode: '',
        lists: [{
          label: '对齐',
          component: 'Align'
        },
        {
          label: '宽高',
          component: 'EditorSize'
        },
        {
          label: '定位',
          component: 'EditorPosition'
        }, {
          label: '内外边距',
          component: 'EditorLayout'
        }, {
          label: '边框',
          component: 'EditorBorder'
        }, {
          label: '圆角',
          component: 'EditorRadius'
        }, {
          label: '背景',
          component: 'EditorBackground'
        }, {
          label: '文字样式',
          component: 'EditorText'
        }],
        currentPage: '',
        activeNames: [0, 1, 2, 3, 4, 5, 6]
      }
    },
    computed: {
      flutter () {
        return this.$store.state.viewOption.pageType == 1
      }
    },
    watch: {
      flutter: {
        handler (val) {
          this.activeName = val ? 'flutter' : 'base'
        },
        immediate: true
      },
      info: {
        deep: true,
        handler: function (newVal, oldVal) {
          var me = this
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(function (params) {
            me.makeCssCode()
          }, 0)
        }
      }
    },
    mounted: function () {
      this.makeCssCode()
    },
    methods: {
      makeCssCode: function () {
        var style = []
        if (this.info) {
          for (const key in this.info) {
            if (this.info.hasOwnProperty(key)) {
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
        for (const key1 in this.info) {
          if (!styles[key1]) {
            console.log('删除没用的元素', key1)
            this.$delete(this.info, key1)
          }
        }
        for (const key in styles) {
          console.log(key, styles[key])
          this.$set(this.info, key, styles[key])
        }
      }
    }
  }
</script>

