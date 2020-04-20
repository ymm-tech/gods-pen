<template>
  <div class="top-bar-wrapper header">
    <div class="main-top-bar top-bar-lang-en">
      <div class="top-bar-left-section">
        <div class="top-bar-logo">
          <img class="logo" src="../assets/images/logo.png">
          </div>
          <div class="top-menus">
            <el-dropdown style="margin-left: 20px;" @command="selectLayout" trigger="click">
              <el-button type="text">
                布局<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="view in layouts" :key="view.type" :command="view.type">{{view.name}} <i style="color: #faad14" class="el-icon-check" v-show="currentLayout == view.type"></i></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown style="margin-left: 20px;" @command="selectWidget" trigger="click">
              <el-button type="text">
                部件<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="el-dropdown-item" v-for="(view, name) in computedWidgets" :disabled='view.enable && view.required' :key="name" :command="name">{{view.desc}} <i style="color: #faad14" class="el-icon-check" v-show="view.enable"></i></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button type="text" style="margin-left: 20px;" @click="revocation">
              <i class="menu-text iconfont icon-revocation"> 撤销</i>
            </el-button>
            <el-button type="text" style="margin-left: 20px;" @click="forward">
              <i class="menu-text iconfont icon-forward"> 恢复</i>
            </el-button>
            <el-button type="text" style="margin-left: 20px;" @click="preview">
              <i class="menu-text iconfont el-icon-view"> 预览</i>
            </el-button>
            <el-button type="text" style="margin-left: 20px;" v-popover:popover4>
              <i class="menu-text iconfont icon-grid"> 参考线</i>
            </el-button>
             <el-button type="text" style="margin-left: 20px;" @click="psd">
              <i class="menu-text el-icon-picture-outline"> psd</i>
            </el-button>
            <!-- <el-dropdown style="margin-left: 20px;" @command="onToolCommand" trigger="click">
              <el-button type="text">
                工具<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="el-dropdown-item" command="allToPx">应用绝对尺寸转换</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
            <el-button type="text" style="margin-left: 20px;">
              <a href="https://godspen.ymm56.com/doc/" style="color:#faad14;" target="_blank">帮助中心</a>
            </el-button>
          </div>
        </div>
        <div class="top-bar-center-section"></div>
        <div class="top-bar-right-section">
          <button @click="saveToServer" class="top-bar-btn top-bar-button-preview">
            <span class="label">
              保存
              <i class="iconfont icon-save"></i>
            </span>
          </button>
          <button @click="publish" class="top-bar-btn top-bar-btn-publish top-bar-edit-mode-last-btn">
            <span class="label">
              <i class="iconfont icon-publish"></i>发布</span>
          </button>
        </div>
      </div>
      <el-popover ref="popover4" placement="right" width="180" trigger="click">
        <el-form :model="Setting" size="mini" label-width="90px">
          <el-form-item label="智能参考线">
            <el-switch @change="onSettingChange($event, 'line')" :value="Setting.line"></el-switch>
          </el-form-item>
          <el-form-item label="参考线颜色">
            <el-color-picker @change="onSettingChange($event, 'color')" :value="Setting.color"></el-color-picker>
          </el-form-item>
          <el-form-item label="吸附效果">
            <el-switch @change="onSettingChange($event, 'sorb')" :value="Setting.sorb"></el-switch>
          </el-form-item>
        </el-form>
      </el-popover>
    </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .top-bar-wrapper {
    top: 0;
    left: 0;
    width: 100%;
    background: #212020;
    box-shadow: inset 0 -1px 1px 0 #000;

    .menu {
      top: -5px;
      border: none;
    }

    .menu-text {
      font-size: 14px;
    }

    .main-top-bar {
      display: flex;
      display: flex;
      justify-content: space-between;
      height: 48px;
      position: relative;
      width: 100%;
      min-width: 600px;
      top: 0;
      left: 0;
      z-index: 1450;
      transition: 0.6s cubic-bezier(0.645, 0.045, 0.355, 1) top;

      .top-bar-left-section {
        display: flex;
        height: 100%;

        .top-bar-logo {
          display: flex;
          height: 100%;
          align-items: center;
          padding-left: 12px;
          box-sizing: border-box;
          font-weight: bold;

          .logo {
            height: 80%;
          }
        }
        .top-menus {
          display: flex;
          height: 100%;
          align-items: center;
          padding-right: 12px;
          box-sizing: border-box;
        }

        .top-bar-menu-bar-wrapper {
          padding-left: 18px;
          display: flex;
        }

        .top-bar-menu-bar-item {
          font-size: 14px;
          position: relative;
          cursor: pointer;
          float: left;
          height: 48px;
          line-height: 48px;
          padding: 0 18px;
          text-align: center;
          transition: color 0.1s ease;
          white-space: nowrap;
        }
      }

      .top-bar-center-section {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .top-bar-right-section {
        display: flex;

        .top-bar-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 48px;
          cursor: pointer;
          padding: 0 20px;
          box-sizing: border-box;
          outline: none;
          border: 0;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
          background-color: #212020;
          color: #fff;

          &:hover {
            background-color: #000000;
          }

          &.top-bar-btn-publish {
            background-color: #262626;

            &:hover {
              background-color: #000000;
            }
          }
        }
      }
    }
  }
  .el-dropdown-item.is-disabled {
    pointer-events auto
    cursor not-allowed
  }
</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import Config from 'src/config'
  import common from '../assets/js/common'
  import { mapState } from 'vuex'
  export default {
    mixins: [BaseComponent],
    components: {},
    name: 'header',
    props: ['layout-data'],
    data () {
      return {
        setting: {
          open: true, // 网格开关
          line: true, // 智能参考线显示
          color: '#409EFF', // 参考线颜色
          phoneline: true, // 手机框
          sorb: true // 是否拖拽吸附
        }
      }
    },
    computed: {
      computedWidgets () {
        let widgets = Object.entries(this.widgets).reduce((o, [key, val]) => {
          o[key] = {
            name: key,
            desc: val,
            enable: false,
            required: false,
          }
          return o
        }, {})
        if (!this.layoutData || typeof this.layoutData !== 'object') return
        let {layout, dialogs} = this.layoutData
        loop(layout && layout.children)
        loop(dialogs)
        function loop (list) {
          if (!list && !list.length) return
          for (let data of list) {
            if (data.component) {
              widgets[data.component]['enable'] = 1
              widgets[data.component]['required'] = !data.close
            }
            if (data.children && data.children.length) loop(data.children)
          }
        }
        return widgets
      },
      ...mapState({
        widgets: state => state.viewOption.widgets,
        layouts: state => state.viewOption.layouts,
        currentLayout: state => state.viewOption.currentLayout,
      })
    },
    mounted () {
    },
    methods: {
      onSettingChange (v, k) {
        this.$store.dispatch('SettingChange', {[k]: v})
    },
      onToolCommand (command) {
        switch (command) {
          case 'allToPx':
            this.ema.fire('allToPx')
            break
        }
      },
      publish () {
        window.Editor.publish()
      },
      saveToServer: function () {
        window.Editor.saveToServer()
      },
      selectLayout (layout) {
        this.$store.dispatch('setCurrentLayout', layout)
      },
      selectWidget (widgetName) {
        let widget = this.computedWidgets[widgetName]
        if (!widget.enable) {
          // 添加部件
          this.$confirm(`确定要添加【${widget.desc}】部件么`)
          .then((valid) => {
            this.layoutData.dialogs.push({
              name: widget.desc,
              component: widget.name,
              style: {
                width: '300px',
                height: '400px',
                left: '0px',
                top: '50px'
              },
              close: !widget.required,
              pop: true
            })
          })
          .catch(e => console.log('怂了'))
        } else if (!widget.required) {
          // 移除部件
          this.$confirm(`确定要移除【${widget.desc}】部件么`)
          .then((valid) => {
            let {layout, dialogs} = this.layoutData
            loop(layout && layout.children)
            loop(dialogs)
          })
          .catch(e => console.log('怂了'))
        }
        function loop (list) {
          if (!list && !list.length) return
          for (let i = 0; i < list.length; i++) {
            let data = list[i] || {}
            if (data.component === widgetName) {
              list.splice(i, 1)
              break
            }
            if (data.children && data.children.length) loop(data.children)
          }
        }
      },
      preview: function () {
        var urlInfo = common.parseURL(window.location.href)
        var key = urlInfo.params && urlInfo.params.key
        const open = () => {
          if ((/desktop/i).test(this.Setting.phoneSize.name)) {
            const win = window.open(`${Config.VIEW_PATH}${this.demoMode ? '__demomode' : key}?preview=1`)
            return window.setTimeout(() => this.postData(win), 1000)
          }
          this.openDialog({ name: 'd-Preview', data: { key } })
        }
        if (this.demoMode) open()
        else this.ema.fire('pageInfo.save', true, open)
      },
      revocation: function () {
        this.ema.fire('history.back')
      },
      forward: function () {
        this.ema.fire('history.forword')
      },
      save: function () {
        this.ema.fire('pageInfo.save')
      },
      psd: function () {
        this.ema.fire('pageInfo.psd')
      },
      postData (previewWindow) {
        const content = window.localStorage.getItem('EditorautoSave_tmp')
        previewWindow.postMessage({type: 'preview', content: content, canvas: this.$store.state.setting.phoneSize}, '*')
      }
    }
  }
</script>

