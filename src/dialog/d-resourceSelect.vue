<template>
  <div class="imageSelectWarp">

    <el-dialog :title="showtitle" @click.stop='' :visible.sync="Visible" @close="close">
      <el-tabs v-model="activeName">
        <el-tab-pane label="所有列表" name="first">
          <div class="warp">

            <div class="searchTags">
              <el-tag :type="tag.type||'info'" class="tag" v-for="(tag,key) in canSelectTags" :key="key" @click.native="selectTag(tag)">
                <i class="iconfont icon-tag"></i>{{tag.name}}
              </el-tag>
            </div>
            <div class="imagesWarp">
              <div class="item" v-for="(item,key) in form.data" :key="key">
                <img v-if="type=='image'" class="img" :src="item.content+'?x-oss-process=image/resize,w_100/crop,w_100,h_100'" />
                <audio v-else-if="type=='audio'" class="audio" controls="controls"><source :src="item.content" type="audio/mpeg"></audio>
                <div class="name">{{item.name}}</div>
                <div class="select">
                  <el-button class="use" @click.stop="useImage(item)" type="primary" size="mini">使用</el-button>
                </div>
              </div>
            </div>
            <div class="footer">
              <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="loadData" :current-page="form.pagination.curr" :page-sizes="[30,100, 200, 300, 400]" :page-size="form.pagination.size" layout="total, sizes, prev, pager, next, jumper" :total="form.pagination.total">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="上传" name="second">
          <div class="warp">
            <div class="uploadImageWarp" @click="selectImage">
              <div v-if="uploadImage && uploadImage.src">
                <img v-if="type=='image'" :src="uploadImage.src" />
                <audio v-else-if="type=='audio'" class="audio" controls="controls"><source :src="uploadImage.src" type="audio/mpeg"></audio>
                <div v-else-if="type=='file'" class="file" controls="controls">
                  <span style="font-size: 160px;color: #bbbbbb;" class="el-icon-document"></span>
                </div>
              </div>
            </div>
            <upload-image v-if="type" :accept="type" ref="UploadImage" :showBtn="true" :auto="true" @uploadSuccess="uploadSuccess"></upload-image>
            <el-button class="useBtn" v-if="uploadImage && uploadImage.src" @click.stop="useImage(uploadImage)" type="success">使用</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="headerWarp">
        <div class="search">
          <el-input size="mini" placeholder="名称" v-model="form.search.name" class="input-with-select">
            <el-button size="mini" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
    </el-dialog>
  </div>

</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .imageSelectWarp {
    position: relative;

    .headerWarp {
      position: absolute;
      right: 10px;
      top: 60px;
      border-bottom: 1px solid #dddddd;
      padding-bottom: 10px;

      .tags {
        width: 50%;
        text-align: left;

        .tag {
          margin: 0 5px;
        }
      }

      .search {
        top: 0;
        position: absolute;
        right: 0;
        width: 150px;
      }
    }

    .warp {
      width: 100%;
      text-align: center;

      .searchTags {
        text-align: left;

        .tag {
          margin: 10px;
          cursor: pointer;
        }
      }

      .imagesWarp {
        overflow: auto;
        height: 400px;
        width: 100%;

        .item {
          border: 1px solid #dddddd;
          width: 120px;
          height: 120px;
          text-align: center;
          overflow: hidden;
          position: relative;
          float: left;
          margin: 10px;

          &:hover {
            .select {
              display: block;
            }
          }

          .img {
            left: 0;
            right: 0;
            top: 0;
            margin: auto;
            position: absolute;
            width: 100%;
          }

          .audio {
            width: 100px;
            height: 40px;
            margin-top: 30px;
          }

          .name {
            position: absolute;
            width: 100%;
            color: #ffffff;
            left: 0;
            top: 0;
            background-color: rgba(0, 0, 0, 0.42);
          }

          .select {
            display: none;
            position: absolute;
            width: 100%;
            height: 40px;
            left: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.42);

            .use {
              margin: 4px auto;
            }
          }
        }
      }

      .footer {
        width: 100%;
        height: 40px;
      }

      .uploadImageWarp {
        width: 160px;
        height: 300px;
        margin: 10px auto;
        border: 1px solid #dddddd;

        img {
          width: 100%;
        }

        audio {
          margin-top: 30px;
          text-align: center;
          width: 100%;
        }
      }

      .useBtn {
        margin-left: 10px;
      }
    }
  }
</style>
<script type="text/ecmascript-6">
  import BaseDialog from 'src/extend/BaseDialog'
  import Server from 'src/extend/Server'
  import UploadImage from 'src/components/UploadImage'
  export default {
    mixins: [BaseDialog],
    name: 'd-resourceSelect',
    data: function () {
      return {
        typeMap: {},
        activeName: 'first',
        type: '',
        canSelectTags: [],
        upImage: {
          editorId: 'imageupload_' + (new Date() - 0) + '_' + parseInt(Math.random() * 1000),
          inUrl: this.url,
          initUpload: null,
          uploadParamsConfig: '',
          host: '',
          fileName: ''
        },
        tags: [],
        Visible: true,
        uploadImage: {
          src: '',
          id: '',
        },
        form: {
          data: [],
          search: {
            name: '',
            categoryId: 0,
          },
          pagination: {
            size: 30,
            total: 0,
            curr: 1
          }
        }
      }
    },
    components: {UploadImage},
    computed: {
      showtitle () {
        if (this.typeMap[this.type]) {
          return this.typeMap[this.type].name
        }
        return null
      }
    },
    mounted () {
      this.editorId = 'imageupload_' + (new Date() - 0) + '_' + parseInt(Math.random() * 1000)
      this.getTypeList()
    },
    methods: {
      /**
       * 标签选中
       */
      selectTag: function (tag) {
        if (tag.type) {
          this.$set(tag, 'type', '')
        } else {
          this.$set(tag, 'type', 'success')
        }
        this.loadData()
      },
      // 获取分类列表
      getTypeList: function () {
        var me = this
        if (!this.type || this.type === 'file') return
        Server({
          url: 'editor/category/list',
          method: 'POST',
          data: {
            type: [3]
          }
        }).then((res) => {
          var data = res.data
          me.typeList = data.data || []
          me.typeList.map((item) => {
            this.type || (this.type = item.name)
            this.typeMap[item.name] = {
              id: item.id,
              name: item.name
            }
          })
          this.form.search.categoryId = this.typeMap[this.type].id
          this.loadData(1)
          this.loadTags()
        })
      },
      selectImage: function () {
        this.$refs.UploadImage.selectFile()
      },
      handleSizeChange: function (index) {
        this.form.pagination.size = index
        this.loadData(this.form.pagination.curr)
      },
      loadTags: function () {
        Server({
          url: 'editor/tags/list',
          method: 'post',
          data: {
            categoryId: this.typeMap[this.type].id,
            name: ''
          }
        }).then((response) => {
          var data = response.data
          // 设置分页信息
          this.canSelectTags = data.data || []
        }).catch(() => {
        })
      },
      searchByTag: function (item) {
        this.form.search.name = item.name
        this.loadData()
      },
      loadData (pageId) {
        this.form.pagination.curr = pageId
        var data = Object.assign({}, this.form.search)
        data.page = pageId
        data.pageSize = this.form.pagination.size
        data.tags = this.canSelectTags.filter(val => {
          return val.type == 'success'
        })
        Server({
          url: 'editor/resources/list',
          method: 'post',
          needLoading: false,
          data: data
        }).then((response) => {
          var data = response.data
          // 设置分页信息
          this.form.pagination.total = data.data.total
          this.form.data = data.data.list
        }).catch(() => {
        })
      },
      useImage: function (item) {
        if (typeof this.onSelectImage == 'function') {
          this.onSelectImage(item.src || item.content)
          this.ema.fire('resource.use', item.id)
          this.close()
        }
      },
      /**
       * 上传图片后回调
       */
      uploadSuccess (src) {
        this.uploadImage = {}
        if (!this.typeMap[this.type]) {
          this.uploadImage.src = src
          return
        }
        Server({
          url: 'editor/resources/save',
          method: 'post',
          needLoading: false,
          data: {
            categoryId: this.typeMap[this.type].id,
            content: src,
            visibilitylevel: 0
          }
        }).then(({data}) => {
          this.uploadImage = {
            src,
            id: data.data && data.data.id
          }
        })
      }
    }
  }
</script>

