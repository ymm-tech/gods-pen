<template>
  <el-dialog class="preview-app" :title="title" width="448px" :modal="true" :visible.sync="Visible" @close="close">
    <div class="phone-box">
      <iframe ref="previewframe" class='iframe' border="0" :src="preUrl"></iframe>
      <!-- <div class="outLink"></div> -->
    </div>
    <div class="qr-code-bar" :class="{'qr-open': qrOpen}" @click='qrOpen = !qrOpen'>
      <img :src="qrUrl" class="qrcode" alt="">
    </div>
  </el-dialog>
</template>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @require '../assets/style/base.styl';

  .preview-app {
    > .el-dialog {
      margin: 0 auto 0 auto !important;
      width: 448px;
      // top: 50%;
      > .el-dialog__header {
        // display none
        background-color: #0e0e0e;
      }
    }
    .phone-box {
      width: 448px;
      height: 915px;
    }

    .el-dialog {
    }

    .el-dialog__body {
      padding: 0;
    }

    .iframe {
      border: 0;
      width: 448px;
      height: 915px;
      display: block;
      margin: 0 auto;
      overflow: hidden;
    }
    .qr-code-bar {
      position absolute
      top 56px
      right 0;
      size(0)
      &::after {
        position absolute
        top 12px;
        left: 2px;
        content: 'QR'
        font-weight bolder
      }
      &::before {
        content: ''
        display inline-block
        border: solid 25px transparent;
        size(0)
        border-right: solid 25px transparent;
        border-left-color: #fff;
        border-left-width: 40px;
        transition all .5s
      }
      img {
        size(0)
        display block
        opacity 0
        margin 0
        margin-top -25px;
        transition opacity 0.5s
      }
      cursor pointer
      &.qr-open {
        width: 266px;
        right -239px;
        &::before {
          content: ''
          display block
          float left
          border: solid 25px transparent;
          border-left: solid 25px transparent;
          border-right-color: #fff;
          border-right-width: 40px;
        }
        &::after {
          left: 40px;
        }
        img {
          size(200px)
          opacity 1
          float left
        }
      }
    }
    .outLink {
    }
  }
</style>
<script type="text/ecmascript-6">
  import QRCode from 'qrcode'
  import BaseDialog from 'src/extend/BaseDialog'
  import Config from 'src/config'
  export default {
    mixins: [BaseDialog],
    name: 'd-preview',
    data: function () {
      return {
        qrUrl: '',
        qrOpen: false,
        title: '预览',
        key: ''
      }
    },
    mounted () {
      if (this.demoMode) {
        this.$nextTick(() => this.postData())
      }
    },
    computed: {
      preUrl: function () {
        return `${Config.VIEW_PATH}${this.demoMode ? '__demomode' : this.key}?preview=1`
      },
    },
    watch: {
      preUrl: {
        handler: function (newVal) {
          try {
            QRCode.toDataURL(newVal).then(value => { this.qrUrl = value })
          } catch (e) {
            console.error('生成二维码出错：', e.message)
          }
        },
        immediate: true
      }
    },
    methods: {
      postData () {
        var $previewframe = this.$refs['previewframe'].contentWindow
        var content = window.localStorage.getItem('EditorautoSave_tmp')
        setTimeout(() => {
          $previewframe.postMessage({type: 'preview', content: content, canvas: this.$store.state.setting.phoneSize}, '*')
        }, 1000)
      }
    }
  }
</script>
