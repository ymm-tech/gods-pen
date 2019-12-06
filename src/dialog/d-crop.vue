<template>
  <el-dialog style="overflow: hidden;" :title="ctitle" top='5vh' width="85%" :center="true" :visible.sync="Visible" :modal="true" @close="close">
    <div class="card-warp" ref="dragbox">
      <div class="test">
        <div>
          <img ref="images" id="image" :src="imageUrl">
        </div>
      </div>
    </div>
    <div class="control-wrap">
      <el-form :inline="false" class="demo-form-inline">
        <el-form-item label="裁剪样式">
          <el-radio-group v-model="cutStyle" size='mini'>
            <el-radio-button label="rectangle">矩形</el-radio-button>
            <el-radio-button label="circle">圆形</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="剪切框外行为">
          <el-radio-group v-model="dragMode" size='mini'>
            <el-radio-button label="move">图片拖动</el-radio-button>
            <el-radio-button label="crop">剪切框</el-radio-button>
            <el-radio-button label="none">none</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图片缩放">
          <el-button @click="zoom('in')" type="primary" icon="el-icon-zoom-in" circle></el-button>
          <el-button @click="zoom('out')" type="primary" icon="el-icon-zoom-out" circle></el-button>
        </el-form-item>
        <el-form-item label="图片旋转">
          <el-button @click="rotate('+')" type="primary" icon="el-icon-plus"  circle></el-button>
          <el-button @click="rotate('-')" type="primary" icon="el-icon-minus"  circle></el-button>
        </el-form-item>
        <el-form-item label="图片偏移">
          <el-button @click="moveTo('up')" type="primary" icon="el-icon-arrow-up" circle></el-button>
          <el-button @click="moveTo('down')" type="primary" icon="el-icon-arrow-down" circle></el-button>
          <el-button @click="moveTo('left')" type="primary" icon="el-icon-arrow-left" circle></el-button>
          <el-button @click="moveTo('right')" type="primary" icon="el-icon-arrow-right" circle></el-button>
        </el-form-item>
        <el-form-item label="宽高比" >
          <el-radio-group v-model="aspectRatio" size='mini' :disabled="cutStyle=='circle' ">
            <el-radio-button :label="16/9">16:9</el-radio-button>
            <el-radio-button :label="4/3">4:3</el-radio-button>
            <el-radio-button :label="2/3">2:3</el-radio-button>
            <el-radio-button :label="1/1">1:1</el-radio-button>
            <el-radio-button label="NAN">Free</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="重置">
          <el-button @click="reset" type="primary" icon="el-icon-refresh" circle></el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="save">完成</el-button>
        </el-form-item>
        <!-- <el-form-item label="裁剪信息">
           <pre>{{cropData}}</pre>
        </el-form-item> -->
      </el-form>
    </div>
  </el-dialog>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  @import url('../assets/style/cropper.css');

  img {
    max-width: 100%;
  }
  .card-warp{
    width 70%
    display inline-block
  }
  .control-wrap{
    width 30%
    display inline-block
    vertical-align top
    box-sizing border-box
    padding 20px 0 0 20px
  }
</style>
<script type="text/ecmascript-6">
  /**
   * 对节点配置信息导入导出
   */
  import BaseDialog from 'src/extend/BaseDialog'
  import Cropper from 'cropperjs'
  export default {
    mixins: [BaseDialog],
    name: 'd-crop',
    components: {},
    data: function () {
      return {
        cropData: {},
        aspectRatio: 16 / 9,
        imgDoc: '',
        cropperInstance: '',
        cutStyle: 'rectangle',
        dragMode: 'move'
      }
    },
    mounted: function () {
      this.$nextTick(() => {
        this.imgDoc = this.$refs.images
        this.cropInit()
      })
    },
    computed: {
      ctitle: function () {
        return this.name
      },
      imageUrl: function () {
        return this.url
      }
    },
    watch: {
      aspectRatio: function(n, o) {
        this.setAspectRatio(n)
      },
      cutStyle: function (n, o) {
        this.setCutStyle(n)
      },
      dragMode: function (n, o) {
        this.cropperInstance.setDragMode(n)
      }
    },
    methods: {
      cropInit: function () {
        // 初始化这个裁剪框
        var self = this
        let image = this.imgDoc
        var minAspectRatio = 0.5
        var maxAspectRatio = 1.5
        this.cropperInstance = new Cropper(image, {
          // aspectRatio: self.aspectRatio.w / self.aspectRatio.h,
          aspectRatio: self.aspectRatio,
          viewMode: 0,
          scalable: true,
          zoomable: true,
          zoomOnTouch: true,
          zoomOnWheel: true,
          wheelZoomRatio: 0.1,
          center: true,
          movable: true,
          dragMode: this.dragMode,
          ready: function () {
            console.log('ready')
            var cropper = this.cropper
            var containerData = cropper.getContainerData()
            var cropBoxData = cropper.getCropBoxData()
            var aspectRatio = cropBoxData.width / cropBoxData.height
            var newCropBoxWidth
            if (aspectRatio < minAspectRatio || aspectRatio > maxAspectRatio) {
              newCropBoxWidth = cropBoxData.height * ((minAspectRatio + maxAspectRatio) / 2)
              cropper.setCropBoxData({
                left: (containerData.width - newCropBoxWidth) / 2,
                width: newCropBoxWidth
              })
            }
          },
          crop (e) {
            // console.log(e.detail)
            // let position = {'x': e.detail.x, 'y': e.detail.y, 'w': e.detail.width, 'h': e.detail.height}
            self.cropData = e.detail
          },
        })
      },
      zoom (type) {
        if (type == 'in') {
          this.cropperInstance.zoom(0.1)
        }
        if (type == 'out') {
          this.cropperInstance.zoom(-0.1)
        }
      },
      rotate (type) {
        if (type == '+') {
          this.cropperInstance.rotate(10)
        }
        if (type == '-') {
          this.cropperInstance.rotate(-10)
        }
      },
      moveTo (type) {
        if (type == 'up') {
          this.cropperInstance.move(0, -10)
        }
        if (type == 'down') {
          this.cropperInstance.move(0, 10)
        }
        if (type == 'left') {
          this.cropperInstance.move(-10, 0)
        }
        if (type == 'right') {
          this.cropperInstance.move(10, 0)
        }
      },
      setAspectRatio (ratio) {
        this.cropperInstance.setAspectRatio(ratio)
      },
      setCutStyle (type) {
        if (type == 'circle') {
          document.querySelector('.cropper-view-box').style.cssText = 'border-radius: 50%;'
          this.setAspectRatio(1)
        } else {
          document.querySelector('.cropper-view-box').style.cssText = 'border-radius: 0;'
        }
      },
      reset () {
        this.cropperInstance.reset()
        this.cutStyle = 'rectangle'
      },
      getImageData () {
        let data = this.cropperInstance.getImageData()
        console.log(data)
      },
      save () {
        this.done(this.cropData, this.cutStyle)
        this.close()
      }
    }
  }
</script>
