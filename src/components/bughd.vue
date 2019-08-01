<template>
  <transition name='bughd'>
    <div v-show='error && visible' class='bughd'>
      {{error && error.stack}}
      <div class='close-btn' @click='visible = false'><i class='el-icon-error'></i></div>
    </div>
  </transition>
</template>
<script>
import BaseComponent from 'src/extend/BaseComponent'

export default {
  name: 'bughd',
  mixins: [BaseComponent],
  data () {
    return {
      error: null,
      visible: true
    }
  },
  mounted () {
    this.ema.bind('bughd.open', e => {
      this.error = e
      this.visible = true
    })
  }
}
</script>
<style scoped>
  .close-btn {
    position: absolute;
    right: 20px;
    top: 20px;
    padding: 10px;
    cursor: pointer;
    font-size: 24px;
  }
  .bughd {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    max-height: 100%;
    padding: 16px;
    font-family: "Source Code Pro", Menlo, monospace;
    height: 698px;
    line-height: 18px;
    font-size: 12px;
    box-sizing: border-box;
    transition-duration: 300ms;
    overflow: auto;
    z-index: 999999;
    background-color: rgb(247, 247, 110);
    white-space: pre;
  }
  .bughd-enter-active, .bughd-leave-active {
    transition: bottom .35s
  }
  .bughd-enter, .bughd-leave-to {
    bottom: -100%;
  }
</style>
