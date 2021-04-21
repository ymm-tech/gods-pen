<template>
  <div class="pageInfo widget" v-if="pageInfo">
    <div>发布地址</div>
    <img :src="qrUrl" v-if="qrUrl" class="qrcode" alt="">
    <div class="outLink">
      <div>
        链接
        <i class="iconfont icon-link"></i>&nbsp;
        <a target="_blank" :href="outUrl">{{outUrl}}</a>&nbsp;
        <el-button type="primary" size="mini" @click="copy(outUrl)">拷贝</el-button>
      </div>
      <div v-if="isYmm(outUrl)">
        短链
        <i class="iconfont icon-link"></i>&nbsp;
        <a target="_blank" :href="outShortUrl">{{outShortUrl}}</a>&nbsp;
        <el-button type="primary" size="mini" @click="copy(outShortUrl)">拷贝</el-button>
      </div>
    </div>
    <el-form ref="form" label-position='left' size="mini" :model="pageInfo" label-width="80px">
      <el-form-item label="页面名称">
        <el-input v-model="pageInfo.name"></el-input>
      </el-form-item>
      <el-form-item label="页面key">
        <el-input disabled v-model="pageInfo.key"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="savePage">保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .pageInfo {
    max-width: 600px;
    margin: auto;
    .dingding{
      margin auto
      width 80%
    }
  }
</style>

<script type="text/ecmascript-6">
  /**
   * 脚本编辑管理
   */
  import QRCode from 'qrcode'
  import BaseComponent from 'src/extend/BaseComponent'
  import common from 'src/assets/js/common'
  import Config from 'src/config'

  export default {
    mixins: [BaseComponent],
    name: 'WidgetPageInfo',
    components: {},
    data: function () {
      return {
        qrUrl: '',
        pageInfo: null,
        outShortUrl: ''
      }
    },
    computed: {
      outUrl: function () {
        var urlInfo = common.parseURL(window.location.href)
        var temp = new Image()
        temp.src = `${Config.VIEW_PATH}` + urlInfo.params.key
        console.log('srcout', temp.src)
        common.fetch('https://dwz.ymm56.com/dwz-web/dwz/generate?url=' + encodeURIComponent(temp.src)).then((json) => {
          if (json.data) {
            this.outShortUrl = json.data
          }
        })
        return temp.src
      },
    },
    mounted: function () {
      this.pageInfo = window.Editor.pageInfo
      this.setQRUrl()
    },
    methods: {
      setQRUrl: function () {
        const urlInfo = common.parseURL(window.location.href)
        const url = `${Config.VIEW_PATH}` + urlInfo.params.key
        try {
          QRCode.toDataURL(url).then(value => { this.qrUrl = value })
        } catch (e) {
          console.error('生成二维码出错：', e.message)
        }
      },
      copy: function (params) {
        this.ema.fire('clipboard.copy', params)
      },
      savePage: function (params) {
        window.Editor.savePage()
      },
      isYmm (url) {
        return /ymm56\.com|ymmoa\.com/.test(url)
      }
    }
  }
</script>
