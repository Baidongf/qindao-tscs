import { getCompanyBrief } from './Card'
import { authorizedFetch } from './Global'

import {
  GET_RELATION_LIST_PATH
} from 'config'
/**
 * 筛选器tab状态
 * @param {Object} filterUIStatus 筛选器的展开状态
 * @return {Object} action
 */
export function changeFilterTab (filterUIStatus) {
  return {
    type: 'CHANGE_FILTER_TAB',
    filterUIStatus
  }
}

/**
 * 选择器参数
 * @param {Object} options 更改后的 option 对象
 * @return {Function} dispatch
 */
export function changeFilterOptions (options) {
  return (dispatch, getState) => {
    let state = getState()
    if (state.curNode.name !== state.location.query.company) {
      dispatch(getCompanyBrief(state.location.query.company))
    }
    options = setTradableFilter(options)
    dispatch({
      type: 'CHANGE_FILTER_OPTIONS',
      options
    })
    dispatch({
      type: 'TOGGLE_GRAPH_TYPE',
      isTree: false
    })
    dispatch({
      type: 'TOGGLE_CARD_TYPE',
      cardType: 'Company'
    })
    dispatch({
      type: 'SET_RE_RENDER_CHART',
      reRenderChart: true
    })
    dispatch({
      type: 'SET_OPERATE_CHART_STATUS',
      status: 'change_filter_options'
    })
  }
}

/**
 * 特殊情况
 * invest 选中，tradable_share 同时选中
 * invest_amount 有数值，tradable_share 取消选中
 * tradable_type = shareholder_type
 */
function setTradableFilter (options) {
  let investOption = options.edges.find((e) => e.class === 'invest').visible
  const investAmount = options.filter.edge.invest.invest_amount
  const shareholderType = options.filter.edge.shareholder.shareholder_type
  options.filter.edge.tradable_share.tradable_type = shareholderType
  const tradableOption = options.edges.find((e) => e.class === 'tradable_share')
  if (investOption) {
    tradableOption.visible = true
    if (investAmount.min || investAmount.max) {
      tradableOption.visible = false
    }
  } else {
    tradableOption.visible = false
  }

  return options
}
