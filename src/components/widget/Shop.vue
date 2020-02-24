<template>
  <div class="shop">
    <iframe class="shop-frame" :src="shopUrl" frameborder="0"></iframe>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .shop {
    height 100%;
    overflow auto
  }
  .shop-frame {
    width: 100%;
    height: 100%;
    min-width: 500px;
  }
</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import Server from '../../extend/Server'

  export default {
    mixins: [BaseComponent],
    name: 'widgetShop',
    components: {},
    props: {
    },
    data: function () {
      return {}
    },
    created () {
      this.onMessage()
    },
    computed: {
      shopUrl () {
        return this.Config.SHOP
      }
    },
    methods: {
      onMessage () {
        window.addEventListener('message', (event = {}) => {
          const {data, origin} = event
          console.log(data, origin)
          const {action, payload} = data || {}
          switch (action) {
            case 'component.import':
              this.resourcesImport(payload)
              break
          }
        }, false)
      },
      resourcesImport (payload) {
        Server({
          url: 'component/import',
          method: 'post',
          needLoading: true,
          data: {
            id: payload.id,
            token: payload.token
          }
        })
          .then(({data} = {}) => {
            if (data.code == 500) this.$alert(data.msg)
            else {
              this.$alert('导入成功')
              this.ema.fire('components.refresh')
            }
          })
          .catch(console.error)
      }
    }
  }
</script>
