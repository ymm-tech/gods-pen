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
            const canvas = data.canvas || {}
            const forDesktop = (/desktop/i).test(canvas.name)
            this.setViewPort(canvas.width, forDesktop)
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
          const canvas = info && info.canvas || {}
          const forDesktop = (/desktop/i).test(canvas.name)
          this.setViewPort(canvas.width, forDesktop)
          this.nodeInfo = info
          this.setPageTitle(data.name)
        })
      },
      setViewPort (width = 320, forDesktop = false) {
        width = parseInt(width) || 320
        document.documentElement.classList.add(forDesktop ? 'for-desktop' : 'for-mobile')
        const query = document.querySelector.bind(document)
        if (window.isDesktop) {
          if (forDesktop) {
            Promise.resolve(query('#desktop-bg')).then(t => t && t.remove())
            Promise.all([query('#app'), query('#app-wrapper')]).then(([app, wrapper]) => app && wrapper && query('body').replaceChild(app, wrapper))
          } else {
            var $appFixed = query('#app-fixed')
            var $appWrapper = query('#app-wrapper')
            if (!$appFixed || !$appWrapper) return
            var scale = 320 / width
            $appWrapper.style.width = $appWrapper.clientWidth / scale + 'px'
            $appWrapper.style.height = $appWrapper.clientHeight / scale + 'px'
            $appFixed.style.width = width + 'px'
            $appFixed.style.height = width / 0.564373897707231 + 'px'
            $appFixed.style.left = parseFloat(window.getComputedStyle($appFixed).left) / scale + 'px'
            $appFixed.style.top = parseFloat(window.getComputedStyle($appFixed).top) / scale + 'px'
            $appWrapper.style.marginLeft = parseFloat($appWrapper.style.width) / -2 + 'px'
            $appWrapper.style.marginTop = parseFloat($appWrapper.style.height) / -2 + 'px'
          }
        } else if (!forDesktop) {
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
