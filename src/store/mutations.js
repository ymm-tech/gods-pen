export const initComponentList = function (state, node) {
  state.componentList = node || {}
  var componentMap = {}
  // 对组件列表扁平化
  for (const key in node) {
    const element = node[key]
    element.child.forEach(value => {
      if (componentMap[value.name]) {
        console.error('存在组件名字相同的组件', value.name)
      } else {
        componentMap[value.name] = value
      }
    })
  }
  state.componentMap = componentMap
}
export const SettingChange = function (state, node) {
  Object.assign(state.setting, node)
  window.localStorage.setItem('EditorSetting', JSON.stringify(state.setting))
}

export const SET_CONFIG = function (state, cfg) {
  state.Config = cfg
}

export const SET_USER = function (state, user) {
  state.app.userInfo = user
}

export const SET_PAGE_INFO = function (state, info) {
  state.pageInfo = info
}

export const DATA_HUB_SET = function (state, info) {
  state.DataHub = info
}

export const SET_CURRENT_LAYOUT = (state, payload) => {
  state.viewOption.currentLayout = payload
}

export const SET_PAGE_TYPE = (state, payload) => {
  state.viewOption.pageType = payload
}
