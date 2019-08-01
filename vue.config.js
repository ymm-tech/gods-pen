const path = require('path')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const config = require('./src/config/index')

let page
switch (process.env.PAGE) {
  case 'CLIENT':
    page = {
      entry: 'src/client.js',
      template: 'src/client.tpl',
      outputDir: `dist/${config.VIEW_NAME || 'view'}`,
      publicPath: '/' + config.VIEW_NAME,
      port: 8566,
    }
    break
  case 'EDITOR':
  default:
    page = {
      entry: 'src/editor.js',
      template: 'src/editor.tpl',
      outputDir: `dist/${config.EDITOR_NAME || 'editor'}`,
      publicPath: '/' + config.EDITOR_NAME,
      title: config.EDITOR_TITLE,
      port: 8565,
      externals: {
        'plupload': 'plupload',
      },
      alias: {
        'onigasm.wasm': path.join(__dirname, './node_modules/onigasm/lib/onigasm.wasm'),
      },
      plugins: [new MonacoWebpackPlugin()]
    }
}

const configureWebpack = {
  resolve: {
    alias: Object.assign({
      'src': path.join(__dirname, 'src')
    }, page.alias || {})
  },
  externals: Object.assign({
    'FastClick': 'FastClick',
    'html2canvas': 'html2canvas'
  }, page.externals || {}),
  plugins: page.plugins || []
}

if (process.env.NODE_ENV === 'production') {
  configureWebpack.externals.vue = 'Vue'
  configureWebpack.externals['vue-router'] = 'VueRouter'
  configureWebpack.externals.vuex = 'Vuex'
}

module.exports = {
  publicPath: page.publicPath,
  assetsDir: 'static',
  outputDir: page.outputDir,
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: process.env.NODE_ENV !== 'production',
  pages: {
    index: {
      filename: 'index.html',
      entry: page.entry,
      template: page.template,
      title: page.title,
      hmid: config.BAIDU_TONGJI
    }
  },
  devServer: {
    disableHostCheck: true,
    port: page.port,
    publicPath: '/',
    historyApiFallback: true
  },
  configureWebpack: configureWebpack,
  chainWebpack: config => {
    config.plugins.delete('preload-index')
    config.plugins.delete('prefetch-index')

    config.plugin('define').tap(args => {
      args[0]['process.env'].CODE_ENV = JSON.stringify(process.env.CODE_ENV)
      return args
    })
    config.module
      .rule('wasm')
      .test(/\.wasm$/)
      .use('file-loader')
      .loader('file-loader')
      .tap(options => {
        return {
          limit: 0
        }
      })
  }
}