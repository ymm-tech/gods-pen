<template>
  <div class="shop">
    <iframe ref="shop" class="shop-frame" :src="shopUrl" frameborder="0"></iframe>
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
      window.addEventListener('message', this.onMessage, false)
    },
    beforeDestroy () {
      window.removeEventListener('message', this.onMessage)
    },
    computed: {
      shopUrl () {
        return this.Config.SHOP
      }
    },
    methods: {
      async getSelfComponents () {
        const list = await Server({
          url: 'component/searchByName',
          method: 'post',
          needLoading: false,
          data: {
            tags: [],
            type: 0,
            name: '',
            onlyMine: true
          }
        })
        .then(({data}) => data.data && data.data.list || null)
        .catch(e => (console.error(e), null)) // eslint-disable-line
        if (!list || !list.length) return null
        return list.reduce((o, v = {}) => {
          const name = (v.name || 'noop').replace(/^.+\//, '')
          o[name] = {name, version: v.version}
          return o
        }, {})
      },
      onMessage (event = {}) {
        const {data} = event
        const {action, payload} = data || {}
        switch (action) {
          case 'component.import':
            this.resourcesImport(payload)
            break
          case 'shop.loaded':
            this.onShopLoaded()
            break
        }
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
              this.onShopLoaded()
            }
          })
          .catch(console.error)
      },
      async onShopLoaded () {
        const selfComponents = await this.getSelfComponents()
        if (!selfComponents) return
        const $shop = this.$refs.shop.contentWindow
        $shop && $shop.postMessage({
          action: 'mycomponent.sync',
          payload: selfComponents
        }, '*')
      }
    }
  }
</script>
