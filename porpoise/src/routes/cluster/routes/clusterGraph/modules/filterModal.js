import moment from 'moment'
import { authorizedFetch } from 'actions/Global'

// ================== action types =============
const CH_CLUS_COMP_FILTER_STATUS = 'change_cluster_company_filter_status'
const TOGGLE_COMP_FILTER_MODAL = 'toggle_company_filter_modal'
const START_FILTER = 'START_FILTER'

// ================== actions ==================
export function toggleCompanyFilterModal (visible) {
  return {
    type: TOGGLE_COMP_FILTER_MODAL,
    visible
  }
}

export function changeClusterCompanyFilter (filters) {
  for (let key in filters) {
    if ((filters[key] instanceof Array && filters[key][0] === '全部') ||
      filters[key]['全部']) { // delete “全部”
      delete filters[key]
      continue
    }
    if (!Object.keys(filters[key]).length) { // delete empty object
      delete filters[key]
      continue
    }
  }
  return {
    type: CH_CLUS_COMP_FILTER_STATUS,
    filters
  }
}

export const startFilter = () => ({ type: START_FILTER })

export const getExchangeRate = () => {
  authorizedFetch('/api/search/exchange_rate_map').then((data) => {
    if (!data.status) {
      localStorage.setItem('exchange_rate_map', JSON.stringify(data.data))
    }
  })
}

// ================== reducers =================

export function clusterCompanyFilter (state = {
  visible: false,
  /** 通过时间戳控制是否开始筛选。之所以不用 filters 是因为每次改变筛选条件都会使 filters 改变；
   * 而只有点击筛选按钮，或在企业列表已选条件面板删除筛选条件时，才会触发筛选
   * */
  startFilterFlag: 0,
  filters: {}
}, action) {
  switch (action.type) {
    case CH_CLUS_COMP_FILTER_STATUS:
      setFilterCondition(action.filters)
      return Object.assign({}, state, {
        filters: action.filters
      })
    case TOGGLE_COMP_FILTER_MODAL:
      return Object.assign({}, state, {
        visible: action.visible
      })
    case START_FILTER:
      return Object.assign({}, state, {
        startFilterFlag: Date.now()
      })
    default:
      return state
  }
}

/**
 * 设置筛选器条件，用于直接对字段进行筛选
 * @param {Object} filters 筛选项
 */
function setFilterCondition (filters) {
  delete filters.condition
  if (!Object.keys(filters).length) {
    return
  }
  filters.condition = {}
  if ('企业类型' in filters) {
    filters.condition.belong_inner = filters['企业类型'][0] === '行内信贷客户'
  }
  if ('省份地区' in filters) {
    filters.condition.city = []
    const location = filters['省份地区']
    const cityFilter = filters.condition.city
    Object.keys(location).forEach((province) => {
      if (location[province][0] === '全部') {
        cityFilter.push(province)
        return
      }
      // 有城市时，只要匹配城市即可
      location[province].forEach((city) => {
        city = city[city.length - 1] === '市' ? city.slice(0, -1) : city
        cityFilter.push(city)
      })
    })
  }
  if ('行业门类' in filters) {
    filters.condition.industry = filters['行业门类']
  }
  if ('经营状态' in filters) {
    filters.condition.business_status = filters['经营状态']
    if (filters['经营状态'].includes('营业中')) {
      filters.condition.business_status = filters.condition.business_status.concat(['在业', '存续', '在册', '开业', '在营'])
    }
  }
  if ('成立年限' in filters) {
    filters.condition.registered_date = {}
    const regDate = filters.condition.registered_date
    const date = filters['成立年限']
    const today = new Date()
    if (date.min !== undefined) {
      regDate.max = today.getFullYear() - date.min + '-' + moment().format('MM-DD')
    }
    if (date.max !== undefined) {
      regDate.min = today.getFullYear() - date.max + '-' + moment().format('MM-DD')
    }
  }
  if ('注册资本' in filters) {
    filters.condition.registered_capital = filters['注册资本']
  }
  if ('是否上市' in filters) {
    filters.condition.is_listed = filters['是否上市'][0] === '是'
  }
  if ('关联方式' in filters) {
    filters.condition.linked_types = filters['关联方式']
  }
}
