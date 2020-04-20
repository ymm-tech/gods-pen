<template>
  <el-card class="eventEditor">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item :title="item.event" :name="index" v-for="(item,index) in inContent" :key="item.event">
        <div slot="title">
          {{item.event}}
          <i @click="delectFunc(item.event)" class="header-icon el-icon-delete"></i>
        </div>
        <attr-function :targetmethods="[]" :content.sync="item.callList"></attr-function>
      </el-collapse-item>
    </el-collapse>
    <div class="addScriptWarp">
      <el-select class="scriptselect" size="mini" v-model="selectEventKey" placeholder="请选择">
        <el-option v-for="item in eventList" :key="item.value" :label="item.value+'->'+(item.label||item.desc)" :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" size="mini" @click="addEvent" :disabled="canAdd">添加事件</el-button>
    </div>
  </el-card>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .eventEditor {
    .addScriptWarp {
      display: flex;
      margin-top: 10px;

      .scriptselect {
        margin-right: 10px;
      }
    }
  }
</style>

<script type="text/ecmascript-6">
  /**
   * 数据编辑器，
   * 后续扩展接口访问支持
   */
  import BaseComponent from 'src/extend/BaseComponent'
  import attrFunction from './Function'
  export default {
    mixins: [BaseComponent],
    name: 'DataEditor',
    components: {attrFunction},
    props: {
      content: {
        type: Array
      },
      /**
       * 支持 空，array，object
       */
      type: {
        type: String
      }
    },
    watch: {
      content: {
        immediate: true,
        handler: function (params) {
          this.inContent = params
        }
      },
      inContent: function (newVal) {
        this.$emit('update:content', newVal)
      }
    },
    data: function () {
      return {
        eventList: [
          {value: 'click', label: '点击', desc: '某个元素被用户点击'},
          {value: 'focus', label: '获得焦点', desc: '元素获得焦点。'},
          {value: 'blur', label: '失去焦点', desc: '元素失去焦点。'},
          {value: 'change', label: '内容被改变', desc: '域的内容被改变。'},
          {value: 'input', label: '输入', desc: '域的内容被改变。'},
          {value: 'select', label: '选项改变', desc: '选项文本被选中。'},
          {value: 'keypress', label: '键盘按键', desc: '某个键盘按键被按下并松开。'},
        ],
        activeNames: [0],
        selectEventKey: '',
        inContent: []
      }
    },
    computed: {
      selectEvent () {
        return (this.eventList || []).filter(s => {
          return this.selectEventKey == s.value
        })[0]
      },
      canAdd: function (params) {
        var has = this.inContent.find(val => {
          if (val.event == this.selectEventKey) {
            return true
          }
        })
        if (has) {
          return true
        } else {
          return false
        }
      }
    },
    mounted: function () {
      this.selectEventKey = 'click'
    },
    methods: {
      handleChange (params) {

      },
      delectFunc (params) {
        var id = -1
        this.inContent.forEach((val, index) => {
          if (val.event == params) {
            id = index
          }
        })
        this.inContent.splice(id, 1)
      },
      addEvent (params) {
        if (this.selectEvent) {
          this.inContent.push({
            event: this.selectEvent.value,
            callList: []
          })
        } else {
          this.inContent.push({
            event: 'click',
            callList: []
          })
        }
      }
    }
  }
</script>

