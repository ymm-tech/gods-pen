<template>
  <el-dialog :title="title" :visible.sync="Visible" @close="close" width="600px">
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="名称:" prop="name">
        <el-input type="text" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="描述:" prop="desc">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <div v-if="form.image" class="template-image">
        <img ref="pageshot" :src="form.image" alt="" style="width: 160px; height: 240px;">
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click.stop="Visible = false">取 消</el-button>
      <el-button type="primary" @click.stop="valid" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .template-image {
    width: 100%;
    text-align: center;
    border: 1px solid #dddddd;

    img {
      width: 160px;
      min-height: 240px;
    }
  }
</style>
<script type="text/ecmascript-6">
  import BaseDialog from 'src/extend/BaseDialog'
  import Server from 'src/extend/Server'
  import common from '../assets/js/common'

  export default {
    mixins: [BaseDialog],
    name: 'd-savePageOrTemplate',
    data: function () {
      return {
        title: '保存',
        Visible: true,
        keys: [],
        saveType: 1, // 1：页面  2：模板
        STORAGE_KEY: 'EditorautoSave_tmp',
        form: {
          name: '',
          desc: '',
          image: ''
        },
        loading: false,
        pageInfo: null,
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          desc: [
            {required: true, message: '请输入描述', trigger: 'blur'}
          ]
        }
      }
    },
    components: {},
    computed: {},
    mounted () {
      var urlInfo = common.parseURL(window.location.href)
      if (!urlInfo.params.key) {
        this.$alert('编辑页面缺少key')
        return
      }
      var keys = this.keys = urlInfo.params.key.split('/')
      if (keys.length == 1) {
        keys[1] = keys[0]
      }
      this.STORAGE_KEY = `EditorautoSave_${this.keys[0] || ''}_${this.keys[1] || ''}`
      if (this.pageInfo) {
        this.form.name = this.pageInfo.name
        this.form.desc = this.pageInfo.desc
        this.form.image = this.pageInfo.image
      }
      if (this.saveType == 1 && !this.pageInfo) {
        this.loadPageInfo()
      }
      this.$nextTick(this.getPreImage)
    },
    methods: {
      loadPageInfo: function () {
        var urlInfo = common.parseURL(window.location.href)
        if (!urlInfo.params.key) {
          this.$alert('编辑页面缺少key')
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
        })
      },
      getPreImage: function () {
        this.loading = true
        this.ema.fire('screenshot', document.querySelector('#stage'), {height: 486}, (src) => {
          console.log('screenshot', src)
          this.form.image = src
          this.loading = false
        }, false)
      },
      saveTemp () {
        var info = {
          categoryId: 1,
          content: window.localStorage.getItem(this.STORAGE_KEY),
        }
        Object.assign(info, this.form)
        Server({
          url: 'editor/template/save',
          method: 'post', // default
          data: info
        }).then((respond) => {
          this.$message({type: 'success', message: '保存成功'})
          this.close()
        }).catch((respond) => {
          this.$message({type: 'success', message: '保存失败'})
        })
      },
      savePage (src) {
        var info = Object.assign({}, this.pageInfo)
        info.name = this.form.name
        info.image = this.form.image
        info.desc = this.form.desc
        info.content = window.localStorage.getItem(this.STORAGE_KEY)
        Server({
          url: 'editor/pages/save',
          method: 'post', // default
          needLoading: true,
          data: info
        }).then(({data}) => {
          this.close()
          let code = data.code
          let msg = data.msg
          if (code == 500) return this.$alert(msg)
          this.$message({type: 'success', message: '保存成功'})
        }).catch((respond) => {
          this.$message({type: 'success', message: '保存失败'})
        })
      },
      valid () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.saveType == 1) {
              this.savePage()
            } else if (this.saveType == 2) {
              this.saveTemp()
            }
          }
        })
      }
    }
  }
</script>

