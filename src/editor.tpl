<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title><%= htmlWebpackPlugin.options.title %></title>
  <meta name="renderer" content="webkit"/>
  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <meta name="full-screen" content="yes"/>
  <meta name="x5-fullscreen" content="true"/>
  <meta name="format-detection" content="telephone=no">
  <style>
   html,body{padding:0;margin:0;background-color:#262626;}.pre-loading-wrapper{position:relative;margin:200px auto 0;width:50px;height:50px}.pre-loading-wrapper .loading-item{position:absolute;left:0;top:0;width:100%;height:100%;border-radius:50%;opacity:.6;background-color:#fc8700;-webkit-animation:loading-bounce 2s infinite ease-in-out;animation:loading-bounce 2s infinite ease-in-out}.pre-loading-wrapper .loading-item-2{-webkit-animation-delay:-1s;animation-delay:-1s}@-webkit-keyframes loading-bounce{0%,100%{-webkit-transform:scale(0);transform:scale(0)}50%{-webkit-transform:scale(1);transform:scale(1)}}@keyframes loading-bounce{0%,100%{-webkit-transform:scale(0);transform:scale(0)}50%{-webkit-transform:scale(1);transform:scale(1)}}
  </style>
</head>
<body>
<div id="app" class="app">
  <div class="pre-loading-wrapper">
      <div class="loading-item loading-item-1"></div>
      <div class="loading-item loading-item-2"></div>
      <div class="loading-item loading-item-3"></div>
  </div>
</div>
<script>
  window.EDIT_TYPE = 'NOT_INIT'
  window.loadingStartTime = new Date()-0
  window.AreaData = []
</script>
<% if (/^[0-9a-zA-Z]{10,}$/.test(htmlWebpackPlugin.options.hmid)) { %>
<script defer type="text/javascript" src="https://hm.baidu.com/hm.js?<%= htmlWebpackPlugin.options.hmid %>"></script>
<% } %>
<script src="<%= BASE_URL %>babel.min.js"></script>
<script src="<%= BASE_URL %>babel-polyfill.v6_20_0.min.js"></script>
<script src="<%= BASE_URL %>tinymce4.7.13/tinymce.min.js"></script>
<script src="<%= BASE_URL %>plupload.full.min.js"></script>
<script src="<%= BASE_URL %>html2canvas.min.js"></script>
<% if (process.env.NODE_ENV === 'production') { %>
  <script src="<%= BASE_URL %>vue.runtime.v2_6_11.min.js"></script>
  <script src="<%= BASE_URL %>vuex.v2_0_0.min.js"></script>
<% } %>
</body>
</html>
