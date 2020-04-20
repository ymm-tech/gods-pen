<template>
  <div class="componentInfo">
    <div v-if='info'>
      <div class="title">
        <div class="icon">
          <img @error="imgError($event)" :src="getIcon(info)" alt="">
        </div>
        <div class="info">
          <div class="name">{{info.name}}</div>
          <div class="laberWarp">
            <span class="version">
              <el-tag size="mini" type="success">版本:{{info.version}}</el-tag>
            </span>
            <span class="down">
              <el-tag size="mini" type="warning">
                <i class="iconfont icon-download"></i> {{info.ComponentUse?info.ComponentUse.useNumber:0}}
              </el-tag>
            </span>
            <span class="status">
              <el-tag size="mini">{{info.status==1?'公开':'私有'}} </el-tag>
            </span>
            <span class="uptime">{{info.updateTime|datetime}}</span>
          </div>
          <div class="desc">{{info.desc}}</div>
        </div>
      </div>
      <div class="markdown" v-loading='loading'>
        <div v-html="md"></div>
      </div>
    </div>
    <i v-else class="iconfont icon-nodata nodata"></i>
    <div class="forbid-edit-mask" v-show="forbidEdit"></div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  @require '../../assets/style/markdown.css';

  .componentInfo {
    min-width: 400px;
    position: relative;

    .title {
      display: flex;
      flex-direction: row;
      padding: 10px 20px;
      border-bottom: 1px solid #dddddd;
      .icon {
        width: 100px;
        height: 100px;
        margin: 10px;
        min-height: 100px;
        min-width: 100px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .info {
        flex: 1;

        .name {
          width: 100%;
          color: #303133;
          font-size: 36px;
          margin: 10px 0;
          color #d8d8d8
        }

        .laberWarp {
          color: #606266;

          >span {
            margin-right: 10px;
            padding-right: 10px;
            border-right: 1px solid #dddddd;
          }

          .version {
          }

          .down {
          }

          .status {
          }

          .uptime {
            border-right: none;
          }
        }

        .desc {
          color: #909399;
          margin-top: 10px;
        }
      }
    }

    .markdown {
      min-height: 300px;
      color: #888;
      padding: 20px;
    }
  }
</style>

<script type="text/ecmascript-6">
  /**
   * 支持的可选组件列表
   */
  import BaseComponent from 'src/extend/BaseComponent'
  import {mapState} from 'vuex'
  import marked from 'marked'
  import axios from 'axios'

  export default {
    mixins: [BaseComponent],
    name: 'widgetComponentInfo',
    components: {},
    props: {
    },
    data: function () {
      return {
        loading: true,
        forbidEdit: false,
        info: null,
        md: ''
      }
    },
    computed: mapState({

    }),
    watch: {
    },
    created: function () {
      this.ema.bind('widgetComponentInfo.selectOne', data => {
        this.ema.fire('dock.panelActive', 'widgetComponentInfo')
        this.info = data
        this.loadMd(data)
      })
      this.ema.bind('edit-type.change', type => {
        this.forbidEdit = type !== 'EDITOR'
      })
    },
    methods: {
      getIcon: function (params) {
        let url = params.path.replace(/index.js$/, 'cover.png')
        return url
      },
      imgError (ev = {}) {
        const target = ev.target || {}
        const src = target.src
        if (/cover.png$/.test(src)) target.src = src.replace(/cover.png$/, 'icon.png')
      },
      loadMd: function (com) {
        let url = com.path.replace(/index.js$/, 'README.md')
        this.loading = true
        var instance = axios.create({
          timeout: 60 * 60 * 1000,
          headers: {},
          trimNull: false, // 是否去除空值
          withCredentials: false, // default
        })
        instance({
          url,
          method: 'get',
          needLoading: false,
        }).then(({data}) => {
          this.loading = false
          var md = (data || 'hello world')
          this.md = marked(md)
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
</script>
