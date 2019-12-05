<template>
  <el-dialog :title="title" :visible.sync="Visible" @close="close" width="600px">
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="名称:" prop="name">
        <el-input type="text" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="描述:" prop="desc">
        <el-input type="text" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="" prop="isPublic">
        <el-radio-group v-model="form.isPublic" size="small">
          <el-radio-button label="1">公开</el-radio-button>
          <el-radio-button label="0">私有</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <div v-if="form.image" class="template-image">
        <img ref="pageshot" :src="form.image" alt="">
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click.stop="Visible = false">取 消</el-button>
      <el-button type="primary" @click.stop="save" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .template-image {
    width: 100%;
    text-align: center;
    border: 1px solid #dddddd;
    height: 400px;
    overflow: auto;

    img {
      max-width: 320px;
    }
  }
</style>
<script type="text/ecmascript-6">
  import BaseDialog from 'src/extend/BaseDialog'
  import Server from 'src/extend/Server'

  export default {
    mixins: [BaseDialog],
    name: 'd-saveCombinedComponent',
    data: function () {
      return {
        title: '另存为组合组件',
        Visible: true,
        form: {
          name: '',
          isPublic: 0,
          desc: '',
          image: ''
        },
        loading: false,
        rules: {
          name: [
            {required: true, message: '请输入组合组件名称', trigger: 'blur'},
          ],
          desc: [
            {required: true, message: '请输入组合组件描述', trigger: 'blur'}
          ]
        }
      }
    },
    components: {},
    computed: {},
    mounted () {
      this.$nextTick(this.getComponentShot)
    },
    methods: {
      getComponentShot: function () {
        this.loading = true
        this.ema.fire('screenshot', document.querySelector(`[el="${this.elID}"]`), {}, (url) => {
          console.log('componentShot', url)
          this.form.image = url
          this.loading = false
        }, false)
      },
      save () {
        var that = this
        this.$refs.form.validate((valid) => {
          if (!valid) return
          Server({
            url: 'editor/resources/save',
            method: 'post',
            needLoading: false,
            data: {
              categoryId: 2, // 功能模板
              content: that.content,
              icon: that.form.image,
              name: that.form.name,
              desc: that.form.desc,
              visibilitylevel: Number(that.form.isPublic)
            }
          })
          this.Visible = false
          this.$message({
            message: '组合组件保存成功',
            type: 'success'
          })
          setTimeout(() => {
            this.ema.fire('combinedComponent.refresh')
          }, 500)
        })
      }
    }
  }
</script>

