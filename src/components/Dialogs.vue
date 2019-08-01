<template>
  <div class="dialogs">
    <component v-for="item in dialogs" :is="item.name" :key="item.name"></component>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .dialogs {
    position: absolute;
  }
</style>

<script>
  import Vue from 'vue'
  import BaseComponent from 'src/extend/BaseComponent'
  export default {
    mixins: [BaseComponent],
    name: 'Dialogs',
    data: function () {
      return {
        dialogs: [],
        currentDialog: ''
      }
    },
    mounted: function () {
      // 打开一个弹出框
      this.bindEvent('push', (data) => {
        this.loadDialog({
          name: data.name,
          data: JSON.parse(JSON.stringify(data.data)),
          methods: data.methods
        }, () => {
          this.pushDialog(data.name)
        })
      })
      // 关闭指定弹出框
      this.bindEvent('close', (name) => {
        var lenght = this.dialogs.length - 1
        for (var i = lenght; i >= 0; i--) {
          var obj = this.dialogs[i]
          if (obj.name == name) {
            break
          }
        }
        this.dialogs.splice(i, 1)
      })
    },
    methods: {
      pushDialog: function (name) {
        // 对基础数据验证放入弹框列表中
        this.dialogs.push({
          name: name
        })
      },
      loadDialog: function (data, fn) {
        var name = data.name
        // eslint-disable-next-line
        import('../dialog/' + name + '').then(module => { // eslint-disable-line
          // 加载弹出框模块
          // 注入method 方法,注入初始化数据
          var tempModule = Vue.extend(module.default)
          tempModule = tempModule.extend({
            data: function () {
              return data.data
            },
            methods: data.methods
          })
          Vue.component(name, tempModule)
          fn()
        }).catch(() => {
          console.log('Chunk loading failed', name)
        })
      }
    }
  }
</script>

