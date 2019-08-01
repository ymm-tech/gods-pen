<template>
  <div class="component fit-img" ref="box">
    <img @load="onload" :src="src">
    <spinner color="#fff" type="fading-circle" v-show="pending" :size="40" class="spinner"></spinner>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  @import '../../assets/style/base.styl';

  .component.fit-img {
    display: -webkit-box;
    -webkit-box-align: center;
    -webkit-box-orient: vertical;
    -webkit-box-pack: center;
    overflow: hidden;
    position: relative;

    & > img {
      visibility: hidden;
    }

    .spinner {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import { Spinner } from 'mint-ui'

  export default {
    mixins: [BaseComponent],
    name: 'FitImg',
    props: {
      src: {
        required: true
      }
    },
    data () {
      return {
        pending: true,
        boxHeight: 1,
        boxWidth: 1,
      }
    },
    components: { Spinner },
    mounted () {
      this.$nextTick(() => {
        this.boxHeight = this.$refs.box.clientHeight
        this.boxWidth = this.$refs.box.clientWidth
      })
    },
    methods: {
      onload (e) {
        var $img = e.currentTarget
        this.pending = false

        if (!$img) return
        var height = $img.clientHeight
        var width = $img.clientWidth

        if (height / width > this.boxHeight / this.boxWidth) {
          $img.style.height = '100%'
          $img.style.width = 'auto'
        } else {
          $img.style.height = 'auto'
          $img.style.width = '100%'
        }
        $img.style.visibility = 'visible'
      }
    }
  }
</script>
