<template>
  <div class='assets-tags' :class="{opend: opend}" v-if="sortedTags && sortedTags.length">
    <el-tag
      :key="tag.id" size="mini"
      v-for="tag in sortedTags"
      :type="tag.selected ? 'warning' : 'info'"
      style="margin-right: 2px; margin-top: 6px; cursor:pointer;"
      :disable-transitions="true"
      @click.native="onclick(tag)">
      <i class="iconfont icon-tag"></i>{{tag.name}}
    </el-tag>
    <div @click="opend = !opend" class="show-more">{{ !opend ? '查看更多标签▼' : '收起▲'}}</div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .assets-tags {
    position: relative
    max-height: 44px;
    padding-bottom: 18px;
    overflow hidden
    &.opend {
      max-height: initial
    }
    > .show-more {
      background-color: #3c3a3a;
      position: absolute
      left: 0
      right: 0
      bottom: 0px;
      font-size 12px;
      text-align: center;
      cursor pointer
    }
  }
</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import Server from 'src/extend/Server'

  export default {
    mixins: [BaseComponent],
    components: {},
    name: 'assets-tags',
    props: {
      assetsId: {
        type: [Number, String],
      }
    },
    data () {
      return {
        opend: false,
        assetsTags: [],
        historyTagsId: []
      }
    },
    computed: {
      sortedTags () {
        var historyTagsId = this.historyTagsId
        var tags = this.assetsTags
        .map((v, i) => {
          var exist = historyTagsId.indexOf(String(v.id))
          v.weight = exist > -1 ? exist - historyTagsId.length : i
          return v
        })
        .sort((a, b) => {
          return a.weight > b.weight ? 1 : -1
        })
        return tags
      },
      ASSETS_TAG_KEY () {
        return `ASSETS_TAG_${this.assetsId}`
      }
    },
    mounted () {
      this.initHistoryTags()
      this.getAssetsTags()
    },
    methods: {
      onclick (tag) {
        this.$set(tag, 'selected', !tag.selected)
        this.$emit('selectchange', this.sortedTags.filter(v => v.selected))
        if (tag.selected) this.addTagToHistory(tag.id)
      },
      async getAssetsTags () {
        this.assetsTags = await Server({
          url: 'editor/tags/list',
          method: 'post',
          data: {
            categoryId: this.assetsId,
            name: ''
          }
        }).then((response) => {
          var data = response.data
          return data.data || []
          // return [{id: 32, name: 32}, {id: 33, name: 33}, {id: 34, name: 34}, {id: 36, name: 36}, {id: 42, name: 42}, {id: 43, name: 42}, {id: 44, name: 42}, {id: 45, name: 42}]
        }).catch((e) => {
          console.log(e)
          return []
        })
      },
      initHistoryTags () {
        var tags = (window.localStorage.getItem(this.ASSETS_TAG_KEY) || '').split(',').filter(v => v && v.length)
        this.historyTagsId = tags
      },
      addTagToHistory (id) {
        id = String(id)
        var exist = this.historyTagsId.indexOf(id)
        if (exist > -1) this.historyTagsId.splice(exist, 1)
        this.historyTagsId.unshift(id)
        window.localStorage.setItem(this.ASSETS_TAG_KEY, String(this.historyTagsId))
      }
    }
  }
</script>
