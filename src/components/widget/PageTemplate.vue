<template>
  <div class="pageTemplate widget">
    <div class="box-search">
      <el-input class="searchInput" size="mini" placeholder="输入搜索关键字..." @keyup.enter.native="loadData(1)" v-model="searchKey">
        <i class="el-icon-close el-input__icon" style="color:#999;cursor: pointer;" slot="suffix" @click="searchKey = ''"></i>
        <el-button slot="append" @click.stop="loadData(1)" icon="el-icon-search"></el-button>
      </el-input>
      <assets-tags @selectchange="onTagSelect" :assets-id='categoryId'></assets-tags>
    </div>
    <div class="components">
      <el-card shadow="hover" class="itemWarp" v-for="(item,index) in list" :key="index">
        <div class="n1">
          <div class="img">
            <img v-if="item.image" :src="item.image+'?x-oss-process=image/resize,w_120/crop,w_120,h_170'"/>
            <img v-else src="../../assets/images/logo.png"/>
          </div>
          <h3 class="label">
            {{item.name}}
          </h3>
        </div>
        <div class="n2">
          <img v-if="item.image" class="img" :src="item.image+'?x-oss-process=image/resize,w_120/crop,w_120,h_170'"/>
          <div class="mask"></div>
          <div class="desc">{{item.desc||'该作者很懒，没有写详细描述。'}}</div>
          <el-button class="btn" type="primary" round size="mini" @click="selectOne(item)">使用</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
.pageTemplate {
  .box-search {
    .el-input__suffix {
      transform: translateX(-55px) !important;
    }
  }
}
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .pageTemplate {
    height: 100%;
    text-align: left;
    position: relative;
    padding: 0;
    flex-direction: column;
    display: flex;

    .box-search {
      width: 100%;
      background-color: #3c3a3a;
      padding: 10px;
    }

    .components {
      width: 100%;
      height: 0;
      flex: 1;
      overflow: auto;
      padding-bottom: 10px;
    }

    .itemWarp {
      width: 120px;
      height: 170px;
      margin: 4px;
      border-radius: 5px;
      font-size: 12px;
      text-align: center;
      display: inline-block;
      position: relative;

      .n1 {
        transition: top 0.2s;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        .img {
          margin: auto;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border: 1px solid #ddd;
          position: absolute;

          img {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
          }
        }

        .label {
          font-size: 12px;
          padding-right: 16px;
          padding-left: 16px;
          width: 100%;
          position: absolute;
          bottom: 0;
          text-align: center;
          overflow: hidden;
          text-align: center;
          white-space: nowrap;
          font-weight: 400;
          text-overflow: ellipsis;
          background-color: #272727ab;
          color: #fff;
          margin: 0;
        }
      }

      .n2 {
        position: absolute;
        top: 170px;
        left: 0;
        width: 100%;
        height: 100%;
        transition: top 0.2s;

        .mask {
          background-color: rgba(0, 0, 0, 0.5);
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }

        .img {
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }

        .desc {
          position: relative;
          z-index: 1;
          font-size: 12px;
          height: 112px;
          margin: 9px auto;
          padding: 0 11px;
          overflow: auto;
          color: #fff;
          text-align: center;
          font-weight: 400;
        }

        .btn {
          position: relative;
          z-index: 1;
        }
      }

      &:hover {
        border: 1px solid #409EFF;

        .n1 {
          opacity: 0;
          top: -120px;
        }

        .n2 {
          top: 0;
          opacity: 1;
        }
      }
    }
  }
</style>

<script type="text/ecmascript-6">
  /**
   * 页面模板
   */
  import BaseComponent from 'src/extend/BaseComponent'
  import {mapState} from 'vuex'
  import Server from '../../extend/Server'
  import AssetsTags from '../AssetsTags'

  export default {
    mixins: [BaseComponent],
    name: 'pageTemplate',
    components: {AssetsTags},
    data: function () {
      return {
        categoryId: 1,
        searchKey: '',
        selectedTags: [],
        list: []
      }
    },
    computed: mapState({}),
    mounted: function () {
      this.loadData()
    },
    methods: {
      loadData: function () {
        var tags = this.selectedTags.map(v => {
          return {
            id: v.id,
            name: v.name
          }
        })
        Server({
          url: 'editor/pages/publiclist',
          method: 'post', // default
          needLoading: false,
          data: {
            name: this.searchKey,
            tags: tags || []
          }
        }).then((respond) => {
          var data = respond.data
          this.list = data.data
        })
      },
      changePage: function (item) {
        Server({
          url: 'editor/pages/info',
          method: 'post', // default
          needLoading: false,
          data: {
            id: item.id + ''
          }
        }).then((respond) => {
          var data = respond.data.data
          var content = null
          if (data.content) {
            try {
              content = JSON.parse(data.content)
            } catch (error) {
              window.alert('模板解析失败')
            }
          }
          this.ema.fire('selectPageTemplate', content)
        })
      },
      onTagSelect (tags) {
        console.log(tags)
        this.selectedTags = tags
        this.loadData(1, true)
      },
      selectOne: function (item) {
        this.$confirm('确认使用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.changePage(item)
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消'
          })
        })
      }
    }
  }
</script>

