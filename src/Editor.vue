<template>
  <div class="editorWarp" @contextmenu.prevent.stop="">
    <myheader :layout-data='layoutData'></myheader>
    <ui-dock v-if="nodeInfo && layoutData" :info="layoutData"></ui-dock>
    <div class="footer">
      <tips></tips>
    </div>
    <context-menu></context-menu>
    <!-- 弹出框 -->
    <c-dialogs></c-dialogs>
    <div :data-clipboard-text="clipboardContent" style="width:0;height:0;" ref="clipboard"></div>
    <upload-image :h2c="{scale:1}" skip-size-check ref="screenshot" :key="screenshotKey" v-if="screenshotKey!=null" ></upload-image>
    <bughd></bughd>
  </div>
</template>

<script>
  import ContextMenu from './components/ContextMenu'
  import cloneDeep from 'lodash/cloneDeep'
  import BaseComponent from 'src/extend/BaseComponent'
  import HistoryCache from './extend/HistoryCache'
  import CDialogs from 'src/components/Dialogs'
  import common from './assets/js/common'
  import emptyPage from './assets/data/empty.json'
  import Server from './extend/Server'
  import UploadImage from 'src/components/UploadImage'
  import UiDock from './components/dock/index'
  import Bughd from './components/bughd'
  import {getBaseNode} from 'src/extend/Util'
  import Clipboard from 'clipboard'
  import Tips from './components/Tips'
  import myheader from './components/Header'
  import {mapState} from 'vuex'
  require('src/extend/filter')
  let config = require('./config/index.js')

  export default {
    mixins: [BaseComponent],
    name: 'editor',
    components: {CDialogs, UploadImage, ContextMenu, UiDock, Tips, myheader, Bughd},
    data: function () {
      return {
        screenshotKey: null,
        layoutData: null,
        nodeInfo: null,
        pageInfo: null,
        keys: [],
        clipboardContent: '',
        imgSrc: '',
        form: {
          name: '',
          desc: ''
        },
        uploadObject: null
      }
    },
    props: ['active'],
    computed: {
      STORAGE_KEY () {
        if (!this.keys || !this.keys.length) return 'EditorautoSave_tmp'
        return `EditorautoSave_${this.keys[0] || ''}_${this.keys[1] || ''}`
      },
      ...mapState({
        currentLayout: state => state.viewOption.currentLayout,
        demoMode: state => state.setting.demoMode
      })
    },
    watch: {
      nodeInfo: function (params) {
        this.ema.fire('editor.nodeInfoChange', params)
      },
      currentLayout: {
        handler (val, oldVal) {
          this.layout(val)
        },
        immediate: true
      }
    },
    beforeCreate: function () {
    },
    created: function () {
    },
    mounted: function () {
      window.Editor = this
      this.bindEvent()
      this.loadPageInfo()
      // this.getUserInfo()
      // this.autoSave()
    },
    methods: {
      async layout (type) {
        if (!type) return
        const LAYOUT_SAVE_KEYS = 'dockLayout_save'
        const LAYOUT_TYPE_KEYS = 'dockLayout_type'
        let layoutOptions
        switch (type) {
          case 'custom':
            try {
              layoutOptions = JSON.parse(window.localStorage.getItem(LAYOUT_SAVE_KEYS) || '{}')
            } catch (e) {}
            let baseLayoutOptions = await import(
              /* webpackMode: "eager" */
              /* webpackInclude: /\.json$/ */
              `./assets/layout/${layoutOptions.name || 'default'}.json`
            )
            if (!(layoutOptions.version >= baseLayoutOptions.version)) layoutOptions = cloneDeep(baseLayoutOptions)
            break
          case 'develop':
          case 'default':
          default:
            layoutOptions = await import(
              /* webpackMode: "eager" */
              /* webpackInclude: /\.json$/ */
              `./assets/layout/${type}.json`
            )
            layoutOptions = cloneDeep(layoutOptions.default || layoutOptions)
        }
        this.layoutData = layoutOptions
        if (type == 'custom') window.localStorage.setItem(LAYOUT_SAVE_KEYS, JSON.stringify(layoutOptions))
        window.localStorage.setItem(LAYOUT_TYPE_KEYS, type)
      },
      autoSave: function () {
        setInterval(() => {
          this.ema.fire('pageInfo.save')
        }, 1000 * 60 * 2)
      },
      canDrag: function () {
      },
      bindEvent: function () {
        // loading
        let $loading
        this.ema.bind('loading.show', () => {
          $loading = this.$loading({
            lock: true,
            text: '处理中，请稍等',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
        })
        this.ema.bind('loading.hide', () => {
          $loading && $loading.close()
        })
        var me = this
        // 监控内容变化。做持久化
        this.$watch('nodeInfo', (content) => {
          this.doSave(content)
        }, {deep: true})
        // 绑定历史回退事件
        this.ema.bind('history.back', () => {
          var data = HistoryCache.getPrev()
          if (data) {
            me.nodeInfo = data
            me.ema.fire('nodeInfo.replace', me.nodeInfo)
            this.lock = true
          } else {
            this.$message({type: 'success', message: '没有历史记录'})
          }
        })
        // 绑定历史前进事件
        this.ema.bind('history.forword', () => {
          var data = HistoryCache.getNext()
          if (data) {
            me.nodeInfo = data
            me.ema.fire('nodeInfo.replace', me.nodeInfo)
            this.lock = true
          } else {
            this.$message({type: 'success', message: '没有历史记录'})
          }
        })
        // 绑定替换页面模板信息
        this.ema.bind('selectPageTemplate', (content) => {
          if (content) {
            Object.assign(this.nodeInfo, cloneDeep(content))
          }
        })
        // 保存页面
        this.ema.bind('pageInfo.save', (fast, callback) => {
          console.log('save---------', this.nodeInfo)
          this.doSave(this.nodeInfo, true)
          // if (this.demoMode) return this.$alert('您处在 demo 模式下，不能保存数据哦')
          this.savePage(fast, callback)
        })
        // 绑定组件点击添加组件到根元素
        this.ema.bind('commponent.addOne', menu => {
          var selectNode = this.nodeInfo
          if (window.$vue && window.$vue.nodeInfo) {
            selectNode = window.$vue.nodeInfo
          }
          var nodeInfo = getBaseNode(menu)
          let judge = common.componentAddJudge(selectNode, window.$vue || this)
          if (!judge.can) return this.$alert(judge.msg)
          // 如果给page容器添加孩子元素。孩子元素需要占满全屏
          if ((/pageContainer$/i).test(selectNode.type)) {
            nodeInfo.forceStyle = {
              position: 'absolute',
              width: '100%',
              height: '100%',
              left: '0',
              top: '0'
            }
          }
          if (!selectNode.child) {
            this.$set(selectNode, 'child', [])
          }
          selectNode.child.push(nodeInfo)
        })
         // psd解析
        this.ema.bind('pageInfo.psd', ({asService = false, url = '', name = '', root} = {}) => {
          console.log('pageInfo.psd', this.nodeInfo)
          root = root || this.nodeInfo.id
          this.openDialog({
            name: 'd-psd',
            data: {
              asService,
              psdUrl: url,
              psdName: name,
              root,
              title: 'psd上传'
            },
            methods: {
              changeNode: function (content, psdString) {
                console.log('changeNode')
                var nodes = null
                try {
                  nodes = JSON.parse(content)
                } catch (error) {
                  console.log('error', error)
                }
                if (!nodes) return console.log('图层解析失败')
                const $root = window.$_nodecomponents[root]
                $root.copyChild(nodes, {isJson: false, keepPos: 1})
              }
            }
          })
        })
        // 复制事件
        window.Clipboard = Clipboard
        new Clipboard(this.$refs['clipboard'])
        this.ema.bind('clipboard.copy', (content, msg) => {
          this.clipboardContent = String(content)
          window.setTimeout(() => {
            this.$refs['clipboard'].click()
            this.$message({
              message: msg || '已复制',
              type: 'success'
            })
          })
        })
        // 截图服务
        this.ema.bind('screenshot', (el, options, callback, needLoading = true) => {
          this.screenshotKey = Math.random().toFixed(10)
          let loading = needLoading && this.$loading({
            lock: true,
            text: '稍等片刻',
          })
          setTimeout(() => {
            this.$refs['screenshot'].upload(el, options, function () {
              loading && loading.close()
              callback.apply(null, arguments)
              this.screenshotKey = null
            })
          }, 100) // 不加延时加载,loading效果不能立即触发
        })
        // 按键
        window.document.addEventListener('keydown', (e) => {
          var keyCode = e.keyCode
          switch (keyCode) {
            case 38:
              this.ema.fire('arrowup.down', e)
              break
            case 40:
              this.ema.fire('arrowdown.down', e)
              break
            case 37:
              this.ema.fire('arrowleft.down', e)
              break
            case 39:
              this.ema.fire('arrowright.down', e)
              break
            case 8:
              this.ema.fire('delete.down', e)
            case 46:
              this.ema.fire('delete.down', e)
              break
            case 18:
              this.ema.fire('alt.down', e)
              break
            case 16:
              this.ema.fire('shift.down', e)
              break
          }
        })
        window.document.addEventListener('keyup', (e) => {
          var keyCode = e.keyCode
          switch (keyCode) {
            case 8:
            case 46:
              this.ema.fire('delete.up', e)
              break
            case 18:
              this.ema.fire('alt.up', e)
              break
            case 16:
              this.ema.fire('shift.up', e)
              break
            case 70:
              if (e.ctrlKey && e.shiftKey) {
                this.ema.fire('ctrl.shift.f.up', e)
                e.preventDefault()
              }
              break
          }
        })
        this.ema.bind('alert.show', (value, fn) => {
          this.$alert(value, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              typeof fn == 'function' && fn()
            }
          })
        })
        window.EMA.bind('logout', () => {
          this.logout()
        })
        // 资源使用数据
        this.ema.bind('resource.use', (id) => {
          if (!(id > 0)) return
          Server({
            url: 'editor/resources/addUseCount',
            method: 'post',
            needLoading: false,
            data: {id}
          })
            .then(console.log)
            .catch(console.error)
        })
      },
      logout: function () {
        window.onbeforeunload = null
        window.onunload = null
        window.sessionStorage.removeItem('session')
        window.location.replace(`${config.ADMIN_PATH}login.html`)
      },
      /**
       * 加载页面内容信息
       * @augments
       */
      loadPageInfo: function () {
        var urlInfo = common.parseURL(window.location.href)
        if (!urlInfo.params.key) {
          if (process.env.NODE_ENV == 'production') this.$alert('编辑页面缺少key')
          else {
            this.nodeInfo = cloneDeep(emptyPage)
            this.$store.dispatch('SettingChange', {demoMode: true})
          }
          return
        }
        var keys = this.keys = urlInfo.params.key.split('/')
        if (keys.length == 1) {
          keys[1] = keys[0]
        }
        Server({
          url: 'editor/pages/editor-detail',
          method: 'post', // default
          needLoading: false,
          data: {
            pageKey: keys[1],
            scene: 'edit',
          }
        }).then((respond) => {
          var data = respond.data
          this.pageInfo = data.data
          var info = null
          try {
            info = JSON.parse(this.pageInfo.content) || emptyPage
          } catch (error) {
          }
          this.$store.dispatch('setPageType', this.pageInfo.type)
          if (info.canvas && info.canvas.width) this.$store.dispatch('SettingChange', {phoneSize: info.canvas})
          this.nodeInfo = cloneDeep(info)
          this.$store.dispatch('setUser', {userId: data.data && data.data.uid})
        })
      },
      /**
       * 持久化数据并更新操作历史数据
       * @augments String content 内容
       */
      doSave: function (content, immediately) {
        var me = this
        if (this.timer) {
          window.clearTimeout(this.timer)
        }
        if (immediately) {
          window.localStorage.setItem(me.STORAGE_KEY, JSON.stringify(content))
        } else {
          this.timer = window.setTimeout(() => {
            window.localStorage.setItem(me.STORAGE_KEY, JSON.stringify(content))
            console.log('newChage', content)
            // 被回退或者前进操作的时候不添加历史记录
            if (!me.lock) {
              HistoryCache.add(content) // 历史记录本身来处理数据的序列化和反序列化
            }
            this.lock = false
          }, 500)
        }
      },
      saveToServer: function () {
        this.ema.fire('pageInfo.save')
      },
      savePage (fast, callback) {
        if (this.demoMode) return this.$alert('您处在demo模式下，不能保存数据哦')
        var info = Object.assign({}, this.pageInfo)
        info.content = window.localStorage.getItem(this.STORAGE_KEY)
        console.log(info)
        Server({
          url: 'editor/pages/save',
          method: 'post', // default
          needLoading: true,
          data: info
        }).then(({data}) => {
          let code = data.code
          let msg = data.msg
          if (code == 500) return this.$alert(msg)
          this.$message({type: 'success', message: '保存成功'})
          callback && callback()
          if (!fast) {
            this.savePagePreviewImage()
          }
        }).catch((respond) => {
          this.$message({type: 'success', message: '保存失败'})
        })
      },
      savePagePreviewImage () {
        var urlInfo = common.parseURL(window.location.href)
        this.ema.fire('screenshot', document.querySelector('#stage'), {height: 486, fileName: urlInfo.params.key + '.jpg'}, (src) => {
          console.log('screenshot', src)
          var info = Object.assign({}, this.pageInfo)
          info.content = window.localStorage.getItem(this.STORAGE_KEY)
          info.image = src
          Server({
            url: 'editor/pages/save',
            method: 'post', // default
            needLoading: false,
            data: info
          }).then(({data}) => {
          }).catch((respond) => {
          })
        }, false)
      },
      async publish () {
        if (this.demoMode) return this.$alert('您处在 demo 模式下，不能保存数据哦')
        let yes = await this.$confirm('您确定要发布吗？发布以后用户即可查看最新的页面')
        if (!yes) return
        Server({
          url: 'editor/pages/publish',
          method: 'post', // default
          needLoading: true,
          data: {
            pageKey: this.keys[1],
            type: this.pageInfo.type,
            id: this.pageInfo.id,
            projectId: this.pageInfo.projectId,
            content: window.localStorage.getItem(this.STORAGE_KEY)
          }
        }).then(({data}) => {
          let code = data.code
          let msg = data.msg
          if (code == 500) return this.$alert(msg)
          this.$message({type: 'success', message: '发布成功'})
        })
      },
      getUserInfo () {
        Server({
          url: 'users/info?uid=0',
          method: 'get',
        }).then(({data}) => {
          let userInfo = data && data.data || {}
          this.$store.dispatch('setUser', userInfo)
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @require 'assets/style/base.styl';
  @require 'assets/style/m-1px.styl';
  @import url('//at.alicdn.com/t/font_503463_iuhwl9258d.css');

  normalize();

  * {
    box-sizing: border-box;
  }

  html, body {
    font-size: 16px !important;
    size(100%);
    overflow: hidden;
    background-color: $-bg-color;
    color: #505152;
  }

  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  ::-webkit-scrollbar-track-piece {
    background-color: #CCCCCC;
    border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb:vertical {
    height: 5px;
    background-color: #999999;
    border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb:horizontal {
    width: 5px;
    background-color: #CCCCCC;
    border-radius: 6px;
  }

  // .el-tabs__item {
  // float: left;
  // }
  .editorWarp {
    width: 100%;
    height: 100%;
    left: 0;
    bottom: 0;
    position: absolute;
    display: flex;
    flex-direction: column;

    .qrcode {
      width: 200px;
      height: 200px;
      margin: 20px auto;
      display: block;
      padding: 5px;
      background: white;
    }

    .outLink {
      padding: 10px 0 20px;
      width: 100%;
      font-size: 12px;
      word-break: break-all;
      line-height: 1.2;
      font-weight: bolder;

      i.iconfont {
        font-size: 12px;
      }

      a {
        color: #666;
        text-decoration: none;
      }
    }

    // .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    //   margin-bottom: 3px;
    // }
  }

  .footer {
    height: 25px;
    position: relative;
    box-shadow: 0 0px 6px 0px #696969;
    margin-top: 2px;
  }

  .v-modal {
    opacity: 0.7 !important;
  }

  .dingding {
    padding: 10px;
    text-align: center;
    color: red;
    margin-top: 20px;
    width: 300px;
    font-size: 14px;

    img {
      width: 80%;
      margin: auto;
    }
  }

  .nodata.icon-nodata {
    font-size: 117px;
    margin: 30px auto;
    display: block;
    width: 130px;
    height: 130px;
  }

  .forbid-edit-mask {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 10;
    // background-color rgba(0,0,0,0.5);
    cursor: not-allowed;
  }

  .searchTags {
    .tag {
      margin: 5px;
    }
  }

  .el-tabs__header {
    .el-tabs__nav-wrap {
      .el-tabs__nav-next, .el-tabs__nav-prev {
        line-height: 29px;
      }

      &.is-scrollable {
        padding: 0 16px;
      }
    }
  }

  .ui-dock-panel > div > .el-tabs__header {
    padding-right: 22px;
    box-shadow: inset 0 -1px 1px 0px #000;
  }

  .ui-dock-panel {
    .el-tabs--border-card > .el-tabs__header {
      border-bottom: none;
    }

    .el-tabs--border-card > .el-tabs__header .el-tabs__item {
      border: none;
    }

    .el-tabs__nav-wrap {
      margin-bottom: 0;
    }
  }

  .editorWarp {
    .el-collapse-item__wrap {
      border-bottom: 1px solid #000000;
      box-shadow: 0 2px 1px -2px #fff;
    }

    .el-collapse-item__header {
      border-bottom: 1px solid #000000;
      box-shadow: 0 2px 1px -2px #fff;

      &.is-active {
        border-bottom-color: transparent;
        box-shadow: none;
      }
    }

    .el-collapse {
      border: none;
    }

    .el-input__inner {
      box-shadow: 1px 1px 1px 0px rgba(0, 0, 0, 0.6);
    }

    .el-tabs__nav-wrap::after {
      background-color: #000000;
      box-shadow: inset 1px -3px 0px -2px #656565;
    }
  }
</style>
