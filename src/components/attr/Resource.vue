<template>
  <div class="resourceEditor">
    <el-input placeholder="选择资源" size="mini" v-model="inUrl">
      <el-button slot="append" icon="el-icon-upload" @click="selectImage">选择</el-button>
      <el-button size="mini" slot="append" icon="el-icon-picture" @click="cropper">裁剪</el-button>
    </el-input>
    <div class="preview" >
      <div class="in" :style="previewBg"></div>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .resourceEditor {
    padding: 0 10px;

    .preview {
      width: 100%;
      height: 150px;
      margin-top: 10px;
      background-color: #dddddd;
      background-image: url('../../assets/image/bgblank.svg');

      .in {
        width: 100%;
        height: 100%;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  export default {
    mixins: [BaseComponent],
    name: 'ResourceEditor',
    components: {},
    props: {
      url: {
        type: String
      },
      type: {
        type: String,
        default: 'image'
      }
    },
    watch: {
      url: function (newVal, oldVal) {
        this.inUrl = newVal
      },
      inUrl: function (newVal) {
        this.$emit('update:url', newVal)
      }
    },
    data: function () {
      return {
        inUrl: this.url
      }
    },
    computed: {
      previewBg () {
        return {
          'background-image': `url(${this.inUrl})`
        }
      }
    },
    mounted: function () {
    },
    methods: {
      selectImage: function () {
        var me = this
        this.openDialog({
          name: 'd-resourceSelect',
          data: {
            type: me.type
          },
          methods: {
            onSelectImage: function (url) {
              me.inUrl = url
            }
          }
        })
      },
      cropper: function () {
        // this.crop = true
        var me = this
        this.openDialog({
          name: 'd-crop',
          data: {
            name: '图片裁剪',
            url: me.url.split('?')[0]
          },
          methods: {
            done: function (e, type) {
              console.log('pos', e)
              let cUrl = me.url.split('?')[0]
              if (type == 'circle') {
                me.inUrl = cUrl + `?x-oss-process=image/rotate,${e.rotate}/crop,x_${parseInt(e.x)},y_${parseInt(e.y)},w_${parseInt(e.width)},h_${parseInt(e.height)}/circle,r_${parseInt(e.width / 2)}`
                return
              }
              me.inUrl = cUrl + `?x-oss-process=image/rotate,${e.rotate}/crop,x_${parseInt(e.x)},y_${parseInt(e.y)},w_${parseInt(e.width)},h_${parseInt(e.height)}`
              // this.$emit('update:url', this.inUrl)
            }
          }
        })
      }
    }
  }
</script>

