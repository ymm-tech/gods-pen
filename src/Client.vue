<template>
  <div class="app" id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <toast :compromise="true"></toast>
    <loading></loading>
    <img-viewer ref="imgViewer"></img-viewer>
  </div>
</template>

<script>
  import Toast from './components/client/Toast'
  import Loading from './components/client/Loading'
  import ImgViewer from './components/client/ImgViewer'
  import {MessageBox} from 'mint-ui'
  import EMA from './assets/js/singleton-ema'
  import vuexStore from './store'

  export default {
    name: 'app',
    components: {Toast, Loading, ImgViewer},
    data: function () {
      return {
      }
    },
    store: vuexStore,
    created: function () {
      window.msgBox = MessageBox // http://qastatic.ymm56.com/mint-ui-docs/#!/zh-cn2/message-box
      window.alert = function (msg, fn) {
        MessageBox.close()
        var m, t
        if (typeof msg === 'object') {
          m = msg.msg
          t = msg.title
        } else {
          m = String(msg)
          t = '提示'
        }
        MessageBox.alert(m, t).then(action => {
          typeof fn === 'function' && fn(action)
        })
      }
      window.confirm = function (msg, fn, re) {
        MessageBox.close()
        var m, t
        if (typeof msg === 'object') {
          m = msg.msg
          t = msg.title
        } else {
          m = String(msg)
          t = '提示'
        }
        MessageBox.confirm(m, t).then(action => {
          typeof fn === 'function' && fn(action)
        }).catch(action => {
          typeof re === 'function' && re(action)
        })
      }
      window.prompt = function (msg, fn, re) {
        if (msg === 'nuva:exec') return // hack for dingding fucking prompt
        MessageBox.close()
        var m, t
        if (typeof msg === 'object') {
          m = msg.msg
          t = msg.title
        } else {
          m = String(msg)
          t = '提示'
        }
        MessageBox.prompt(m, t).then(val => {
          typeof fn === 'function' && fn(val)
        }).catch(action => {
          typeof re === 'function' && re(action)
        })
      }
      window.loading = function (hide) {
        if (!hide) EMA.fire('Loading.show')
        else EMA.fire('Loading.hide')
      }
      window.toast = function (msg, fn) {
        EMA.fire('Toast.show', msg, fn)
      }
      window.viewImg = (imgs, index) => {
        this.$refs.imgViewer.open(imgs, index)
      }
      console.log('app mounted')
    },
    mounted: function () {
    },
    methods: {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @require 'assets/style/base.styl';
  @require 'assets/style/m-1px.styl';
  @require 'assets/style/animate.min.css';
  @require 'assets/style/custome-animate.css';

  normalize();

  * {
    box-sizing: border-box;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  }

  html, body {
    font-size: 16px;
  }

  .app {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-overflow-scrolling: touch;
  }
</style>
