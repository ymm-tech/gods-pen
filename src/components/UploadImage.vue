<template>
  <el-button :size="size" id="virtualUpload"  v-show="showBtn" type="primary">上传
    <i class="el-icon-upload el-icon--right"></i>
  </el-button>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus"></style>
<script type="text/ecmascript-6">
  /**
   * 选择图片上传组件
   */
  import Util from 'src/extend/Util'
  import UploadImg from 'src/extend/UploadImg'
  import BaseComponent from 'src/extend/BaseComponent'

  export default {
    mixins: [BaseComponent],
    name: 'UploadImage',
    components: {},
    props: {
      /**
       * html2canvas组件的配置参数
       */
      h2c: {
        required: false,
        type: Object,
        default: function () {
          return {}
        }
      },
      /**
       * 设置一个元素id。方便查找该元素，设置为截图目标元素
       */
      templateElement: {
        type: String
      },
      size: {
        type: String,
        default: 'medium'
      },
      /**
       * 设置一个元素id。方便查找该元素，设置为截图目标元素
       */
      accept: {
        type: String,
        default: 'image'
      },
      /**
       * 是否选择图片否自动上传
       */
      auto: {
        type: Boolean,
        default: false
      },
      /**
       * 是否显示上传按钮
       */
      showBtn: {
        type: Boolean,
        default: false
      },
      skipSizeCheck: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        uploadObject: null,
        options: null,
        onUploaded: null,
        templateData: {
          name: '',
          desc: ''
        }
      }
    },
    watch: {
      accept: function (value) {
        this.uploadObject = new UploadImg({
          id: this.$el,
          skipSizeCheck: this.skipSizeCheck,
          isAddUploadFile: this.auto,
          filters: this.accept,
          callback: (src) => {
            this.$emit('uploadSuccess', src)
            typeof this.onUploaded === 'function' && this.onUploaded(src)
          }
        })
      }
    },
    beforeDestroy: function () {
    },
    mounted: function () {
      this.uploadObject = new UploadImg({
        id: this.$el,
        skipSizeCheck: this.skipSizeCheck,
        isAddUploadFile: this.auto,
        filters: this.accept,
        callback: (src) => {
          this.$emit('uploadSuccess', src)
          typeof this.onUploaded === 'function' && this.onUploaded(src)
        }
      })
      this.ema.bind('saveTemplate', () => {
        this.options = null
        this.onUploaded = null
        this.getImageDataByDom(document.querySelector(this.templateElement), (dataUrl) => {
          this.uploadImg(dataUrl)
        })
      })
    },
    methods: {
      /**
       * 获取图片数据进行上传
       */
      upload: function (dom, options, callback) {
        this.options = options || null
        this.onUploaded = callback || null
        var fileName = this.options['fileName']
        dom = dom || document.querySelector(this.templateElement)
        this.getImageDataByDom(dom, (dataUrl) => {
          this.uploadImg(dataUrl, fileName)
        })
      },
      /**
       * 上传图片
       * @augments dataUrl String 图片的base64字符串
       */
      uploadImg (dataUrl, fileName) {
        let name = fileName || ('ymm' + new Date().getTime() + '.png')
        let me = this
        var files = new window.File([Util.getBlobBydataURI(dataUrl, 'image/png')], name, {
          type: 'image/png',
        })
        me.uploadObject.uploader.addFile(files)
        me.uploadObject.send(name)
      },
      getImageDataByDom (dom, callback) {
        this.h2c.ignoreElements = function (element) {
          if (element.hasAttribute('ignorehtml2canvas')) {
            return true
          } else {
            return false
          }
        }
        Util.html2canvas(dom, this.h2c).then(canvas => {
          var dataUrl = canvas.toDataURL()
          callback && callback(dataUrl)
        })
      }
    }
  }
</script>

