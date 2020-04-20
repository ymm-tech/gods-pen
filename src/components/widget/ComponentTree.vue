<template>
  <div class="component-tree" @click="bgClick">
    <div class="box-search">
      <el-input size="mini" type="text" placeholder="输入搜索关键字..." v-model="filterText">
        <i class="el-icon-close el-input__icon" style="color:#999;cursor: pointer;" slot="suffix" @click="filterText = ''"></i>
        <el-button slot="append" @click.stop="search(true)" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <el-tree ref='tree' :data="treeData" :props="{'children': 'child'}"
      :show-checkbox="false" highlight-current :indent='8' draggable node-key="id"
      :filter-node-method="filterNode" default-expand-all :expand-on-click-node="false"
      :allow-drop='allowDrop' @current-change='onCheckChange' @node-contextmenu='contextmenu' @node-drop='nodeDropEnd'>
      <span @dblclick='tooglePacked(data)' class="custom-tree-node" :class='{"packed-node": rootNode.id !== data.id && data.packed}' slot-scope="{ node, data }" @dragstart.stop.prevent="() => {}" :draggable="data.renaming">
        <span v-show='!data.renaming' class='custom-tree-node-left'>
          <i v-show='rootNode.id !== data.id && data.packed' class='iconfont icon-pack'></i>
          <i v-show='data.script && data.script.length > 0' class='iconfont icon-function'></i>
          {{data.label || data.id}}
        </span>
        <input v-show='data.renaming' @keyup.enter="saveName(node, data)" v-model='data._label'/>
        <span v-if='data.type !== "node" && data.id !== "root"' class="teee-node-action">
          <template v-if="data.renaming">
            <el-tooltip content="保存" effect="light" placement="top">
              <a class="iconfont icon-save-black" @click="saveName(node, data)"></a>
            </el-tooltip>
            <el-tooltip content="取消" effect="light" placement="top">
              <a class="iconfont icon-close-black" @click="notSaveName(node, data)"></a>
            </el-tooltip>
          </template>
          <template v-if="!data.renaming">
            <el-tooltip content="重命名" effect="light" placement="top">
              <a class="iconfont icon-rename-box" @click.stop="rename(node, data)"></a>
            </el-tooltip>
            <el-tooltip content="复制" effect="light" placement="top">
              <a class="iconfont icon-copy" @click.stop="copy(node, data)"></a>
            </el-tooltip>
            <el-tooltip content="复制id" effect="light" placement="top">
              <a class="iconfont icon-id-black" @click.stop="copyId(node, data)"></a>
            </el-tooltip>
            <el-tooltip content="移除" effect="light" placement="top">
              <a class="iconfont icon-delete" @click.stop="remove(node, data)"></a>
            </el-tooltip>
            <el-tooltip content="加锁" effect="light" placement="top" v-if="!data.lock">
              <a class="id-lock iconfont icon-unlock" @click.stop="lock(node, data,true)"></a>
            </el-tooltip>
            <el-tooltip content="解锁" effect="light" placement="top" v-else>
              <a class="id-lock iconfont icon-lock" @click.stop="lock(node, data,false)"></a>
            </el-tooltip>
          </template>
        </span>
      </span>
    </el-tree>
    <div class="forbid-edit-mask" v-show="forbidEdit"></div>
  </div>
</template>

<script>
  import BaseComponent from 'src/extend/BaseComponent'

  export default {
    name: 'component-tree',
    componentName: 'component-tree',
    mixins: [BaseComponent],
    components: {},
    data () {
      return {
        filterText: '',
        forbidEdit: false,
        packedNodeStack: [],
        info: window.Editor.nodeInfo,
        currentNode: {}
      }
    },
    computed: {
      treeData () {
        return [this.info]
      },
      rootNode () {
        return this.info
      }
    },
    watch: {
      filterText: function (params) {
        this.search()
      },
      treeData () {
        this.$nextTick(this.search)
      }
    },
    methods: {
      allowDrop (draggingNode, dropNode, type) {
        if (!dropNode || !dropNode.id) return false
        if (!draggingNode || !draggingNode.id) return false
        if (draggingNode.data && draggingNode.data.id == this.rootNode.id) return false
        if (dropNode.data.id == this.rootNode.id && (type == 'prev' || type == 'next')) return false
        if (dropNode.id == draggingNode.id) return false
        var parentNode = type === 'inner' ? dropNode : dropNode.parent
        var childLimit = parentNode.data && parentNode.data.leaf ? 0 : parentNode.data && parentNode.data.childLimit
        var childLen = parentNode.data && parentNode.data.child && parentNode.data.child.length || 0
        if (childLen >= childLimit) return false
        if (type == 'inner' && dropNode.data && dropNode.data.packed) return false
        return true
      },
      nodeDropEnd (draggingNode, dropNode, type) {
        var parentNode = type === 'inner' ? dropNode : dropNode.parent
        var parentNodeInfo = parentNode.data || {}
        var draggingNodeInfo = draggingNode.data || {}
        console.log(draggingNodeInfo.id, 'droped in', parentNodeInfo.id)
        if (draggingNodeInfo.style && draggingNodeInfo.style.position === (parentNodeInfo.stack ? 'relative' : 'absolute')) {
          draggingNodeInfo.style = Object.assign({}, draggingNodeInfo.style, {
            position: parentNodeInfo.stack ? 'absolute' : 'relative',
            left: '0px',
            top: '0px',
          })
        }
        this.ema.fire('select.one', parentNode.data.id)
        this.search()
      },
      remove (node, data) {
        console.log(node, data)
        this.ema.fire('move.node', data.id, null)
      },
      rename (node, data) {
        this.$set(data, 'renaming', true)
        this.$set(data, '_label', data.label || data.id)
      },
      copy (node, data) {
        this.ema.fire('node.copy', data)
      },
      copyId (node, data) {
        this.ema.fire('clipboard.copy', data.id)
      },
      saveName (node, data) {
        if (!data) return
        var label = data._label
        this.$delete(data, 'renaming')
        this.$delete(data, '_label')
        data.label = label
      },
      notSaveName (node, data) {
        if (!data) return
        this.$delete(data, 'renaming')
        this.$delete(data, '_label')
      },
      onCheckChange (data, node) {
        console.log('onCheckChange', data, node)
        if (data.lock) {
          this.$message({type: 'warning', message: '已被锁定，请先解锁'})
        } else {
          var lastNode = this.currentNode || {}
          if (data.id == lastNode.key) return
          this.notSaveName(lastNode, lastNode.data)
          this.currentNode = node
          this.ema.fire('select.one', data.id)
        }
      },
      filterNode (keyword = '', data, node) {
        keyword = String(keyword).trim()
        const existKeyword = keyword.length ? (data.label || data.id).indexOf(keyword) !== -1 : true
        const $vm = this.getComponentById(data.id || 'n/a') || {}
        const packedChild = $vm.packedChild
        return existKeyword && !packedChild
      },
      contextmenu (e, data, node, context) {
        // this.ema.fire('select.one', data.id)
        this.ema.fire('show.contextMenu', this.getComponentById(data.id), e)
      },
      search () {
        this.$refs['tree'].filter(this.filterText)
      },
      getComponentById (id) {
        return window.$_nodecomponents && window.$_nodecomponents[id]
      },
      bgClick: function () {
        this.ema.fire('hide.contextMenu')
      },
      lock: function (node, data, flag) {
        this.ema.fire('lock.node', data.id, flag)
      },
      tooglePacked (data) {
        const nodevm = this.getComponentById(data.id)
        if (!nodevm) return
        if (data.packed) {
          typeof nodevm.openPacked === 'function' && nodevm.openPacked({ scene: 'component_tree' })
        } else {
          typeof nodevm.doPack === 'function' && nodevm.doPack({ scene: 'component_tree' })
        }
      }
    },
    created () {
    },
    mounted () {
      var $comtree = window.$comtree = this.$refs['tree']
      this.ema.bind('select.one', id => {
        if (!id) return
        if ($comtree.getNode(id).data.lock) {
          // $comtree.setCurrentKey(this.rootNode.id)
          this.$message({type: 'warning', message: '已被锁定，请先解锁'})
        } else {
          console.log('select.one 2', id, $comtree.getNode(id))
          $comtree.setCurrentKey(id)
          this.currentNode = $comtree.getNode(id)
          console.log('tree', this.currentNode)
        }
      })
      this.ema.bind('edit-type.change', type => {
        this.forbidEdit = type !== 'EDITOR'
      })
      this.ema.bind('nodeInfo.replace', info => {
        this.info = info
      })
      this.ema.bind('select.noOne', () => {
        this.currentNode = {}
      })
      this.ema.bind('nodeInfo.change', () => {
        this.info = window.Editor.nodeInfo
      })
      this.ema.bind('tree.filter', () => {
        this.search()
      })
      this.ema.bind('packedNode.push', (node) => {
        this.packedNodeStack.push(node)
        this.info = node
      })
      this.ema.bind('packedNode.pop', () => {
        this.packedNodeStack.pop()
        const len = this.packedNodeStack.length
        this.info = len == 0 ? window.Editor.nodeInfo : this.packedNodeStack[len - 1]
      })
      this.$nextTick(this.search)
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .component-tree {
    .box-search {
      .el-input__suffix {
        transform: translateX(-55px) !important;
      }
    }
  }
  .el-tree-node.is-current > .el-tree-node__content {
    .custom-tree-node-left::before {
      background: #383225 !important
    }
  }
  .component-tree {
    position: relative;
    min-height: 100%;

    .box-search {
      background-color: #3c3a3a;
      padding: 10px;
    }

    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
      text-shadow: 1px 1px 0px #000;

      .teee-node-action {
        display: none;
      }

      &:hover {
        .teee-node-action {
          display: block;
        }
        .custom-tree-node-left::before {
          background: #353535 !important
        }
      }
      &.packed-node {
        margin-left: -21px;
        .custom-tree-node-left::before {
          content: '';
          width: 20px;
          display: inline-block;
          background: #272727;
          height: 1em;
          position: relative;
        }
      }
    }

    .el-tree-node.is-current>.el-tree-node__content {
      color: #e6a23c;
      font-weight: bold;

      .teee-node-action {
        display: block;
        // color: #606266;
        font-weight: lighter;
      }
    }

    .el-tree-node__content {
      .el-tree-node__expand-icon {
      }

      .el-tree-node__expand-icon.is-leaf {
        color: transparent;
      }
    }
  }
</style>
