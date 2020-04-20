<template>
  <el-dialog :title="title" width="80%" :center="true" :visible.sync="Visible" :modal="true" @close="close">
    <el-input style="width: 400px;margin-bottom:16px;" class="scriptName" ref="nameinput" size="mini" v-model="name" placeholder="请输入内容">
      <template slot="prepend">名称</template>
    </el-input>
    <el-checkbox border size="mini" v-model="runtimeOnly">仅运行时执行</el-checkbox>
    <div class="editScript">
      <code-editor ctype='javascript' :ctrls='true' @ctrls='save' :options="{}" :contents.sync='content'></code-editor>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click.stop="close">关 闭</el-button>
      <el-button @click.stop="saveTemp(content)">保存到脚本库</el-button>
      <el-button type="primary" @click.stop="save(content)">确 定</el-button>
    </span>
  </el-dialog>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .editScript {
    margin: auto;
    margin-top: -11px;
    border: 1px solid #ddd;
    height: 468px;
    display: block;
    box-sizing: border-box;
  }
</style>
<script type="text/ecmascript-6">
  import BaseDialog from 'src/extend/BaseDialog'
  import CodeEditor from '../components/code/index'
  import Server from 'src/extend/Server'

  export default {
    mixins: [BaseDialog],
    name: 'd-editScript',
    components: {CodeEditor},
    data: function () {
      return {
        categoryId: 6,
        runtimeOnly: false,
        title: '脚本编辑',
        content: '',
        name: ''
      }
    },
    computed: {
    },
    mounted () {
      this.$nextTick(() => {
        this.$refs['nameinput'].focus()
      })
    },
    methods: {
      save: function (content) {
        if (!this.name) {
          var that = this
          this.$alert('请修改脚本名称').then(() => {
            that.$refs['nameinput'].focus()
          })
          return
        }
        this.$message({
          type: 'success',
          message: '已保存'
        })
        this.saveContent({content: this.content, name: this.name, runtimeOnly: this.runtimeOnly})
      },
      async saveTemp (content) {
        if (this.demoMode) return this.$alert('您处在 demo 模式下，不能保存数据哦')
        let yes = await this.$confirm('确定要将此脚本保存到脚本库中么，保存后可供下次使用（默认只对当前登陆用户可见，可至管理后台修改）。').catch(v => false)
        if (!yes) return
        Server({
          url: 'editor/resources/save',
          method: 'post',
          needLoading: false,
          data: {
            categoryId: this.categoryId,
            content: content,
            name: this.name,
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
            message: '脚本添加失败'
          })
        })
      }
    }
  }
</script>

