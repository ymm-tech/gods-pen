<template>
  <div class="functionEditor">
    <el-form label-width="80px">
      <el-form-item label="目标对象">
        <el-cascader size="mini" placeholder="当前节点" expand-trigger="click" :props="{value:'id',children:'child'}" :options="options" v-model="selectedOptions" @change="handleChange" @focus="loadNodeAndFunction" change-on-select>
        </el-cascader>
      </el-form-item>
      <div v-if="targetmethods.length>0">
        <div>可选方法</div>
        <div>
          <el-tag @click.native="methodSelect(item)" size="small" class="tags" :type="getTagType(item.name)" v-for="(item,key) in targetmethods" :key="item.name"> {{item.label}} </el-tag>
        </div>
        <!-- <el-checkbox-group v-model="methodNames" @change="methodChange" size="mini">
          <el-checkbox size="mini" v-for="(item,key) in targetmethods" :key="item.name" :label="item.name">{{item.label}}</el-checkbox>
        </el-checkbox-group> -->
      </div>
    </el-form>

    <el-collapse v-model="activeNames" class="collapse" accordion v-show="methodNames && methodNames.length">
      <el-collapse-item class="panel" :name="methodName" v-for="(methodName) in methodNames" :key="methodName">
        <template slot="title">
          <div v-for="exist in [fnExist(methodName)]" :key="methodName + exist" :style="{color: !exist ? 'red' : 'inherit'}">
            <i class="iconfont icon-function"></i>
            {{!!exist ? methodName : '不存在该方法 ' + methodName}}
            <i @click="delectFunc(methodName)" class="header-icon el-icon-delete"></i>
          </div>
        </template>
        <div class="params" v-if="hasParams(methodName)">
          <span class="tip">参数</span>
          <el-form size="mini" label-position="left" label-width="80px">
            <el-form-item v-for="(item,key) in params(methodName)" :key='key' class="form-item">
              <span slot="label" class="form-item-label">
                <el-tooltip v-if="item.desc" :content="item.desc" placement="top">
                  <i class="el-icon-info"></i>
                </el-tooltip>
                {{item.label}}
              </span>
              <el-input v-if="item.type=='string'" size="mini" @change="paramsChange" v-model.lazy="item.default"></el-input>
              <el-input v-else-if="item.type=='number'" size="mini" @change="paramsChange" v-model.lazy.number="item.default"></el-input>
              <el-switch v-else-if="item.type=='boolean'" size="mini" @change="paramsChange" v-model="item.default"></el-switch>
              <template v-else-if="item.type=='array'">
                <attr-data v-if="isOpen(methodName)" type="array" @change="paramsChange" :content.sync="item.default"></attr-data>
              </template>
              <template v-else-if="item.type=='object'">
                <attr-data v-if="isOpen(methodName)" type="object" @change="paramsChange" :content.sync="item.default"></attr-data>
              </template>
              <el-input v-else size="mini" @change="paramsChange" v-model.lazy="item.default"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="methodName" class="desc">
          调用方式：{{callString(methodName)}}
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .functionEditor {
    width: 90%;
    margin auto

    .el-form-item {
      margin-bottom: 5px;
    }

    .functionInput {
      width: 100%;
    }

    .collapse {
      margin: auto;
      padding: 10px;
    }

    .tags {
      margin: 5px;
      cursor: pointer;
    }

    .params {
      border-top: 1px solid #ddd;
      padding-top: 10px;
      margin: 0px 10px;
      margin-top: 22px;
      position: relative;

      .tip {
        position: absolute;
        top: -22px;
        left: 20px;
        line-height: 18px;
        padding: 2px 10px 0;
        border: 1px solid #ddd;
        border-bottom: none;
      }
    }

    .form-item-label {
      font-size: 12px;
    }

    .desc {
      margin: 5px 10px;
    }
  }
</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import AttrData from '../attr/Data'
  import cloneDeep from 'lodash/cloneDeep'

  export default {
    mixins: [BaseComponent],
    name: 'FunctionEditor',
    components: {AttrData},
    props: {
      content: {
        type: Array,
        default: function () {
          return []
        }
      },
      ignoreCheck: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        activeNames: [],
        methodNames: [], // 存放选中的方法
        selectedOptions: [], // 存放所有元素节点的信息，方便选中指定节点，获取对应方法
        allTargetmethods: {}, // 所有选中元素的可调用方法集合
        targetmethods: [], // 当前目标对象可选则的方法列表
        target: null,
        options: []
      }
    },
    watch: {
      /**
       * 内容修改后需要重新对数据进行初始化
       */
      content: {
        immediate: true,
        handler: function (newVal) {
          if (typeof this.content == 'function') {
            return
          }
          // 可选节点 默认选中当前选中节点
          if (this.selectedOptions.length == 0) {
            this.dealMethods(window.$vue)
          }
          this.changeContent(newVal)
        }
      }
    },
    computed: {
    },
    mounted: function () {
      // 选中元素清空原来已经选中的节点
      this.ema.bind('select.one', () => {
        this.selectedOptions = []
        this.dealMethods(window.$vue)
      })
      this.dealMethods(window.$vue)
    },
    methods: {
      isOpen (name) {
        return this.activeNames.includes(name)
      },
      methodSelect (item) {
        var index = this.methodNames.indexOf(item.name)
        if (index == -1) {
          this.methodNames.push(item.name)
        } else {
          this.methodNames.splice(index, 1)
        }
        this.methodChange()
      },
      delectFunc (methodName) {
        var id = this.methodNames.indexOf(methodName)
        this.methodNames.splice(id, 1)
        var contentId = -1
        this.content.forEach((value, index) => {
          if (value.method == methodName) {
            contentId = index
          }
        })
        this.content.splice(contentId, 1)
      },
      /**
       * 事件调用的目标元素修改后。获取新的可以选择的事件列表
       */
      handleChange (value) {
        console.log(value)
        let target = window.$_nodecomponents[this.selectedOptions[this.selectedOptions.length - 1]] || window.$vue
        this.dealMethods(target)
      },
      /**
       * 处理可调用方法列表
       */
      dealMethods: function (target) {
        this.targetmethods = []
        if (target) {
          this.targetmethods = this.getTargetMethod(target)
          this.target = target
        }
        return this.targetmethods
      },
      /**
       * 获取目标元素可调用的属性等信息
       * 1：获取当前元素可调用方法列表
       * 2：和上次获取的比较，删除减少的，添加新增的。
       */
      getTargetMethod (target) {
        if (!target) return []
        var targetmethods = []
        if (target) {
          var targetVm = target.$refs[target.nodeInfo.id]
          if (!targetVm) {
            return targetmethods
          }
          // 获取当前元素的所有可调用方法列表
          var editorMethods = Object.assign({}, targetVm.$options.editorMethods, targetVm.$options.editerMethods)
          for (const key in editorMethods) {
            var data = {
              name: target.nodeInfo.id + '.' + key,
              label: key,
              arguments: []
            }
            var desc = editorMethods[key]
            if (desc) {
              if (desc.label) {
                data.label = desc.label
              }
              if (desc.params) {
                data.arguments = desc.params
                // this.initParamsDefault(data.arguments, data.name)
              }
            }
            targetmethods.push(data)
          }
        }
        if (this.allTargetmethods[target.nodeInfo.id]) {
          this.dealTargetMethodsChange(targetmethods, this.allTargetmethods[target.nodeInfo.id])
        } else {
          this.allTargetmethods[target.nodeInfo.id] = cloneDeep(targetmethods)
        }
        return this.allTargetmethods[target.nodeInfo.id]
      },
      /**
       * 处理新老节点身上的方法变化
       */
      dealTargetMethodsChange: function (newMethods, oldMethods) {
        let newMethodsMap = {}
        let oldMethodsMap = {}
        newMethods.forEach(val => {
          newMethodsMap[val.name] = val
        })
        oldMethods.forEach(val => {
          oldMethodsMap[val.name] = val
        })

        // 添加缺少的
        for (let key in newMethodsMap) {
          // 如果不存在就添加进去
          if (!oldMethodsMap[key]) {
            oldMethods.push(newMethodsMap[key])
          }
        }
        // 删除多余的
        for (let key in oldMethodsMap) {
          // 如果不存在就添加进去
          if (!newMethodsMap[key]) {
            oldMethods.splice(oldMethods.indexOf(oldMethodsMap[key]), 1)
            this.methodNames.splice(this.methodNames.indexOf(key), 1)
            let contentKey = -1
            // 对没用的参数数据进行删除
            this.content.filter(s => s && s.method).forEach((element, index) => {
              // 兼容老的本部，对没有对象指定的方法 添加当前对象为目标对象
              if (element.method.indexOf('.') == -1) {
                element.method = window.$vue.nodeInfo.id + '.' + element.method
              }
              if (key == element.method) {
                contentKey = index
              }
            })
            this.content.splice(this.content.indexOf(contentKey), 1)
          }
        }
      },
      /**
       * 获取指定方法名对应的参数
       */
      params: function (methodName) {
        var targetmethods = []
        if (methodName) {
          var nodeid = methodName.split('.')[0]
          var target = window.$_nodecomponents[nodeid]
          if (!target) return targetmethods
          targetmethods = this.getTargetMethod(target)
          for (let index = 0; index < targetmethods.length; index++) {
            const element = targetmethods[index]
            if (element.name == methodName) {
              return element.arguments
            }
          }
        }
        return []
      },
      initParamsDefault: function (params, methodName) {
        // 初始化选择方法列表
        // 每个方法对应数据存放为map方便读取
        this.content.filter(s => s && s.method).forEach(element => {
          // 兼容老的本部，对没有对象指定的方法 添加当前对象为目标对象
          if (element.method.indexOf('.') == -1) {
            element.method = window.$vue.nodeInfo.id + '.' + element.method
          }
          if (methodName == element.method) {
            // 获取该方法的参数信息
            // 循环参数，设置值
            for (let index = 0; index < params.length; index++) {
              params[index].default = element.params[index]
            }
          }
        })
      },
      /**
       * 数据内容修改，重新填充数据
       */
      changeContent: function (content) {
        if (content) {
          // 初始化选择方法列表
          // 每个方法对应数据存放为map方便读取
          var methods = []
          content.filter(s => s && s.method).forEach(element => {
            // 兼容老的本部，对没有对象指定的方法 添加当前对象为目标对象
            if (element.method.indexOf('.') == -1) {
              element.method = window.$vue.nodeInfo.id + '.' + element.method
            }
            methods.push(element.method)
            // 获取该方法的参数信息
            var params = this.params(element.method)
            // 循环参数，设置值
            for (let index = 0; index < params.length; index++) {
              params[index].default = element.params[index]
            }
          })
          this.methodNames = methods
        }
      },
      /**
       * 对选着方法进行遍历，并组合数据同步到 content
       */
      joinContent: function () {
        var array = []
        this.methodNames.forEach(methodName => {
          var obj = {
            method: methodName,
            params: []
          }
          var params = this.params(methodName)
          for (let index = 0; index < params.length; index++) {
            const element = params[index]
            obj.params.push(element.default)
          }
          array.push(obj)
        })
        return array
      },
      methodChange: function () {
        this.paramsChange()
      },
      paramsChange: function () {
        var content = this.joinContent()
        console.log('update:content', JSON.stringify(content, null, 2))
        this.$emit('update:content', content)
      },
      hasParams: function (methodName) {
        if (this.params(methodName).length > 0) {
          return true
        } else {
          return false
        }
      },
      getTagType (name) {
        var index = this.methodNames.indexOf(name)
        if (index == -1) {
          return 'info'
        } else {
          return 'warning'
        }
      },
      /**
       * 判断该方法是否纯在
       */
      fnExist: function (methodName) {
        if (this.ignoreCheck) return true
        var nodeid = methodName.split('.')[0]
        var target = window.$_nodecomponents[nodeid]
        if (!target) return false
        var targetmethods = this.getTargetMethod(target) || []
        return targetmethods.some(v => v && v.name === methodName)
      },
      /**
       * 调用方法说明
       */
      callString: function (methodName) {
        var params = []
        this.params(methodName).forEach((element, index) => {
          var one = element.default
          params.push(`'${one}'`)
        })
        return `this.${methodName}(${params.join(',')})`
      },
      /**
       * 加载组件元素的树形结构，方便对元素进行选择
       */
      loadNodeAndFunction () {
        this.options = window.Editor.nodeInfo.child
      }
    }
  }
</script>

