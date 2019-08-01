import {loadJs} from './Util'
export default {
  getComponent ({type, version}) {
    let C_KEY = `${type}@${version}`
    return this.componentCache[C_KEY]
  },
  componentCache: {},
  requestCache: {},
  async load ({type, path, version}) {
    version = version || '0.1.0'
    let C_KEY = `${type}@${version}`
    let component = this.getComponent({type, version})
    if (component) return component
    let request, url
    if (!this.requestCache[C_KEY]) {
      url = path
      if (process.env.CODE_ENV !== 'production') {
        url += '?' + new Date().getTime()
      }
      this.requestCache[C_KEY] = request = loadJs(location.protocol === 'https:' ? url.replace(/^http:/, 'https:') : url)
    } else {
      request = this.requestCache[C_KEY]
    }
    return await request.then(s => {
      component = window[C_KEY + 'index'] || window[C_KEY] || window[C_KEY.replace('@', '')]
      this.componentCache[C_KEY] = component = component.default || component
      return component
    }).catch(h => {
      console.log('加载脚本失败', url)
      console.error(h)
    })
  },
  async loadEditor ({type, path, version}) {
    if (!path) return
    version = version || '0.1.0'
    let C_KEY = `${type}@${version}editor`
    let component = this.componentCache[C_KEY]
    if (component) return component
    let request, url
    if (!this.requestCache[C_KEY]) {
      url = path.replace('index.js', 'editor.js')
      if (process.env.CODE_ENV !== 'production') {
        url += '?' + new Date().getTime()
      }
      this.requestCache[C_KEY] = request = loadJs(location.protocol === 'https:' ? url.replace(/^http:/, 'https:') : url)
    } else {
      request = this.requestCache[C_KEY]
    }
    return await request.then(s => {
      component = window[C_KEY]
      this.componentCache[C_KEY] = component = component.default || component
      return component
    }).catch(h => {
      console.log('该组件不存在对应编辑器', type)
    })
  }
}
