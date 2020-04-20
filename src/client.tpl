<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>加载中...</title>
  <meta name="viewport" id="viewport"
        content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
  <meta name="renderer" content="webkit"/>
  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <meta name="full-screen" content="yes"/>
  <meta name="x5-fullscreen" content="true"/>
  <meta name="format-detection" content="telephone=no">
  <style>
    html,
    body {
      padding: 0;
      margin: 0
    }
    html body>.desktop-bg,
    html body>.app-wrapper {
      display: none;
    }

    html.is-desktop *:not(body)::-webkit-scrollbar {
      width: 0 !important
    }
    html.is-desktop *:not(body) {
      -ms-overflow-style: none;
      overflow: -moz-scrollbars-none;
    }

    html.for-mobile body {
      background-color: #f5f5f5;
    }
    html.for-mobile body .app {
      overflow-x: hidden;
    }

    html.is-desktop body>.app-wrapper {
      position: relative;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: block;
      width: 1140px;
      height: auto;
      min-height: 100%;
      margin: 0 auto;
    }
    html.is-desktop.for-mobile body>.app-wrapper {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 407px;
      height: 695px;
      min-height: unset;
      margin-left: -203px;
      margin-top: -347px;
      background-image: url(https://maliang.ymm56.com/ymm-maliang/access/ymm_1560236249028.png);
    }

    html.is-desktop.for-mobile .app-wrapper>.app-fixed {
      width: 320px;
      height: 567px;
      position: absolute;
      left: 43px;
      top: 60px;
      background-color: #f5f5f5;
      overflow: hidden;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      -webkit-transform-origin: 0 0;
      -ms-transform-origin: 0 0;
      transform-origin: 0 0;
    }

    html.is-desktop.for-mobile .app-fixed>.app {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0px;
      top: 0px;
      background-color:#f5f5f5;
    }

    html.is-desktop.for-mobile body>.desktop-bg {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      pointer-events: none;
      background-image: url(https://maliang.ymm56.com/ymm-maliang/access/ymm_1560236210678.jpg);
      background-repeat: no-repeat;
      background-size: cover;
      display: block;
    }
    .loading-img {
      vertical-align: top;
      position: fixed;
      left: 50%;
      top: 44%;
      transform: translate(-50%,-50%);
      width: 20%;
      max-width: 100px;
      height: auto;
    }
  </style>
</head>
<body>
<div id='desktop-bg' class="desktop-bg"></div>
<div id='app-wrapper' class="app-wrapper">
  <div id='app-fixed' class="app-fixed" id='app-fixed'>
    <div id="app" class="app">
      <img class="loading-img" src="https://cos.56qq.com/fis/20200330161413755aebf4c6d10771a9.gif" alt="">
    </div>
  </div>
</div>
<script>
if (!navigator.userAgent.match(/mobile|iphone|ipad|android/i) || window.innerWidth >= 768) {
  document.documentElement.classList.add('is-desktop')
  window.isDesktop = !0
} else {
  document.querySelector('#desktop-bg').remove()
  document.body.appendChild(document.querySelector('#app'))
  document.querySelector('#app-wrapper').remove()
}
window.loadingStartTime = new Date()-0;window.AreaData = [];window.html2canvas = {};window.Truck = {};
</script>
<script src="<%= BASE_URL %>babel-polyfill.v6_20_0.min.js"></script>
<script src="<%= BASE_URL %>fastclick.js"></script>
<% if (process.env.NODE_ENV === 'production') { %>
<script src="<%= BASE_URL %>vue.runtime.v2_6_11.min.js"></script>
<script src="<%= BASE_URL %>vuex.v2_0_0.min.js"></script>
<script src="<%= BASE_URL %>vue-router.v2_0_1.min.js"></script>
<% } %>
</body>
</html>