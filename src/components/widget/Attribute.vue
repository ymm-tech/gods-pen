<template>
  <div class="widget attribute">
    <div v-show="selectNode">
      <el-alert class="alerttip" v-if="newVersion" title="组件有更新,点击查看详情" @click.native="showUpdate=!showUpdate" type="warning" :closable="false"></el-alert>
      <div class="update" v-if="newVersion&&showUpdate">
        <div class="desc">
          <div>
            新版本：{{this.newNodeInfo.version}},当前版本：{{selectNode.version}}
          </div>
        </div>
        <el-button type="primary" size="mini" @click="updateComponent">更新组件</el-button>
      </div>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基础信息" name="base">
          <el-form v-if="selectNode" size="mini" label-position="left" label-width="100px" :model="selectNode">
            <el-form-item label="唯一id" style="position: relative;">
              <el-input size="mini" v-model="id" :disabled="!canEditId" @change="idChange" style="padding-right: 25px;">
                <template slot="append">
                  <el-tooltip content="复制id" placement="top">
                    <a class="iconfont icon-copy" @click='copyId(id)'></a>
                  </el-tooltip>
                </template>
              </el-input>
              <template v-if="id !== 'root' && selectNode.type != 'node'">
                <a title="启用" v-show="canEditId" class="id-lock iconfont icon-unlock" @click='canEditId = false'></a>
                <a title="禁用" v-show="!canEditId" class="id-lock iconfont icon-lock" @click='canEditId = true'></a>
              </template>
            </el-form-item>
            <el-form-item label="名称">
              <el-input size="mini" v-model="selectNode.label" style="padding-right: 25px;">
                <template slot="append">
                  <el-tooltip content="组件当前版本" placement="top">
                    <a class="">v{{selectNode.version}} </a>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="显示">
              <el-switch key="1" size="mini" v-model="selectNode.visible"></el-switch>
            </el-form-item>
            <el-form-item v-show="!vm || vm.slots === false">
              <el-tooltip slot='label' content="控制子组件的位置排布方式" placement="top">
                <span>布局模式 <i class='el-icon-info' style='font-size: 12px'></i></span>
              </el-tooltip>
              <div>
                <el-tooltip class="item" content="子组件如楼层般依次向下扩展" placement="top">
                  <span :style="{color: !selectNode.stack ? '#faad14' : 'inherit'}"><i style='font-size: 12px' class='el-icon-info'></i>楼层模式 </span>
                </el-tooltip>
                <el-switch
                  key="1" size="mini" v-model="selectNode.stack"
                  active-color="#faad14"
                  inactive-color="#faad14">
                </el-switch>
                <el-tooltip class="item" content="子组件上下堆叠，位置可自由挪动" placement="top">
                  <span :style="{color: selectNode.stack ? '#faad14' : 'inherit'}"> 自由模式<i style='font-size: 12px' class='el-icon-info'></i></span>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="属性设置" name="attr">
          <div v-if="selectNode" size="mini" label-position="left" label-width="80px" :model="selectNode">
            <component v-if="currEditor" :key="currEditor" :is="currEditor" :component-info="currEditorData"></component>
            <template v-for="(item) in propsInfo">
              <div class="form-item" :key='item.key' v-if="(!item.work || item.work())&&!item.meta.ignore">
                <template>
                  <span class="label">
                    <el-tooltip placement="top">
                      <div style="max-width:300px" slot="content">{{item.desc||'无'}}</div>
                      <span>{{item.label||item.key}}</span>
                    </el-tooltip>
                  </span>
                  <span class="value" v-if="item">

                    <!-- 文本相关 -->
                    <el-input v-if="item.type=='string'" size="mini" v-model="selectNode.props[item.key]"></el-input>
                    <el-input v-else-if="item.type=='number'" type="number" size="mini" v-model.number="selectNode.props[item.key]"></el-input>
                    <el-input v-else-if="item.type=='input'" size="mini" v-model="selectNode.props[item.key]"></el-input>
                    <el-input v-else-if="item.type=='text'" :autosize="{ minRows: 2, maxRows: 5}" type="textarea" size="mini" v-model="selectNode.props[item.key]"></el-input>
                    <rich-text v-else-if="item.type=='richtext'" :id='id' v-model="selectNode.props[item.key]"></rich-text>
                    <y-color-picker v-else-if="item.type=='color'" v-model="selectNode.props[item.key]" show-alpha></y-color-picker>
                    <!-- json -->
                    <attr-data v-else-if="isCollapsed('attr') && item.type=='object'" type="object" :content.sync="selectNode.props[item.key]"></attr-data>
                    <attr-data v-else-if="isCollapsed('attr') && item.type=='array'" type="array" :content.sync="selectNode.props[item.key]"></attr-data>
                    <attr-data v-else-if="isCollapsed('attr') && item.type=='data'" :content.sync="selectNode.props[item.key]"></attr-data>
                    <!-- 布尔值 -->
                    <el-switch v-else-if="item.type=='boolean'" size="mini" v-model="selectNode.props[item.key]"></el-switch>
                    <!-- 图片 -->
                    <template v-else-if="item.type=='image'">
                      <resource type="image" :url.sync="selectNode.props[item.key]"></resource>
                    </template>
                    <resource v-else-if="item.type=='audio'" type="audio" :url.sync="selectNode.props[item.key]"></resource>
                    <resource v-else-if="item.type=='video'" type="video" :url.sync="selectNode.props[item.key]"></resource>
                    <resource v-else-if="item.type=='file'" type="file" :url.sync="selectNode.props[item.key]"></resource>
                    <!-- 方法调用 -->
                    <attr-function v-else-if="item.type=='function'" :content.sync="selectNode.props[item.key]"></attr-function>

                    <!-- 时间选择器 -->
                    <el-date-picker v-else-if="item.type=='date'" value-format='yyyy/MM/dd HH:mm:ss' v-model="selectNode.props[item.key]" type="datetime" placeholder="选择日期时间"></el-date-picker>

                    <!-- 枚举 -->
                    <el-select v-else-if="item.type=='enum'" :multiple="item.meta&&item.meta.multiple" size="mini" v-model="selectNode.props[item.key]" placeholder="请选择">
                      <el-option v-for="(item,key) in enumFilter(item.meta.defaultList)" :key="key" :label="item.label" :value="item.value"></el-option>
                    </el-select>

                    <template v-else-if="item.type=='checkbox'">
                      <!-- checkbox-group -->
                      <el-checkbox-group v-model="selectNode.props[item.key]" v-if="item.meta.defaultList">
                        <el-checkbox :label="item.value" :key="key" v-for="(item, key) in enumFilter(item.meta.defaultList)">{{item.label}}</el-checkbox>
                      </el-checkbox-group>
                      <!-- checkbox -->
                      <el-checkbox v-else v-model="selectNode.props[item.key]"></el-checkbox>
                    </template>

                    <!-- radio -->
                    <el-radio-group v-model="selectNode.props[item.key]" v-else-if="item.type=='radio'">
                      <el-radio :label="item.value" :key="key" v-for="(item, key) in enumFilter(item.meta.defaultList)">{{item.label}}</el-radio>
                    </el-radio-group>
                  </span>

                </template>
              </div>
            </template>
          </div>
        </el-collapse-item>
        <el-collapse-item title="事件管理" name="event">
          <attr-event v-if="selectNode" :content.sync="selectNode.events"></attr-event>
        </el-collapse-item>
      </el-collapse>
    </div>
    <i v-show="!selectNode" class="iconfont icon-nodata nodata"></i>
    <div class="forbid-edit-mask" v-show="forbidEdit"></div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .widget.attribute {
    position: relative;
    padding 5px !important
    .el-input-group__append {
      padding: 0 10px;
      cursor: pointer;
    }

    .update {
      padding: 20px 10px;
      text-align: center;

      .desc {
        text-align: left;
        margin: 10px 5px;
      }
    }

    .id-lock {
      position: absolute;
      right: 0;
      top: 0;
    }

    .alerttip {
      margin-bottom: 5px;
    }

    .noselect {
      font-size: 20px;
      color: #aaa;
      font-weight: bolder;
      text-align: center;
    }

    .form-item {
      margin-bottom: 5px;
      padding: 5px;

      &:hover {
        background-color: #6081bd33;
        border-radius: 5px;
        .label {
          color #ffffff
        }
      }

      .label {
        font-weight: bold;
        display: inline-block;
        margin-bottom: 4px;
        font-size: 12px;
        min-width: 70px;
      }

      .value {
        color: #909399;
      }
    }
  }
</style>

<script type="text/ecmascript-6">
  /**
   * 组件属性编辑器，每个组件的各个设置都是通过这里分发处理
   */
  import BaseComponent from 'src/extend/BaseComponent'
  import RichText from '../attr/RichText'
  import AttrData from '../attr/Data'
  import Resource from '../attr/Resource'
  import AttrEvent from '../attr/Event'
  import AttrFunction from '../attr/Function'
  import Server from 'src/extend/Server'
  import YColorPicker from '../style/ColorPicker'
  import Vue from 'vue'
  import cLoader from 'src/extend/componentLoader'

  const VERSION_CACHE = {}

  export default {
    mixins: [BaseComponent],
    name: 'Attribute',
    components: {RichText, Resource, AttrData, AttrFunction, YColorPicker, AttrEvent},
    data: function () {
      return {
        currEditor: '',
        currEditorData: {},
        showUpdate: false,
        id: '',
        canEditId: false,
        propsInfo: {},
        targetVm: null,
        activeNames: ['base', 'animate', 'attr'],
        selectNode: null,
        newNodeInfo: null,
        oldStyle: null,
        forbidEdit: false,
        vm: null
      }
    },
    props: {
      active: {
        type: [Number, Boolean],
        default: 0
      }
    },
    computed: {
      newVersion: function () {
        if (this.selectNode && this.newNodeInfo && this.newNodeInfo.name == this.selectNode.type && this.newNodeInfo.version != this.selectNode.version) {
          return true
        } else {
          return false
        }
      }
    },
    watch: {
      active: function (params) {
        if (this.active) {
          window.$vue && this.onSelectOne(window.$vue)
        }
      },
      selectNode: function (newNode) {
        console.log('selectNode', newNode)
        if (newNode && newNode.lock) {
          this.forbidEdit = true
        } else {
          this.forbidEdit = false
        }
      },
      id (val) {
        console.log('id change', val)
        this.checkNew(this.selectNode)
      }
    },
    mounted: function () {
      // 绑定被选中事件。确保只有一个元素被激活
      window.$vue && this.onSelectOne(window.$vue)
      this.ema.bind('select.oneInfo', ({vm}) => {
        this.onSelectOne(vm)
      })
      this.ema.bind('edit-type.change', type => {
        this.forbidEdit = type !== 'EDITOR'
      })
      this.ema.bind('select.noOne', () => {
        this.selectNode = null
        this.newNodeInfo = null
        this.vm = null
      })
    },
    methods: {
      onSelectOne: function (vm) {
        let id = vm.nodeInfo.id
        this.selectNode = null
        this.targetVm = vm.$refs[id]
        this.vm = vm
        this.dealPropsType()
        this.loadEditor(vm.nodeInfo)
        this.selectNode = vm.nodeInfo
        this.selectNode.animate = this.selectNode.animate || []
        this.selectNode.events = this.selectNode.events || []
        if (this.selectNode) {
          this.id = vm.nodeInfo.id
        }
      },
      async loadEditor (nodeInfo) {
        this.currEditor = ''
        this.currEditorData = null
        let component = await cLoader.loadEditor(nodeInfo)
        if (component) {
          var ctype = nodeInfo.id + '_Editor'
          Vue.component(ctype, component)
          this.currEditor = ctype
          this.currEditorData = nodeInfo.props
        }
      },
      isCollapsed (attr) {
        var activeNames = this.activeNames
        return activeNames && (activeNames.length && activeNames.indexOf(attr) > -1 || activeNames == attr)
      },
      checkNew: function ({type = ''} = {}) {
        if (!type) return
        if (type in VERSION_CACHE) {
          this.newNodeInfo = VERSION_CACHE[type]
          return
        }
        Server({
          url: 'component/find',
          method: 'post',
          needLoading: false,
          data: {
            name: type,
            version: ''
          }
        }).then(({data}) => {
          var list = data.data.list || []
          list.forEach(element => {
            if (element.isnew == 1) {
              VERSION_CACHE[type] = element
              this.newNodeInfo = element
            }
          })
        }).catch(() => {
        })
      },
      copyId (id) {
        this.ema.fire('clipboard.copy', id)
      },
      enumFilter (list) {
        if (!list) return []
        if (list instanceof Array) {
          return list.map(li => {
            return {
              label: li,
              value: li
            }
          })
        }
        if (typeof list === 'object') {
          return Object.entries(list).map(([key, value]) => {
            return {
              label: value,
              value: key
            }
          })
        }
        return list
      },
      /**
       * id变化需要查询是否可以改变，
       */
      idChange: function () {
        var canChange = false
        if (!window.$_nodecomponents[this.id]) {
          canChange = true
        }
        if (canChange) {
          this.$set(this.selectNode, 'id', this.id)
        } else {
          this.id = this.selectNode.id
        }
      },
      dealPropsType: function () {
        var instance = this.targetVm
        this.propsInfo = []
        function getPropType (prop) {
          // 编辑器属性上存在类型信息。以编辑器为准
          var propEditor = prop.editor || prop.editer
          if (propEditor && propEditor.type) {
            return propEditor.type.toLocaleLowerCase()
          }
          var type = prop.type
          if (typeof type == 'string') {
            return type
          }
          const match = type.toString().match(fnTypeRE)
          var ttype = typeof type === 'function'
            ? match && match[1] || 'any'
            : 'any'
          return ttype.toLocaleLowerCase()
        }
        if (instance && instance.$options) {
          var props = instance.$options.props
          var fnTypeRE = /^(?:function|class) (\w+)/
          var propsData = []
          for (let key in props) {
            const prop = props[key]
            var propEditor = prop.editor || prop.editer
            let propData = {
              key,
              value: instance[key],
              type: getPropType(prop),
              work: (propEditor && propEditor.work || (() => true)).bind(instance), // 新增属性有效性（是否应出现）的检测 绑定this至当前组件实例
              meta: propEditor || {},
              order: prop.order || 10000,
              required: !!prop.required
            }
            // 编辑属性存在则处理些特殊属性
            if (propEditor) {
              propData.label = propEditor.label
              propData.desc = propEditor.desc
            }
            propsData.push(propData)
          }
          this.propsInfo = propsData || []
          this.propsInfo = this.propsInfo.sort(function (a, b) {
            return a.order - b.order
          })
          console.log('propsData', propsData)
        }
      },
      changeValue (tab, event) {
      },
      /**
       * 组件更新
       */
      updateComponent: function () {
        this.$confirm('更新组件后，该组件设置的数据会丢失，确认更新该组件?', '提示', {
          confirmButtonText: '确认更新',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 调用目标对象的更新组件版本方法
          if (this.selectNode && this.newNodeInfo) {
            this.selectNode.path = this.newNodeInfo.path
            this.selectNode.version = this.newNodeInfo.version
          }
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消'
          })
        })
      }
    }
  }
</script>
