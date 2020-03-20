<template>
  <div class="color-picker-wrapper">
    <el-input v-model="rawColor" size="mini">
      <el-color-picker
        slot="prefix"
        size="mini"
        v-model="rawColor"
        @active-change="changeColor"
        show-alpha
      ></el-color-picker>
    </el-input>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .color-picker-wrapper {
    .el-input--prefix .el-input__inner {
      padding-left: 36px;
    }

    .el-color-picker__trigger {
      border: none;
    }
  }
</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import {isNullOrUndefined} from '../../assets/js/common'
  export default {
    mixins: [BaseComponent],
    name: 'ColorPicker',
    components: {},
    props: {
      value: String,
      showAlpha: Boolean
    },
    data: function () {
      return {
        rawColor: '',
      }
    },
    mounted: function () {
      this.rawColor = this.value
    },
    watch: {
      rawColor (val) {
        var value
        if (val === '' || isNullOrUndefined(val)) return this.$emit('input', '')
        if (!this.isHex(val) && !this.isRgb(val)) return
        if (this.showAlpha) value = this.anyToRgba(val)
        else value = this.anyToHex(val)
        if (value) this.$emit('input', value)
      },
      value (val) {
        this.rawColor = val
      }
    },
    methods: {
      changeColor (color) {
        this.rawColor = color
      },
      isHex (val) {
        var reg = /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/
        return reg.test((val || '').trim())
      },
      isRgb (val) {
        var reg = /^rgb\(\d+\,\d+\,[\d.]+\)$|^rgba\(\d+\,\d+\,\d+\,[\d.]+\)$/
        return reg.test((val || '').replace(/\s/g, ''))
      },
      anyToRgba (val) {
        var rgba
        if (this.isRgb(val)) {
          rgba = val.replace(/rgba?\((.+)\)/, '$1').replace(/\s/g, '').split(',')
          rgba.push('1')
          rgba = rgba.slice(0, 4)
          return `rgba(${rgba.join(',')})`
        }
        if (this.isHex(val)) {
          rgba = val.replace('#', '').replace(/(.{2})/g, '$1_').split('_').slice(0, 4).map(c => parseInt(c, 16))
          rgba[3] = (Number(rgba[3] || '255') / 255).toFixed(2)
          return `rgba(${rgba.join(',')})`
        }
        return ''
      },
      anyToHex (val) {
        var hex
        if (this.isRgb(val)) {
          hex = val.replace(/rgba?\((.+)\)/, '$1').replace(/\s/g, '').split(',').rgba.slice(0, 3).map(Number).map(c => c.toString(16)).map(s => s.padStart(2, '0'))
          return `#(${hex.join('')})`
        }
        if (this.isHex(val)) {
          return val.slice(0, 7)
        }
        return ''
      }
    }
  }
</script>

