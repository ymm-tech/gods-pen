import cloneDeep from 'lodash/cloneDeep'
import common from '../assets/js/common'

/**
 *
 * @param context
 */
export const initComponentList = ({
  commit
}, node) => {
  commit('initComponentList', node)
}
export const SettingChange = ({
  commit
}, node) => {
  commit('SettingChange', node)
}

export const setConfig = ({
  commit
}, cfg) => {
  commit('SET_CONFIG', cfg)
}

export const setUser = ({
  commit
}, user) => {
  commit('SET_USER', user)
}

export const setCurrentPage = ({
  commit,
  state
}, page) => {
  let info = Object.assign({}, state.pageInfo, {
    lastPage: state.pageInfo.currentPage,
    currentPage: page
  })
  commit('SET_PAGE_INFO', info)
}

export const setPageInfo = ({
  commit,
  state
}, pageInfo) => {
  let info = Object.assign({}, state.pageInfo, pageInfo)
  commit('SET_PAGE_INFO', info)
}

export const dataHubSet = ({
  commit,
  state
}, {
  path,
  val
}) => {
  let dataHub = cloneDeep(state.DataHub)
  common.objectSetByPath(dataHub, path, val)
  commit('DATA_HUB_SET', dataHub)
}

export const setCurrentLayout = ({commit}, type) =>  {
  commit('SET_CURRENT_LAYOUT', type)
}

export const setPageType = ({commit}, type) =>  {
  commit('SET_PAGE_TYPE', type)
}
