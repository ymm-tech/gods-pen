<template>
  <div class="tinymce-container editor-container" :class="{fullscreen:fullscreen}">
    <textarea class="tinymce-textarea" :id="tinymceId"></textarea>
    <el-input style='font-size: 12px;' v-model="filepath" ref="fileInput" class="file-input" size="small" type="file" accept='.doc,.docx'>
      <template slot="prepend"><span style="margin-left: -12px;margin-right: -12px;">word文档解析</span></template>
      <template slot="append"><div @click="word2html">开始解析</div></template>
    </el-input>
  </div>
</template>

<script>
  import BaseComponent from 'src/extend/BaseComponent'
  import Server from 'src/extend/Server'

  export default {
    mixins: [BaseComponent],
    name: 'richText',
    components: {
    },
    props: {
      id: {
        type: String
      },
      value: {
        type: String,
        default: ''
      },
      toolbar: {
        type: Array,
        required: false,
        default () {
          return []
        }
      },
      height: {
        type: Number,
        required: false,
        default: 360
      }
    },
    data () {
      return {
        hasChange: true,
        hasInit: false,
        tinymceId: 'vue-tinymce-' + +new Date(),
        fullscreen: false,
        filepath: ''
      }
    },
    watch: {
      id () {
        this.filepath = ''
        if (this.hasInit) {
          this.$nextTick(() => this.setContent(this.value || ''))
        }
      },
      filepath (val) {
        if (val === '') {
          this.file = null
          return
        }
        const target = this.$refs.fileInput.$el.querySelector('input')
        const file = target && target.files && target.files[0]
        if (file) this.file = file
      }
    },
    mounted () {
      this.initTinymce()
    },
    activated () {
      this.initTinymce()
    },
    deactivated () {
      this.destroyTinymce()
    },
    methods: {
      word2html () {
        if (!this.file) return this.$message('请先选择 word 文档')
        const data = new FormData()
        data.set('file', this.file)
        const loading = this.$loading({
          lock: true,
          text: '拼命解析中。。。',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        Server({
          url: 'transform/word2html',
          method: 'post',
          data: data
        }).then(({data} = {}) => {
          loading.close()
          this.filepath = ''
          const htmlStr = data.data && data.data.html
          const $content = document.createElement('div')
          $content.innerHTML = htmlStr.replace(/<\/?script[^>]>/i, '').replace(/on(load|error)\s*=\s*["']/i, '$1="')
          this.setContent($content.innerHTML)
        }).catch((e) => {
          loading.close()
          console.log(e)
        })
      },
      getTinymce: function () {
        return window.tinymce.get(this.tinymceId)
      },
      selectImage: function () {
        var me = this
        this.openDialog({
          name: 'd-resourceSelect',
          data: {
            type: 'image'
          },
          methods: {
            onSelectImage: function (url) {
              me.getTinymce().insertContent(`<img class="wscnph" src="${url}" >`)
            }
          }
        })
      },
      initTinymce () {
        const _this = this
        window.tinymce.init({
          selector: `#${this.tinymceId}`, // 初始化的元素
          content_style: 'figure.align-left{float:left}figure.align-right{float:right}figure.image{display:inline-block;border:1px solid gray;margin:0 2px 0 1px;background:#f5f2f0}figure.image img{margin:8px 8px 0 8px}figure.image figcaption{margin:6px 8px 6px 8px;text-align:center}img.align-left{float:left}img.align-right{float:right}.mce-toc{border:1px solid gray}.mce-toc h2{margin:4px}.mce-toc li{list-style-type:none}p{margin:.5em 0}', // 样式
          language: 'zh_CN', // 对语言的汉化
          height: this.height, // 设置可编辑区域的高度。它不包括菜单栏，工具栏或状态栏所需的空间
          // width: 320, // 以像素为单位设置编辑器的宽度
          body_class: 'panel-body',
          object_resizing: true,
          branding: true,
          image_advtab: true,
          toolbar: [
            'formatselect bold italic underline strikethrough alignleft aligncenter alignright outdent indent',
            'fontsizeselect undo redo removeformat bullist numlist link  charmap preview ',
            'insertdatetime media table forecolor backcolor hr image myupload'],
          menubar: false,
          plugins: ['advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'],
          end_container_on_empty_block: true,
          powerpaste_word_import: 'clean',
          code_dialog_height: 320,
          code_dialog_width: 1000,
          fontsize_formats: '8px 10px 12px 14px 16px 18px 20px 22px 24px 26px 28px 30px 32px 34px 36px',
          advlist_bullet_styles: 'default,circle,disc,square',
          advlist_number_styles: 'default,lower-alpha,lower-greek,lower-roman,upper-alpha,upper-roman',
          imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io', 'ymm56.com'],
          default_link_target: '_blank',
          link_title: false,
          init_instance_callback: editor => {
            if (_this.value) {
              editor.setContent(_this.value)
            }
            _this.hasInit = true
            editor.on('KeyUp ExecCommand SetContent', () => {
              this.hasChange = true
              var content = editor.getContent()
              this.$emit('input', content)
            })
          },
          setup (editor) {
            editor.on('FullscreenStateChanged', (e) => {
              _this.fullscreen = e.state
            })
            editor.addButton('myupload', {
              text: '上传图片',
              icon: false,
              onclick: function () {
                _this.selectImage()
              }
            })
          }
        })
      },
      destroyTinymce () {
        if (window.tinymce.get(this.tinymceId)) {
          window.tinymce.get(this.tinymceId).destroy()
        }
      },
      setContent (value) {
        window.tinymce.get(this.tinymceId).setContent(value)
      },
      getContent () {
        window.tinymce.get(this.tinymceId).getContent()
      }
    },
    destroyed () {
      this.destroyTinymce()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .tinymce-container {
    position: relative;
  }
  .tinymce-container >>> .mce-fullscreen {
    z-index: 10000;
  }
  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }
  .editor-custom-btn-container {
    right: 4px;
    top: 4px;
    /*z-index: 2005;*/
  }
  .fullscreen .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
  }
  .editor-upload-btn {
    display: inline-block;
  }
  .file-input >>> input {
    line-height: 1;
    padding-top: 6px;
    padding-left: 5px;
    border-radius: 0;
    color: #fff;
  }
  .file-input >>> input:hover {
    border-color: #505152
  }
  .file-input >>> .el-input-group__append {
    border-radius: 0
    color: #fff;
  }
</style>
