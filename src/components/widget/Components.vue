<template>
  <div class="mycomponents">
    <div class="box-search">
      <el-input
        size="mini"
        placeholder="输入搜索关键字..."
        @keyup.enter.native="search()"
        v-model="searchKey"
        style="width: 98%;"
      >
        <el-select
          class="type-select"
          size="mini"
          style="width: 74px;"
          v-model="searchType"
          slot="prepend"
          placeholder="请选择"
        >
          <el-option label="全部" :value="1"></el-option>
          <el-option label="自建" :value="2"></el-option>
        </el-select>
        <i
          class="el-icon-close el-input__icon"
          style="color:#999;cursor: pointer;"
          slot="suffix"
          @click="searchKey = ''"
        ></i>
        <el-button slot="append" @click.stop="search()" icon="el-icon-search"></el-button>
      </el-input>
      <el-dropdown class="component-menu" @command="handlePointMenu">
        <i style="font-size: 20px;" class="iconfont icon-point-menu"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="list">列表</el-dropdown-item>
          <el-dropdown-item command="card">卡片</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <assets-tags @selectchange="onTagSelect" :assets-id="categoryId"></assets-tags>
    </div>
    <div class="components" :class="[comListsStyle]">
      <div
        class="com-item"
        v-for="com in comLists"
        :key="com.id"
        @dragstart="dragstart($event,com)"
        draggable="true"
        @click="addOne(com)"
      >
        <div class="com-item-avatar">
          <img @error="imgError($event)" :src="com.path | componentIcon" class="icon-img" />
        </div>
        <div class="com-item-content">
          <p class="com-item-name">{{com.name}}</p>
          <p class="com-item-desc" @click.stop="readme(com)">{{com.desc}}</p>
          <p class="com-item-count">
            <i class="iconfont icon-download"></i>
            {{com.useNumber || 0}}
          </p>
        </div>
      </div>

      <a @click="goShop" class="addComponent">添加组件</a>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .mycomponents {
    .box-search {
      .el-input__suffix {
        transform: translateX(-55px) !important;
      }
    }

    .type-select .el-input__suffix {
      transform: none !important;
    }
  }
</style>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .mycomponents {
    height: 100%;
    position: relative;
    flex-direction: column;
    display: flex;

    .box-search {
      width: 100%;
      background-color: #3c3a3a;
      padding: 10px;
    }

    .component-menu {
      position: absolute;
      right: 0;
      top: 13px;
      cursor: pointer;

      &:hover {
        i {
          color: #303133;
        }
      }
    }

    .components {
      width: 100%;
      overflow: auto;
      height: 0;
      flex: 1;
      padding-bottom: 5px;
      padding-top: 5px;

      .addComponent {
        text-align: center;
        padding: 10px;
        clear: both;
        float: none;
        display: block;
        color: #faad14;
        font-size: 12px;
        cursor: pointer;
      }

      .com-item {
        position: relative;
        height: 50px;
        padding: 0 10px;
        display: flex;

        &:hover {
          background-color: #6081bd33;
          cursor: pointer;
        }

        .com-item-avatar {
          margin-top: 5px;
          width: 40px;
          height: 40px;

          img {
            overflow: hidden;
            border-radius: 5px;
            width: 90%;
            height: auto;
            vertical-align: bottom;
          }
        }

        .com-item-content {
          height: 50px;
          flex: 1;

          p {
            padding: 0;
            margin: 0;
            font-size: 12px;
            line-height: 1;
            text-align: left;
            margin-left: 5px;
          }

          .com-item-name {
            margin-top: 6px;
            font-size: 14px;
            font-weight: bold;
          }

          .com-item-desc {
            margin-top: 10px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;

            &:hover {
              color: #3899ec;
            }
          }

          .com-item-count {
            position: absolute;
            right: 10px;
            top: 3px;
            color: #00a5e0;
            font-size: 12px;
            transform: scale(0.8);

            i {
              vertical-align: -1px;
            }
          }
        }
      }

      &.card {
        .com-item {
          width: 118px;
          height: 118px;
          overflow: hidden;
          display: block;
          border: 1px solid #505152;
          box-shadow: 0 0 6px 0 rgba(22, 45, 61, 0.27);
          float: left;
          margin-left: 8px;
          margin-bottom: 8px;
          padding: 0;
          text-align: center;
          border-radius: 5px;
          display block
          position relative

          .com-item-avatar {
            margin 0
            width: 100%;
            height: 100%;
            img {
              width: 100%;
              height: 100%;
              max-width 100%;
              max-height 100%;
              object-fit contain
              object-position center center
              vertical-align top
            }
          }

          .com-item-name {
            word-wrap: break-word;
            display: none;
          }

          .com-item-content {
            margin: auto;
            height: auto;

            .com-item-desc {
              position absolute
              bottom 0
              left 0
              right 0
              text-align: center;
              white-space: pre-line;
              line-height: 1.3;
              padding 10px 10px;
              background-color: rgba(0,0,0,0.5);
              margin: 0;
              color: #fff;
              &:hover {
                color: #f9bf4d;
              }
            }

            .com-item-count {
              top: 0;
              right: 1px;
            }
          }
        }
      }
    }
  }
</style>

<script type="text/ecmascript-6">
  /**
   * 支持的可选组件列表
   */
  import BaseComponent from 'src/extend/BaseComponent'
  import {mapState} from 'vuex'
  import AssetsTags from '../AssetsTags'
  import Server from '../../extend/Server'

  export default {
    mixins: [BaseComponent],
    name: 'Components',
    components: {AssetsTags},

    props: {
    },
    filters: {
      componentIcon: function (path) {
        return !path ? 'https://imagecdn.ymm56.com/ymmfile/explore-biz/ymm_1527843621175.png' : path.replace(/index.js$/, 'cover.png')
      }
    },
    data: function () {
      return {
        categoryId: 3,
        searchKey: '',
        selectedTags: [],
        searchType: 1,
        activeNames: ['base', 'container', 'struct'],
        structPanel: ['struct'],
        comLists: [],
        comListsStyle: 'card'
      }
    },
    computed: mapState({
      componentList: state => {
        var array = []
        for (const key in state.componentList) {
          if (state.componentList.hasOwnProperty(key)) {
            const element = state.componentList[key]
            array.push({
              name: key,
              label: element.label,
              child: element.child
            })
          }
        }
        return array
      },
      pageType () {
        return this.$store.state.viewOption.pageType || 0
      }
    }),
    watch: {
    },
    mounted () {
      this.search()
      this.ema.bind('components.refresh', this.search)
    },
    methods: {
      imgError (ev = {}) {
        const target = ev.target || {}
        const src = target.src
        if (/cover.png$/.test(src)) target.src = src.replace(/cover.png$/, 'icon.png')
      },
      onTagSelect (tags) {
        this.selectedTags = tags
        this.search()
      },
      dragstart: function (ev, menu) {
        ev.dataTransfer.effectAllowed = 'move'
        ev.dataTransfer.setData('componentInfo', JSON.stringify(menu))
        ev.dataTransfer.setData('dragPos', JSON.stringify({
          x: ev.offsetX,
          y: ev.offsetY
        }))
        ev.dataTransfer.setDragImage(ev.target, ev.offsetX, ev.offsetY)
        return true
      },
      addOne: function (menu) {
        this.ema.fire('commponent.addOne', menu)
        this.ema.fire('dock.panelActive', 'widgetScene')
      },
      search () {
        var keyword = (this.searchKey || '').trim()
        keyword = keyword.replace(/^#+/, '')
        Server({
          url: 'component/searchByName',
          method: 'post', // default
          needLoading: false,
          data: {
            tags: this.selectedTags,
            type: this.pageType,
            name: keyword,
            onlyMine: this.searchType == 2
          }
        }).then(({data}) => {
          this.comLists = data.data && data.data.list || []
        })
      },
      readme (com) {
        this.ema.fire('widgetComponentInfo.selectOne', com)
      },
      goShop () {
        this.ema.fire('dock.panelActive', 'widgetShop')
      },
      handlePointMenu (type) {
        this.comListsStyle = type
      }
    }
  }
</script>
