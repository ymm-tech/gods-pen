<template>
  <div>
    <div class="sliderWarp">
      <el-input :disabled="!canAdd" class="input" type='number' size="mini" v-model.number="value" placeholder=""></el-input>
      <el-select :disabled="!canAdd" class='nuit' v-model="unit" size="mini" placeholder="单位">
        <template v-if="!onlypx">
          <el-option v-for="item in Metadata.style.unit" :key="item.value" :label="item.label || item.value" :value="item.value">
          </el-option>
        </template>
        <el-option v-if='onlypx' label='px' value='px'></el-option>
      </el-select>
      <div class="style-lock" @click="canAdd = !canAdd">
        <el-tooltip class="item" effect="dark" content="启用" placement="top">
          <a v-show="canAdd" class="iconfont icon-unlock"></a>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="禁用" placement="top">
          <a v-show="!canAdd" class="iconfont icon-lock"></a>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>


<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .sliderWarp {
    display: flex;

    >>> .el-form-item__content {
      display: block;
    }

    .nuit {
      width: 80px;
      display: inline-block;
      margin-right: 10px;
    }

    .input {
      display: inline-block;
      width: 100px;
      margin-right: 10px;
      flex: 1;
    }

    .style-lock {
      cursor: pointer;

      .icon-lock {
        opacity: 0.5;
      }
    }

    .slider {
      display: block;
      width: 100%;
    }
  }
</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import {isNullOrUndefined} from '../../assets/js/common'
  export default {
    mixins: [BaseComponent],
    name: 'num',
    components: {},
    props: {
      styleAttr: {
        type: [String, Number]
      },
      min: {
        type: Number
      },
      max: {
        type: Number
      },
      step: {
        default: 1,
        type: Number
      },
      onlypx: {
        default: false,
        type: Boolean
      }
    },
    data: function () {
      return {
        canAdd: true,
        value: 0,
        unit: ''
      }
    },
    watch: {
      styleAttr: {
        handler: function (val) {
          if (val === this.computedAttr) return
          this.parse(val)
        },
        immediate: true
      },
      computedAttr (val) {
        if (val === this.styleAttr) return
        this.syncVal(val)
      }
    },
    computed: {
      computedAttr () {
        if (this.canAdd) {
          if (this.onlypx) this.unit = 'px'
          return this.combine(this.value, this.unit)
        } else {
          return null
        }
      }
    },
    mounted: function () {
    },
    methods: {
      parse (attr) {
        if (attr === '') {
          this.value = ''
          this.unit = ''
          this.canAdd = true
          return
        }
        if (isNullOrUndefined(attr)) {
          this.value = null
          this.unit = ''
          this.canAdd = false
          return
        }
        if (/^-?0(?!\.)/.test(attr)) {
          this.value = 0
          this.unit = String(attr).replace(/^[-\d.]+/, '') || ''
          this.canAdd = true
          return
        }
        if (/^[-\d.]/.test(attr)) {
          this.value = parseFloat(attr)
          this.unit = String(attr).replace(/^[-\d.]+/, '') || ''
          this.canAdd = true
          return
        }
        this.value = attr
        this.unit = ''
        this.canAdd = true
      },
      combine (val, unit) {
        var attr = val
        if (val === '') {
          attr = ''
        }
        if (isNullOrUndefined(val)) {
          attr = null
        }
        if (/^-?[\d.]+$/.test(val)) {
          attr = `${val}${unit || ''}`
        }
        return attr
      },
      syncVal (attr) {
        this.$emit('update:styleAttr', attr)
      }
    }
  }
</script>

