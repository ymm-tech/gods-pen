<template>
  <div class="code-panel ns65536">
    <template v-if="codes && codes.length || showSearchPanel">
      <el-tabs closable v-model="currentCode" type="card"  @tab-remove="onTabRemove">
        <el-tab-pane v-for="(item) in codes" :key="item.key" :label="item.name" :name="item.key">
          <span style="display:inline-block;height:28px;" slot="label" :title="item.comId + '_' + item.name + '_' + item.id">{{item.name}} <i v-show='item.dirty'>*</i></span>
          <code-editor ctype='javascript' :highlight='item.highlight' :dirty.sync="item.dirty" :ctrls='true' @ctrls='item.onSave' :options="{}" :contents='item.content'></code-editor>
        </el-tab-pane>
        <el-tab-pane v-if="showSearchPanel" label="搜索" name="SEARCHRESULT">
          <span style="display:inline-block;height:28px;" slot="label" ><i :class="{'el-icon-search': !searching, 'el-icon-loading': searching}" ></i> <i class=""></i> 搜索</span>
          <div class="search-section">
            <el-input v-model="keyword" size="small" style="width: 40%" @keyup.enter.native="doSearch">
              <el-checkbox-group slot="append" v-model="pickedSearchRules" size="mini">
                <el-checkbox-button v-for="(rule) in searchRules" :label="rule.type" :key="rule.type">{{rule.name}}</el-checkbox-button>
              </el-checkbox-group>
            </el-input>
            <div class="search-result">
              <div v-show="searchResult === '__NULL__'" style="font-size: 12px;margin: 7px 3px;">找不到结果</div>
              <template v-if="searchResult && searchResult.map">
                <div class="search-result-item" :key="index" v-for="(item, index) in searchResult">
                  <i class="iconfont icon-function"></i>
                  <div class="search-result-path">
                    {{item.file.name}}
                    <span>{{item.comId}} <i>></i> {{item.file.name}}{{item.file.id}}</span>
                  </div>
                  <div @click="openFile(item.file, {comId: item.comId, highlight: item.highlight})" class="search-result-content">
                    {{item.snippet[0]}}<i class="highlight">{{item.snippet[1]}}</i>{{item.snippet[2]}}
                  </div>
                </div>
              </template>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>
    <div v-else class="codepanel-hint" style="padding-top: 1px; pointer-events:none;">
      <div class="codepanel-logo">GODSPEN</div>
      <div class="hint-item">
        <div class="hint-item-left">脚本全局搜索</div>
        <div class="hint-item-right">ctrl+shift+F</div>
      </div>
      <div class="hint-item">
        <div class="hint-item-left">保存脚本</div>
        <div class="hint-item-right">ctrl+S</div>
      </div>
      <div class="hint-item">
        <div class="hint-item-left">脚本内查找</div>
        <div class="hint-item-right">ctrl+F</div>
      </div>
      <div class="hint-item">
        <div class="hint-item-left">替换</div>
        <div class="hint-item-right">ctrl+H</div>
      </div>
      <div class="hint-item">
        <div class="hint-item-left">格式化代码</div>
        <div class="hint-item-right">shift+alt+F</div>
      </div>
      <div class="hint-item">
        <div class="hint-item-left">显式所有命令</div>
        <div class="hint-item-right">F1</div>
      </div>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
.code-panel {
  width 100%
  height 100%
}
.codepanel-logo {
  margin-top 100px;
  margin-bottom 100px;
  text-align: center;
  font-size: 100px;
  text-shadow: 0px 9px 6px #000;
  letter-spacing: 20px;
  color: #333;
}
.hint-item {
  display flex
  > div {
    line-height: 44px;
    font-size: 17px;
    color: #5f5f5f;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    font-weight: bolder;
    margin: 0 20px;
    text-shadow: 1px 1px 1px #000;
  }
  &-left {
    text-align right
  }
  &-right {
    text-align left
  }
}
.search-section {
  height: 100%
  display flex
  flex-direction column
  .search-result {
    flex 1
    overflow auto
  }
}
.search-result-item {
  position: relative;
  font-size: 14px;
  padding: 5px 15px 5px 40px;
  margin: 10px 0;
  box-shadow: 0 1px 4px 1px #1f1f1f;
  .icon-function {
    position: absolute;
    left: 0;
    top: -3px;
    font-size: 40px;
    transform: scaleX(0.8);
    font-weight: 100;
    color: #525252;
  }
  .search-result-path {
    color: #faad14;
    font-size: 14px;
    span  {
      font-size: smaller;
      color: #8a8a8a;
    }
  }
  .search-result-content {
    margin-top 5px;
    cursor: pointer;
    i.highlight {
      color: #faad14
      border: 1px solid;
      border-radius: 3px;
      padding: 0 4px;
      margin: 0 2px;
    }
  }
}
</style>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .code-panel.ns65536 {
    height 100%
    .el-tabs--card > .el-tabs__header .el-tabs__nav {
      border none
    }
    .el-tabs--card > .el-tabs__header  {
      border-bottom: none
    }
    .el-tabs--card > .el-tabs__header .el-tabs__item {
      border none
      background-color #1e1e1e
    }
    .el-tabs__header {
      margin-bottom 1px
      box-shadow: 0px 1px 1px 0px #000
    }
    .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
      background-color #363636
    }
    .el-tabs.el-tabs--card.el-tabs--top {
      height 100%
      display flex
      flex-direction column
      .el-tab-pane {
        height 100%
        .codeviewer {
          height 100%
        }
      }
    }
    .el-tabs__content {
      overflow hidden
    }
    .search-section {
      .el-input-group__append {
        padding 0
      }
      .el-checkbox-button__inner {
        padding 8px
      }
      .el-input > input {
        padding-left 30px;
      }
    }

  }
</style>
<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import CodeEditor from '../code'

  const SEARCHRESULT = 'SEARCHRESULT'

  export default {
    mixins: [BaseComponent],
    name: 'code-panel',
    components: {CodeEditor},
    data: function () {
      return {
        currentCode: '',
        codes: [],
        showSearchPanel: false,
        searching: false,
        keyword: '',
        searchResult: [],
        pickedSearchRules: [],
        searchRules: [
          {
            type: 'caseSensitive',
            name: 'Aa',
          },
          {
            type: 'useReg',
            name: '.*',
          }
        ]
      }
    },
    computed: {
      ids () {
        return (this.codes || []).map(i => i.key)
      },
      activeComponentId () {
        return this.currentCode.split('_')[0]
      },
      useReg () {
        return this.pickedSearchRules.includes('useReg')
      },
      ignoreCase () {
        return !this.pickedSearchRules.includes('caseSensitive')
      }
    },
    beforeMount () {
      window.$CodePanel = this
    },
    mounted () {
      this.ema.bind('script.rename', ({key, name}) => {
        this.codes.map(item => {
          if (item.key === key) item.name = name
        })
      })
      this.ema.bind('script.delete', ({key}) => {
        this.codes.map((item, index) => {
          if (item.key === key) this.closeFile(index, item)
        })
      })
      this.ema.bind('ctrl.shift.f.up', e => {
        if (e.panelName === 'widgetCodePanel') {
          this.showSearchPanel = true
          this.currentCode = SEARCHRESULT
        }
      })
    },
    watch: {
      activeComponentId (val, old) {
        if (!val || val === '0' || val === SEARCHRESULT) return
        this.ema.fire('select.one', val)
      }
    },
    destroyed () {
      delete window.$CodePanel
    },
    methods: {
      onTabRemove (key) {
        console.log('start', Date.now())
        if (key === SEARCHRESULT) return this.closeFile(SEARCHRESULT)
        this.codes.map((item, index) => {
          if (item.key === key) {
            if (item.dirty) this.$confirm('尚有未保存内容，直接关闭会丢失未保存改动，确认要关闭吗？', { confirmButtonText: '直接关闭', cancelButtonText: '我再想想' }).then(() => this.closeFile(index)).catch(e => console.log('放弃编辑内容'))
            else this.closeFile(index)
          }
        })
        console.log('end', Date.now())
      },
      openFile (file, {comId, highlight}) {
        this.ema.fire('dock.panelActive', 'widgetCodePanel')
        var that = this
        if (!file) return
        if (!file.id) {
          this.$set(file, 'id', 65536 + (Math.random() * 65536 | 0))
        }
        var key = `${comId}_${file.id}`
        var fileIndex = this.ids.indexOf(key)
        if (fileIndex > -1) {
          var mfile = this.codes[fileIndex]
          if (!('highlight' in mfile)) this.$set(mfile, 'highlight', highlight)
          else mfile.highlight = highlight
          this.currentCode = key
          return
        }
        this.codes.push({
          ...file,
          comId,
          key,
          highlight,
          dirty: false,
          onSave: function (content) {
            file.content = content
            that.$message({
              type: 'success',
              message: '已保存'
            })
          }
        })
        this.currentCode = key
      },
      closeFile (index, item) {
        if (index === SEARCHRESULT) {
          this.showSearchPanel = false
          this.currentCode = this.currentCode === SEARCHRESULT ? this.codes[this.codes.length - 1].key : this.currentCode
          return
        }
        this.codes.splice(index, 1)
        if (index == this.codes.length) index = index - 1
        if (index < 0 || this.codes.length <= 0) return
        this.currentCode = this.codes[index].key
      },
      doSearch () {
        let keyword = (this.keyword || '').trim()
        if (!keyword.length) return
        this.searching = true
        let reg, data, searchResult
        try {
          keyword = this.useReg ? keyword : keyword.replace(/[.*/?|()\[\]{}\^$\\]/g, m => `\\${m}`)
          reg = new RegExp(keyword, this.ignoreCase ? 'mgi' : 'mg')
          data = window.$app.info
          searchResult = loop(data)
          if (!searchResult || searchResult.length == 0) searchResult = '__NULL__'
          this.searchResult = searchResult
        } catch (e) {
          this.ema.fire('bughd.open', e)
        }
        this.searching = false
        function loop (tree) {
          let res = (tree.script instanceof Array ? tree.script : []).reduce((o, s) => {
            var content = s && s.content || String(s)
            var matched = []
            var i
            while ((i = reg.exec(content), i)) {
              var index = i.index
              var pattern = i[0]
              if (!pattern || !pattern.length) continue
              matched.push([
                content.slice(Math.max(0, index - 90), index),
                pattern,
                content.slice(i.index + pattern.length, i.index + 90),
                content.slice(0, i.index),
              ])
            }
            o = o.concat((matched || []).map(m => {
              var brs = m[3].split(/[\n]/m) || []
              var pre = brs[brs.length - 1] || ''
              return {
                file: s,
                snippet: m,
                highlight: {
                  line: brs && brs.length || 1,
                  start: pre.length + 1,
                  end: pre.length + m[1].length + 1,
                },
                comId: tree.id
              }
            }))
            return o
          }, [])
          let next = (tree.child || []).map(loop).reduce((a, c) => a.concat(c), [])
          return res.concat(next)
        }
      },
    }
  }
</script>
