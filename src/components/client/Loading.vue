<template>
  <div class="component loading">
    <mt-popup v-model="show" popup-transition="popup-fade" class="loading-popup" ref="loadEntity">
      <mt-spinner color="#fff" type="fading-circle" :size="40"></mt-spinner>
    </mt-popup>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import '../../assets/style/base.styl';

  .component.loading {
    .loading-popup {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate3D(-50%, -50%, 0);
    }

    .mint-popup {
      background: transparent;
    }
  }
</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import { Spinner, Popup } from 'mint-ui'

  export default {
    mixins: [BaseComponent],
    components: { MtSpinner: Spinner, MtPopup: Popup },
    name: 'Loading',
    data: function () {
      return {
        show: false
      }
    },
    created: function () {
      this.bindEvent('show', () => {
        this.show = true
        const $loadEntity = this.$refs.loadEntity.$el
        if (!$loadEntity) return
        $loadEntity.style.display = 'block'
      })
      this.bindEvent('hide', () => {
        this.show = false
        const $loadEntity = this.$refs.loadEntity.$el
        if (!$loadEntity) return
        $loadEntity.style.display = 'none'
      })
    },
    methods: {}
  }
</script>
