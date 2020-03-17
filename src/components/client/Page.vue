<template>
  <t-node :info="nodeInfo" v-if="nodeInfo"></t-node>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  @require '../../assets/style/base.styl';

  .page.home {
  }
</style>
<script type="text/ecmascript-6">
  import BasePage from '../../extend/BasePage'
  import tNode from '../../components/PerviewNode'
  import {fetch} from '../../extend/fetch'

  export default {
    name: 'home',
    mixins: [BasePage],
    components: {tNode},
    pageName: '',
    created () {
    },
    data: function () {
      return {
        info: null,
        nodeInfo: null
      }
    },
    mounted: function () {
      this.loadPageInfo()
    },
    watch: {
      '$route' (to, from) {
        // 对路由变化作出响应...
        if (to.path != from.path) {
          // 如果页面改变。load新页面加入
          this.loadPageInfo()
        }
      }
    },
    methods: {
      loadDemoInfo () {
        window.addEventListener('message', (e) => {
          var data = e.data
          if (data && data.type == 'preview') {
            this.setViewPort(data.canvas && data.canvas.width)
            var content
            try {
              content = JSON.parse(data.content)
            } catch (error) {
            }
            this.nodeInfo = content
            this.setPageTitle('demo')
          }
        }, false)
      },
      loadPageInfo: function () {
        this.nodeInfo = null
        var pageKey = this.$route.params.pageKey
        var historyid = this.$route.query.historyid
        if (pageKey === '__demomode') return this.loadDemoInfo()
        var data = {
          scene: this.$route.query.preview ? 'preview' : historyid ? 'history_preview' : 'render',
          pageKey
        }
        if (historyid) {
          data.historyid = historyid
        }
        if (!pageKey) {
          console.log('缺少页面id')
          return
        }
        fetch(`${this.Config.API_PATH}editor/pages/detail`, {
          method: 'post',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        .then(v => v.json())
        .then((respond) => {
          var data = respond.data
          this.info = data
          var info = null
          var content = this.info.content
          try {
            info = JSON.parse(content)
          } catch (error) {
          }
          this.setViewPort(info && info.canvas && info.canvas.width)
          this.nodeInfo = info
          this.setPageTitle(data.name)
        })
      },
      setViewPort (width = 320) {
        width = parseInt(width) || 320
        if (window.isDesktop) {
          var $appFixed = document.getElementById('app-fixed')
          $appFixed.style.width = width + 'px'
          $appFixed.style.height = width / 0.564373897707231 + 'px'
          $appFixed.style.transform = `translate3D(0,0,0) scale(${320 / width})`
          $appFixed.style.webkitTransform = `-webkit-translate3D(0,0,0) scale(${320 / width})`
        } else {
          // 设置画布宽度，并缩放视口至画布等大
          var i = window.__clientWidth__ = window.__clientWidth__ || document.documentElement.clientWidth || 320
          var e = i / width
          var o = `width=${width}, initial-scale=${e}, maximum-scale=${e}, user-scalable=no`
          document.getElementById('viewport').setAttribute('content', o)
        }
      }
    }
  }
</script>
