<template>
  <div class="script-editor widget">
    <div class="box-search">
      <el-input class="searchInput" size="mini" placeholder="输入搜索关键字..." @keyup.enter.native="loadData(1)" v-model="searchKey">
        <i class="el-icon-close el-input__icon" style="color:#999;cursor: pointer;" slot="suffix" @click="searchKey = ''"></i>
        <el-button slot="append" @click.stop="loadData(1)" icon="el-icon-search"></el-button>
      </el-input>
      <assets-tags @selectchange="onTagSelect" :assets-id='categoryId'></assets-tags>
    </div>
    <div class="components">
      <div class="scripts-list" :class="{fold: folded}">
        <el-tag style="cursor:pointer;" type="warning" class="addScriptWarp" v-for="item in scriptArray" :key="item.categoryId + '_' + item.id">
          <div size="mini" @click="addScript(item)">
            <i class="iconfont icon-function"></i>
            {{item.name}}
          </div>
        </el-tag>
        <div class="toogle-more" @click="folded = !folded"><i class="el-icon-d-arrow-left"></i></div>
      </div>
      <div class="scriptWarp">
        <div class="script-item" :name="value.name" v-for="(value) in array" :key="value.name" @click="editItem(value)">
          <div class="namewrap">{{value.name}}</div>
          <div class="iconwarp">
            <i class="iconfont icon-zhihang"  :class="{'runtime': value.runtimeOnly}" :title="value.runtimeOnly ? '仅运行时执行' : '始终执行'" @click.stop="toogleRuntimeOnly(value)"></i>
            <i class="iconfont icon-download" :style="{transform: 'rotate(180deg)'}" title="保存到脚本库" @click.stop="saveTemplate(value)"></i>
            <i class="iconfont icon-rename" title="重命名" @click.stop="renameItem(value)"></i>
            <i class="iconfont el-icon-delete" @click.stop="deleteItem(value)" title="删除"></i>
            <i class="el-icon-arrow-right" style="font-size: 14px;"></i>
          </div>
        </div>
        <div class="add-script" @click="addScript()"><i class="el-icon-plus"></i> 新建</div>
      </div>
    </div>
    <div class="forbid-edit-mask" v-show="forbidEdit"></div>
  </div>

</template>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
.script-editor {
  .box-search {
    .el-input__suffix {
      transform: translateX(-55px) !important;
    }
  }
}
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .script-editor {
    position: relative;
    flex-direction: column;
    display: flex;
    height: 100%;

    .box-search {
      width: 100%;
      background-color: #3c3a3a;
      padding: 10px;

    }

    .components {
      width: 100%;
      height: 0;
      flex: 1;
      overflow: auto;
    }

    .scripts-list {
      width: 100%;
      padding-bottom: 10px;
      // max-height: 198px;
      text-align: left;
      position relative
      overflow hidden
      padding-bottom 20px;
      .toogle-more {
        position: absolute;
        left: 0;
        bottom: 0px;
        font-size: 12px;
        width: 100%;
        height: 20px;
        text-align: center;
        letter-spacing: 2px;
        background-image: linear-gradient(#4c4c4c, 20%, #272727 90%)
        cursor pointer
        &:before {
          content: '收起'
        }
        i {
          transform: rotate(90deg)
        }
      }
    }


    .scripts-list.fold {
      height 104px;
      .toogle-more {
        &:before {
          content: '展开'
        }
        i {
          transform: rotate(270deg)
        }
      }
    }

    .addScriptWarp {
      margin: 4px;
      overflow: hidden;
      display: inline-block;
      position: relative;

      .scriptselect {
        margin-right: 10px;
      }
    }
    .el-collapse {
      border: none;
    }

    .script-item {
      text-align: left;
      margin: 0 10px;
      padding: 10px 0
      position: relative;
      font-size: 14px;
      border-bottom: solid 1px #000000;
      box-shadow: 0 2px 1px -2px #9c9c9c;
      cursor pointer

      .iconwarp {
        font-size: 18px;
        top: 10px;
        right: 0;
        position: absolute;
        .iconfont {
          display inline-block
          cursor pointer
          margin: 0 5px;
        }
        .runtime {
          position relative
          &:after {
            content: '';
            position: absolute;
            left: -2px;
            top: 7px;
            width: 20px;
            height: 2px;
            transform: rotate(-45deg);
            background-color: #dadada;
          }
        }
      }
    }

    .add-script {
      width: 20%;
      height: 20px;
      margin: auto;
      text-align: center;
      letter-spacing: 2px;
      cursor: pointer;
      font-size: 12px;
      margin-top: 15px;
    }

    .content {
      width: 100%;
      height: 300px;
    }
  }
</style>

<script type="text/ecmascript-6">
  /**
   * 脚本编辑管理
   */
  import BaseComponent from 'src/extend/BaseComponent'
  import scriptArray from '../../assets/data/script'
  import Server from 'src/extend/Server'
  import AssetsTags from '../AssetsTags'
  import {isNullOrUndefined} from 'src/assets/js/common'

  export default {
    mixins: [BaseComponent],
    name: 'ScriptEditor',
    components: {AssetsTags},
    props: {
    },
    data: function () {
      return {
        searchKey: '',
        selectedTags: [],
        categoryId: 6, // 脚本类型id
        scriptArray: scriptArray,
        info: null,
        activeNames: [],
        forbidEdit: false,
        array: [],
        folded: true,
        firstAdded: false, // 组件是否刚加载
      }
    },
    computed: {
      contents () {
        var script = this.info && this.info.script || ''
        if (script instanceof Array) {
          var trimedScript = script.filter(s => s && !isNullOrUndefined(s.content))
          if (trimedScript.length < script.length) {
            script = trimedScript
          }
        }
        return script
      },
      id () {
        return this.info && this.info.id || ''
      },
      scriptIds () {
        return (this.array || []).map(i => i.id).reverse()
      },
      raw () {
        return [this.info && this.info.id, JSON.stringify(this.array)]
      }
    },
    mounted: function () {
      window.$vue && this.onSelectOne(window.$vue)
      this.ema.bind('select.oneInfo', ({vm}) => {
        this.onSelectOne(vm)
      })
      this.ema.bind('edit-type.change', type => {
        this.forbidEdit = type !== 'EDITOR'
      })
      this.ema.bind('select.noOne', () => {
        this.info = null
      })
      this.loadData()
    },
    methods: {
      onSelectOne: function (vm) {
        this.info = vm.nodeInfo
        this.firstAdded = true
      },
      loadData: function () {
        var tags = this.selectedTags.map(v => {
          return {
            id: v.id,
            name: v.name
          }
        })
        Server({
          url: 'editor/resources/list',
          method: 'post',
          needLoading: false,
          data: {
            tags: tags || [],
            page: 1,
            pageSize: 1000,
            categoryId: 6,
            name: this.searchKey
          }
        }).then((response) => {
          var data = response.data
          // 设置分页信息
          this.scriptArray = data.data.list || []
        }).catch(() => {
        })
      },
      initData: function (data) {
        if (typeof data == 'string') {
          this.array = data ? [{name: '脚本1', content: data}] : []
        } else {
          this.array = data
        }
      },
      addScript: function (item) {
        if (!item) {
          item = {
            name: '未命名',
            content: '',
            id: Math.max(this.scriptIds[0] || 0, 65536) + 1
          }
          this.array.push(item)
          this.editItem(item)
        } else {
          if (this.scriptIds.indexOf(item.id) > -1) {
            this.$message({
              type: 'error',
              message: '该脚本已经添加过，不可重复添加'
            })
          } else {
            this.array.push({
              name: item.name,
              content: item.content,
              id: item.id
            })
            this.ema.fire('resource.use', item.id)
          }
        }
      },
      onTagSelect (tags) {
        console.log(tags)
        this.selectedTags = tags
        this.loadData(1, true)
      },
      deleteItem: function (item) {
        this.$confirm('确认删除该脚本?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.array.splice(this.array.indexOf(item), 1)
          this.ema.fire('script.delete', {key: `${this.id}_${item.id}`})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      editItem: function (item) {
        var me = this
        if ('$CodePanel' in window && typeof window.$CodePanel === 'object') {
          window.$CodePanel.openFile(item, { comId: this.id })
        } else {
          this.openDialog({
            name: 'd-editScript',
            data: {
              content: item.content,
              name: item.name,
              runtimeOnly: item.runtimeOnly,
              categoryId: item.categoryId || this.categoryId
            },
            methods: {
              reloadScriptList: function () {
                me.loadScript(this.categoryId)
              },
              saveContent: function ({name, content, runtimeOnly}) {
                item.content = content
                item.name = name
                me.$set(item, 'runtimeOnly', runtimeOnly)
              }
            }
          })
        }
      },
      renameItem (item) {
        this.$prompt('输入脚本名称').then(({action, value}) => {
          if (!('name' in item)) this.$set(item, 'name', '未命名')
          value = (value || '').trim()
          if (!value || value.length < 1) return this.$message('名称不能为空')
          if (action === 'confirm') {
            item.name = value
            this.ema.fire('script.rename', {key: `${this.id}_${item.id}`, name: value})
          }
        }).catch(() => console.log('怂了'))
      },
      async saveTemplate (item) {
        if (this.demoMode) return this.$alert('您处在 demo 模式下，不能保存数据哦')
        let yes = await this.$confirm('确定要将此脚本保存到脚本库中么，保存后可供下次使用（默认只对当前登陆用户可见，可至管理后台修改）。').catch(v => false)
        if (!yes) return
        Server({
          url: 'editor/resources/save',
          method: 'post',
          needLoading: false,
          data: {
            categoryId: 6,
            content: item.content,
            name: item.name,
            visibilitylevel: 0
          }
        }).then(res => {
          if (res.data.data.id) {
            this.$message({
              type: 'success',
              message: '脚本保存成功'
            })
          } else {
            throw new Error()
          }
        }).catch((e) => {
          console.log(e)
          this.$message({
            type: 'error',
            message: '脚本保存失败'
          })
        })
      },
      toogleRuntimeOnly (item) {
        if (!('runtimeOnly' in item)) this.$set(item, 'runtimeOnly', false)
        item.runtimeOnly = !item.runtimeOnly
      }
    },
    watch: {
      active: function (params) {
        if (this.active) {
          window.$vue && this.onSelectOne(window.$vue)
        }
      },
      contents: {
        deep: true,
        handler: function (newVal) {
          this.initData(newVal)
        }
      },
      raw: {
        handler: function (val, old) {
          // not init
          if (!val[0]) return
          // new component
          if (old[0] !== val[0]) return
          // same component no change
          if (val[1] === old[1]) return
          if (this.info) {
            console.log('script reload')
            this.info.script = this.array
            this.ema.fire('component.reload', this.id)
          }
        }
      }
    }
  }
</script>
