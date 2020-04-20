<template>
  <div class="CombinedComponents widget">
    <div class="box-search">
      <el-input class="searchInput" size="mini" placeholder="输入搜索关键字..." @keyup.enter.native="loadData(1)"  v-model="searchKey">
        <i class="el-icon-close el-input__icon" style="color:#999;cursor: pointer;" slot="suffix" @click="searchKey = ''"></i>
        <el-button slot="append" @click.stop="loadData(1)" icon="el-icon-search"></el-button>
      </el-input>
      <assets-tags @selectchange="onTagSelect" :assets-id='categoryId'></assets-tags>
    </div>

    <div class="components">
      <el-card shadow="hover" class="itemWarp" v-for="(item,index) in list" :key="index">
        <div class="n1">
          <div class="img">
            <img v-if="item.icon" :src="item.icon+'?x-oss-process=image/resize,w_120/crop,w_120,h_120'"/>
            <img v-else src="../../assets/images/logo.png"/>
          </div>
          <h3 class="label">
            {{item.name}}
          </h3>
        </div>
        <div class="n2">
          <img v-if="item.icon" class="img" :src="item.icon+'?x-oss-process=image/resize,w_300/crop,w_300,h_300'"/>
          <div class="mask"></div>
          <div class="desc">{{item.desc||'该作者很懒，没有写详细描述。'}}</div>
          <el-button class="btn" type="primary" round size="mini" @click="install(item)">使用</el-button>
          <el-button class="btn" v-if='isMine(item)' @click.stop="remove(item)" type="danger" round size="mini">删除</el-button>
        </div>
      </el-card>
      <div style="text-align:center">
        <el-button v-show="hasMore" @click="loadMore" type="text">加载更多</el-button>
      </div>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
.CombinedComponents {
  .box-search {
    .el-input__suffix {
      transform: translateX(-55px) !important;
    }
  }
}
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .CombinedComponents.widget {
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
      height: 120px;
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
          position: relative;
          box-shadow: 0 0 13px 0 rgba(22, 45, 61, 0.27);

          img {
            position: absolute;
            width: 100%;
            height: auto;
            left: 0;
            top: 0;
            margin: auto;
            bottom: 0;
          }
        }

        .label {
          font-size: 12px;
          padding-right: 16px;
          padding-left: 16px;
          width: 100%;
          position: absolute;
          bottom: 0px;
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
        top: 120px;
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
          position: absolute;
          height: 100%;
          width: auto;
          left: 0;
          top: 0;
          margin: auto;
          bottom: 0;
        }

        .desc {
          position: relative;
          z-index: 1;
          font-size: 12px;
          height: 80px;
          margin: 4px auto;
          padding: 0 4px;
          overflow: auto;
          color: #ffffff;
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
  import Server from '../../extend/Server'
  import AssetsTags from '../AssetsTags'

  export default {
    mixins: [BaseComponent],
    name: 'CombinedComponents',
    components: {AssetsTags},
    data: function () {
      return {
        list: [],
        selectedTags: [],
        hasMore: true,
        categoryId: 2,
        page: 1,
        searchKey: '',
        pageSize: 30,
      }
    },
    mounted: function () {
      this.loadData()
      this.ema.bind('combinedComponent.refresh', () => {
        this.loadData(1)
      })
    },
    methods: {
      loadData: function (page, clear) {
        if (page > 0) {
          this.page = page
          this.list = this.list.slice(0, this.pageSize * (page - 1))
        }
        var tags = this.selectedTags.map(v => {
          return {
            id: v.id,
            name: v.name
          }
        })
        Server({
          url: 'editor/resources/list',
          method: 'post',
          needLoading: false,
          data: {
            tags: tags || [],
            name: this.searchKey || '',
            categoryId: this.categoryId,
            page: this.page,
            pageSize: this.pageSize
          }
        }).then(({data}) => {
          data = data && data.data
          var list = data && data.list || []
          if (clear) {
            this.list = list
            return
          }
          this.list = this.list.concat(list)
          if (list.length < this.pageSize) {
            this.hasMore = false
          }
        })
      },
      loadMore () {
        this.page += 1
        this.loadData()
      },
      install: function (item) {
        var node = item.content
        if (!node) return console.log('empty combined com')
        if (!window.$vue) return this.$alert('请先选中页面内的组件，再为其添加子组件')
        window.$vue.copyChild(node, {isJson: 1, keepPos: 1})
        this.$nextTick(() => this.ema.fire('tree.filter'))
        this.ema.fire('resource.use', item.id)
      },
      isMine (item) {
        var uid = this.App.userInfo && this.App.userInfo.userId
        return item.userId == uid
      },
      onTagSelect (tags) {
        console.log(tags)
        this.selectedTags = tags
        this.loadData(1, true)
      },
      remove (item) {
        var id = item.id
        if (!id) return console.log('no id founded')
        this.$confirm('确定要从组件库删除该组件吗？').then(() => {
          Server({
            url: 'editor/resources/delete',
            method: 'post',
            needLoading: false,
            data: {id}
          }).then(({data}) => {
            this.$message({
              type: 'info',
              message: '删除成功'
            })
            setTimeout(() => {
              this.loadData(1)
            }, 500)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    }
  }
</script>

