import { combineReducers } from 'redux'
import { get, post } from 'utils/dataAccess/axios'

// --------------------------
// Constants
// --------------------------

const IS_MOCK = true
const baseUrl = (IS_MOCK ? '/mock' : '') + '/gap/api/homepage'
const base = '/crm-fd/api'

// 获取首页展示的模块
const GET_HOME_MODULES = 'GET_HOME_MODULES'
const SEARCH = 'SEARCH'
const GET_RECENT_BROWSE = 'GET_RECENT_BROWSE'
const UPDATE_HOME_MODULES = 'UPDATE_HOME_MODULES'

// 获取各个模块的数据
const GET_BO_DATA = 'GET_BUSINESS_OPPORTUNITY_DATA'
const GET_CA_DATA = 'GET_CUSTOMER_ACTIVITY_DATA'
const GET_CI_DATA = 'GET_CUSTOMER_INFO_DATA'
const GET_KB_DATA = 'GET_KNOWLEDGE_BASE_DATA'
const GET_MA_DATA = 'GET_MARKETING_ACTIVITY_DATA'
const GET_MR_DATA = 'GET_MARKETING_RESULTS_DATA'
const GET_WS_DATA = 'GET_WORK_SCHEDULE_DATA'



// --------------------------
// Actions
// --------------------------

export const getHomeModules = () => {
  const getConfig = {
    url: `${base}/homepage/module`,
    actionType: GET_HOME_MODULES,
    successConfig: {
      // message: 'get module success',
      callback: (payload) => {}
    },
    failConfig: {
      message: 'get module failed'
    },
  }
  return get(getConfig)
}

const MODULE_CONFIGS = {
  businessOpportunity: {
    url: `${base}/businessChance/query`,
    type: GET_BO_DATA,
  },
  customerActivity: {
    url: `${base}/customerDynamic/query`,
    type: GET_CA_DATA,
  },
  customerInfo: {
    url: `${base}/customer/search`,
    type: GET_CI_DATA,
  },
  knowledgeBase: {
    url: `${base}/knowledge/query`,
    type: GET_KB_DATA,
  },
  marketingActivity: {
    url: `${base}/marketingCampaigns/queryCreater`,
    type: GET_MA_DATA,
  },
  marketingResults: {
    url: `${baseUrl}/marketingResults`,
    type: GET_MR_DATA,
  },
  workSchedule: {
    url: `${base}/workSchedule/query`,
    type: GET_WS_DATA,
  },
}

// 首页业务模块数据
export const getHomeModuleData = (moduleName, extraData = {}) => {
  const requestConfig = {
    url: MODULE_CONFIGS[moduleName]['url'],
    actionType: MODULE_CONFIGS[moduleName]['type'],
    successConfig: {
      // message: `get ${moduleName} data success`,
      callback: (payload) => {},
    },
    failConfig: {
      message: `get ${moduleName} data failed`
    }
  }

  // 有些是 post 有些是 get，需要区分
  if (
    moduleName === 'customerInfo' ||
    moduleName === 'customerActivity' ||
    moduleName === 'businessOpportunity' ||
    moduleName === 'knowledgeBase' ||
    moduleName === 'workSchedule' ||
    moduleName === 'marketingResults' ||
    moduleName === 'marketingActivity'
  ) {
    requestConfig.bodyData = { pageNo: 1, pageSize: 5 }

    // 客户信息模块只要行内客户的
    if (moduleName === 'customerInfo') {
      requestConfig.bodyData.inInterFilter = '0'
    }

    // 商机模块，需要根据用户的身份调不同的接口
    if (moduleName === 'businessOpportunity') {
      const isCustomerManager = localStorage.getItem('IS_CUSTOMER_MANAGER')
      if (isCustomerManager === '1') {
        requestConfig.url = `${base}/businessChance/query`
      } else {
        requestConfig.url = `${base}/businessChance/queryBranch`
      }
    }

    // 营销成果，特殊处理（URL，传参） start
    if (moduleName === 'marketingResults') {
      const { isCustomerManager, userId, institutionId } = extraData
      if (isCustomerManager === '1') {
        requestConfig.url = `${base}/marketingCampaignsReport/userReport/${userId}`
      } else {
        requestConfig.url = `${base}/marketingCampaignsReport/institutionReport/${institutionId}`
      }
      requestConfig.bodyData = {
        reportDate: (new Date()).toISOString().substr(0, 10)
      }
    }
    // 营销成果，特殊处理 end

    return post(requestConfig)
  } else {
    return get(requestConfig)
  }
}

// 搜索
export const search = (bodyData) => {
  const postConfig = {
    url: `${base}/customer/search`,
    bodyData,
    actionType: SEARCH,
    successConfig: {},
    failConfig: {
      message: '搜索失败',
    }
  }
  return post(postConfig)
}

// 获取最近浏览记录
export const getRecentBrowse = () => {
  const getConfig = {
    url: 'crm-fd/api/homepage/findBrowserRecord',
    actionType: GET_RECENT_BROWSE,
    successConfig: {
      // message: 'get recent browse success',
      callback: (payload) => {}
    },
    failConfig: {
      message: 'get recent browse failed'
    },
  }
  return get(getConfig)
}

// 更新首页模块
export const updateHomeModules = (data, callback = () => {}) => {
  const postConfig = {
    url: `${base}/homepage/updateModule`,
    bodyData: data,
    actionType: UPDATE_HOME_MODULES,
    successConfig: {
      message: '更新模块成功',
      callback,
    },
    failConfig: {
      message: '更新模块失败'
    }
  }
  return post(postConfig)
}

// 传递更改后的首页模块数据
export const deliverHomeModules = (modules) => {
  return (dispatch) => {
    dispatch({
      type: GET_HOME_MODULES,
      data: modules,
    })
  }
}



// --------------------------
// Reducers
// --------------------------

// 获取首页业务模块
const homeModules = (previousState = null, action) => {
  if (action.type === GET_HOME_MODULES) {
    return action.data
  } else {
    return previousState
  }
}

// 获取用户的最近浏览记录
const recentBrowseRecords = (previousState = {data: []}, action) => {
  if (action.type === GET_RECENT_BROWSE) {
    return action.data
  } else {
    return previousState
  }
}

// 获取 首页-商机管理 模块数据
const homeBusinessOpportunity = (previousState = {data: []}, action) => {
  if (action.type === GET_BO_DATA) {
    return action.data
  } else {
    return previousState
  }
}

// 获取 首页-客户动态 模块数据
const homeCustomerActivity = (previousState = {data: []}, action) => {
  if (action.type === GET_CA_DATA) {
    return action.data
  } else {
    return previousState
  }
}

// 获取 首页-客户信息 模块数据
const homeCustomerInfo = (previousState = {data: []}, action) => {
  if (action.type === GET_CI_DATA) {
    return action.data
  } else {
    return previousState
  }
}

// 获取 首页-知识库 模块数据
const homeKnowledgeBase = (previousState = {data: []}, action) => {
  if (action.type === GET_KB_DATA) {
    return action.data
  } else {
    return previousState
  }
}

// 获取 首页-营销活动 模块数据
const homeMarketingActivity = (previousState = {data: []}, action) => {
  if (action.type === GET_MA_DATA) {
    return action.data
  } else {
    return previousState
  }
}

// 获取 首页-营销成果 模块数据
const homeMarketingResults = (previousState = {data: []}, action) => {
  if (action.type === GET_MR_DATA) {
    return action.data
  } else {
    return previousState
  }
}

// 获取 首页-工作日程 模块数据
const homeWorkSchedule = (previousState = {data: []}, action) => {
  if (action.type === GET_WS_DATA) {
    return action.data
  } else {
    return previousState
  }
}

// 搜索结果页面 - 客户列表
const customerList = (previousState = {data:[]}, action) => {
  if (action.type === SEARCH) {
    return action.data
  } else {
    return previousState
  }
}



// ---------------------------
// combine and export
// ---------------------------
const home = combineReducers({
  homeModules,
  recentBrowseRecords,
  homeBusinessOpportunity,
  homeCustomerActivity,
  homeCustomerInfo,
  homeKnowledgeBase,
  homeMarketingActivity,
  homeMarketingResults,
  homeWorkSchedule,
  customerList,
})
export default home
