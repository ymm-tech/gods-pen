<template>
  <div class="dataEditor">
    <code-editor ctype="json" :contents.sync="inContent"></code-editor>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .dataEditor {
    height: 300px;
    width: 100%;
  }
</style>

<script type="text/ecmascript-6">
  /**
   * 数据编辑器，
   * 后续扩展接口访问支持
   */
  import BaseComponent from 'src/extend/BaseComponent'
  import CodeEditor from '../code/index'
  let timer
  export default {
    mixins: [BaseComponent],
    name: 'DataEditor',
    components: {CodeEditor},
    props: {
      content: {
        type: [String, Array, Object]
      },
      /**
       * 支持 空，array，object
       */
      type: {
        type: String
      }
    },
    watch: {
      inContent: function (newVal) {
        this.isEditorChange = true
        if (this.type) {
          try {
            newVal = JSON.parse(newVal)
          } catch (e) {

          }
        }
        this.$emit('update:content', newVal)
        this.$emit('change', newVal)
        if (timer === null || timer === undefined) {
          timer = setTimeout(v => {
            clearTimeout(timer)
            timer = null
            this.isEditorChange = false
          }, 100)
        }
      },
      content: {
        handler (newVal) {
          if (!this.isEditorChange) {
            if (this.type) {
              try {
                this.inContent = JSON.stringify(this.content, null, 2)
              } catch (error) {
              }
            }
          }
        },
        deep: true,
        immediate: true
      }
    },
    data: function () {
      return {
        inContent: '',
        isEditorChange: false // 记录是编辑器输入改变了值，而不是重新传入的
      }
    },
    mounted: function () {
      if (this.type) {
        this.inContent = JSON.stringify(this.content, null, 2)
      }
    },
    methods: {
    }
  }
</script>

