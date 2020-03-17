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
    html,body{padding:0;margin:0}.pre-loading-wrapper{position:relative;margin:200px auto 0;width:50px;height:50px}.pre-loading-wrapper .loading-item{position:absolute;left:0;top:0;width:100%;height:100%;border-radius:50%;opacity:.6;background-color:#fc8700;-webkit-animation:loading-bounce 2s infinite ease-in-out;animation:loading-bounce 2s infinite ease-in-out}.pre-loading-wrapper .loading-item-2{-webkit-animation-delay:-1s;animation-delay:-1s}@-webkit-keyframes loading-bounce{0%,100%{-webkit-transform:scale(0);transform:scale(0)}50%{-webkit-transform:scale(1);transform:scale(1)}}@keyframes loading-bounce{0%,100%{-webkit-transform:scale(0);transform:scale(0)}50%{-webkit-transform:scale(1);transform:scale(1)}}
    html body > .desktop-bg, html body > .app-wrapper { display:none; }
    /* html.is-desktop body > .app{width: 320px; height: 567px;position: absolute;left:50%;top:100px; transform: translateX(-50%);background-color: #f5f5f5;} */
    html.is-desktop .app-wrapper > .app-fixed{width: 320px; height: 567px;position: absolute;left:43px;top:60px; background-color: #f5f5f5;-webkit-transform: translate3d(0,0,0);transform: translate3d(0,0,0);-webkit-transform-origin: 0 0;-ms-transform-origin: 0 0;transform-origin: 0 0;}    
    html.is-desktop .app-fixed > .app{width: 100%; height: 100%;position: absolute;left:0px;top:0px;}
    html.is-desktop *::-webkit-scrollbar { width: 0 !important }
    html.is-desktop * { -ms-overflow-style: none;  overflow: -moz-scrollbars-none;}
    html.is-desktop body > .app-wrapper{width: 405px; height: 693px;position: absolute;left:50%;top:50%; margin-left: -202px;margin-top: -346px;
      background-image: url(<%= BASE_URL %>m15.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display:block;
    }
    html.is-desktop body > .desktop-bg{
      position:absolute;left:0;right:0;top:0;bottom:0;pointer-events: none;
      background-image: url(<%= BASE_URL %>bbg.jpg);
      background-repeat: no-repeat;
      background-size: cover;
      display:block;
    }
  </style>
</head>
<body>
<div id='desktop-bg' class="desktop-bg"></div>
<div id='app-wrapper' class="app-wrapper">
  <div class="app-fixed" id='app-fixed'>
    <div id="app" class="app">
      <div class="pre-loading-wrapper">
        <div class="loading-item loading-item-1"></div>
        <div class="loading-item loading-item-2"></div>
        <div class="loading-item loading-item-3"></div>
      </div>
    </div>
  </div>
</div>
<script>
if (!navigator.userAgent.match(/mobile|iphone|ipad|android/i)) {
  document.documentElement.classList.add('is-desktop')
  window.isDesktop = !0
}
window.loadingStartTime = new Date()-0;window.AreaData = [];window.html2canvas = {};window.Truck = {};
!window.isDesktop && document.body.appendChild(document.getElementById('app'));
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