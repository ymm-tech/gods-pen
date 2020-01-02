<template>
  <el-dialog v-loading='loading' class='psd_dialog' :title='title' width='50%' :center='true' :visible.sync='Visible' :modal='true' @close='close'>
      <div class='wraper'>
          <span>上传PSD文件</span>
          <input type='file' id='aptitude' accept='.psd' @change='change' ref='input'>
      </div>
      <div class='tips'>
          <section class='desc'><h4>上传须知</h4><ol><li _tracker_click_='_tracker_click_'> 为保证上传速度，PSD文件大小不超过<span>30M</span>，图层不能超过<span>30个</span>，且每个图层不能够超过<span>5M</span>。</li><li _tracker_click_='_tracker_click_'> 必须使用<span style="color:red">RGB/8</span>通道模式, 为保证图片质量，建议上传前尽量将效果合并至图层中。</li><!-- ngIf: isSuper --><!-- ngIf: isSuper --></ol></section>
      </div>
  </el-dialog>
</template>
<style lang='stylus' rel='stylesheet/stylus' scoped type='text/stylus'>
  .psd_dialog {
    .wraper {
      width: 80%;
      height: 80px;
      margin: 20px auto;
      border: 1px dashed #ccd5db;
      position: relative;
      text-align: center;

      input {
        width: 100%;
        height: 100%;
        opacity: 0;
        position: absolute;
        left: 0;
        top: 0;
      }

      span {
        text-align: center;
        line-height: 80px;
      }
    }

    .li {
      list-style: none;
    }
  }
</style>
<script type='text/ecmascript-6'>
  import BaseDialog from 'src/extend/BaseDialog'
  import Server from 'src/extend/Server'
  export default {
    mixins: [BaseDialog],
    name: 'd-psd',
    components: {},
    data: function () {
      return {
        loading: false,
        env: process.env.NODE_ENV,
        nodeTree: {
          'id': 'truck/imageid',
          'type': 'truck/image',
          'label': '图片id',
          'version': '0.1.10', // 可配置为自己的truck/image的版本
          'url': 'https://ymm-maliang.oss-cn-hangzhou.aliyuncs.com/truck/image/0.1.10/index.js',
          'visible': true,
          'style': {
            'position': 'absolute',
            'width': '313px',
            'height': '226px',
            'left': '3.453125px',
            'top': '0px',
            'opacity': 1,
          },
          props: {
            'url': '',
            'mode': 'widthFix',
            'click': []
          },
          'path': 'https://ymm-maliang.oss-cn-hangzhou.aliyuncs.com/truck/image/0.1.10/index.js',
          'script': [],
          'stack': true,
          'childLimit': 9999,
          'leaf': false,
          'animate': [],
          'events': []
        },
        content: [],
        psdFile: '',
        psdSize: '',
        psdUrl: '',
        psdName: ''
      }
    },
    mounted: function () {},
    computed: {},
    methods: {
      uptoServer (file) {
        console.log('file', file)
        var form = new window.FormData()
        form.append('file', file)
        return Server({
          url: 'editor/pages/psd-to-page',
          method: 'post',
          needLoading: false,
          data: form
        })
      },
      async change (e) {
        const phoneSize = Number(this.$store.state.setting.phoneSize.width.split('px')[0])
        let file = this.$refs.input.files
        console.log('file', file)
        if (!file[0]) return
        const size = (file[0].size / 1024 / 1024).toFixed(2)
        if (size > 30) return this.$alert('psd文件不能大于30M')
        this.psdFile = file[0]
        this.psdSize = size
        this.psdName = file[0].name
        this.loading = true
        let result = await this.uptoServer(file[0])
        try {
          var res = result.data.data
          var docWidth = res.document.width
          var rate = (phoneSize / docWidth).toFixed(2)
          var descendants = res.elements || []
          var nodeJson = []
        } catch (error) {
          this.loading = false
          return this.$alert(result.data.msg)
        }
        if (descendants.length == 0) {
          this.loading = false
          this.$alert('未发现图层,请检查通道模式')
          return
        }
        for (let m = 0; m < descendants.length; m++) {
          let config = JSON.parse(JSON.stringify(this.nodeTree))
          let random = parseInt(Math.random() * 10000)
          config.id = config.id + random
          config.label = config.label + random
          config.style.width = (descendants[m].width) * rate + 'px'
          config.style.height = (descendants[m].height) * rate + 'px'
          config.style.left = (descendants[m].left) * rate + 'px'
          config.style.top = (descendants[m].top) * rate + 'px'
          config.props.url = descendants[m].src
          nodeJson.push(config)
        }
        this.content = nodeJson
        // let data = await this.uploadOss(this.psdFile, true)
        // let resu = data.data
        // if (resu.code == 1 && (resu.data instanceof Array)) {
        //     this.psdUrl = resu.data[0].path
        // }
        this.loading = false
        this.open()
      },
      dataURLtoFile (dataurl, filename) {
        if (!filename) filename = Math.floor(Math.random() * 10000) + '.png'
        // 将base64转换为文件
        if (!dataurl.startsWith('data:image/png;base64,')) {
          dataurl = 'data:image/png;bases64,' + dataurl
        }
        console.log()
        var arr = dataurl.split(',')
        var mime = arr[0].match(/:(.*?);/)[1]
        var bstr = window.atob(arr[1])
        var n = bstr.length
        var u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new window.File([u8arr], filename, {type: mime})
      },
      uploadOss (file, isFile = false) {
        if (!isFile) {
          file = this.dataURLtoFile(file)
        }
        const url = '/ossupload/uploadFile'
        var form = new window.FormData()
        form.append('files', file)
        console.log('form', form)
        return Server({
          url: url,
          method: 'post',
          needLoading: false,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: form
        })
      },
      open () {
        this.$confirm('文件解析成功, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('确定')
          const psdJson = {
            size: this.psdSize,
            name: this.psdName,
            // url: this.psdUrl
          }
          console.log('this.content', this.content)
          this.changeNode(JSON.stringify(this.content), JSON.stringify(psdJson))
          this.close()
        }).catch(() => {})
      }
    }
  }
</script>
