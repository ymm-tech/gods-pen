<template>
  <el-dialog :title="ctitle" width="80%" :center="true" :visible.sync="Visible" :modal="true" @close="close">
    <div class="editScript">
      <code-editor ctype='json' :options="{}" :contents.sync='contentStr'></code-editor>
    </div>
    <span slot="footer" v-if="type == 'import'" class="dialog-footer">
      <el-button @click.stop="close">取 消</el-button>
      <el-button type="primary" @click.stop="save(contentStr)">确 定</el-button>
    </span>
  </el-dialog>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .scriptName {
    margin-bottom: 10px;
  }

  .editScript {
    margin: auto;
    border: 1px solid #ddd;
    border: 0;
    height: 468px;
    display: block;
  }
</style>
<script type="text/ecmascript-6">
  /**
   * 对节点配置信息导入导出
   */
  import BaseDialog from 'src/extend/BaseDialog'
  import CodeEditor from '../components/code/index'
  import {modifyNodeId} from '../assets/js/common'

  export default {
    mixins: [BaseDialog],
    name: 'd-nodejson',
    components: {CodeEditor},
    data: function () {
      return {
        content: null,
        contentStr: '',
        idCache: [],
        type: ''
      }
    },
    mounted: function () {
      // var data = JSON.parse(this.content)
      /**
       * 遍历去掉 __ 开头的内部属性
       */
      // function walkall (data) {
      //   for (const key in data) {
      //     // console.log(key)
      //     if (data.hasOwnProperty(key)) {
      //       // console.log('own', key)
      //       // if (/^__/g.test(key)) {
      //       //   // delete data[key]
      //       // }
      //       if (data.child) {
      //         data.child.forEach(element => {
      //           walkall(element)
      //         })
      //       }
      //     }
      //   }
      // }
      // walkall(data)
      // this.contentStr = JSON.stringify(data, null, 4)
      this.contentStr = this.content
    },
    computed: {
      ctitle: function () {
        return this.type == 'import' ? '修改或导入数据' : '导出数据'
      }
    },
    methods: {
      save: function (content) {
        if (this.type == 'import') {
          var node = null
          try {
            node = JSON.parse(content)
          } catch (error) {
            console.log('error', error)
          }
          if (node) {
            node = modifyNodeId(node, Object.keys(window.$_nodecomponents || {}), this.idCache || [])
            this.saveContent(node)
            this.$message({
              type: 'success',
              message: '导入成功'
            })
            this.close()
          } else {
            this.$message({
              type: 'error',
              message: '导入失败'
            })
          }
        }
      }
    }
  }
</script>
