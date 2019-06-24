import { graphPostBody, filterUIStatus } from '../graph.config'

export function FilterUIStatus (state = filterUIStatus, action) {
  switch (action.type) {
    case 'CHANGE_FILTER_TAB':
      return Object.assign({}, action.filterUIStatus)
    default:
      return state
  }
}
export function FilterOptions (state = graphPostBody.options, action) {
  switch (action.type) {
    case 'CHANGE_FILTER_OPTIONS':
      return Object.assign({}, action.options)
    default:
      return state
  }
}

/**
 * 行内数据配置列表
 * @param {Array} state 行内配置列表. 初始值为 null, 用于区分尚未获取行内配置的情况
 * @param {Object} action action
 * @return {Array} 行内数据配置列表
 */
export function belongBankRelation (state = null, action) {
  switch (action.type) {
    case 'GET_BELONG_BANK_RELATION_SUCCESS':
      return action.data
    default:
      return state
  }
}
