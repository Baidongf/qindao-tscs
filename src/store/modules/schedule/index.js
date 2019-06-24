import {get, post} from 'utils/dataAccess/axios'
import {combineReducers} from 'redux'

const GET_SCHEDULE_LIST = 'GET_SCHEDULE_LIST'
const GET_DYNAMIC_RELATED_SCHEDULE_LIST = 'GET_DYNAMIC_RELATED_SCHEDULE_LIST' //获取已关联某个动态的日程列表
const GET_BUSINESS_RELATED_SCHEDULE_LIST = 'GET_BUSINESS_RELATED_SCHEDULE_LIST' // 获取已关联某个商机的日程列表
const GET_TITLE_PARAMS = 'GET_TITLE_PARAMS'
const GET_CREATE_USER = 'GET_CREATE_USER'
const SAVE_SCHEDULE='SAVE_SCHEDULE'
const UPDATE_SCHEDULE='UPDATE_SCHEDULE'
const GET_SCHEDULE_DETAIL='GET_SCHEDULE_DETAIL'
const GET_OPPORTUNITY_LIST='GET_OPPORTUNITY_LIST'
const GET_CUSTOMER_LIST='GET_CUSTOMER_LIST'

const RELATE_SCHEDULE_AND_DYNAMIC = 'RELATE_SCHEDULE_AND_DYNAMIC'
const RELATE_SCHEDULE_AND_BUSINESS = 'RELATE_SCHEDULE_AND_BUSINESS'
const UNRELATE_SCHEDULE_AND_DYNAMIC = 'UNRELATE_SCHEDULE_AND_DYNAMIC'
const UNRELATE_SCHEDULE_AND_BUSINESS = 'UNRELATE_SCHEDULE_AND_BUSINESS'

export const getCustomerList = (filterObj, callback) => {
  const postConfig = {
    url: `/crm-fd/api/customer/search`,
    bodyData: filterObj,
    actionType: GET_CUSTOMER_LIST,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '获取商机列表失败'
    }
  }
  return post(postConfig)
}

export const getOpportunityList = (filterObj, callback) => {

  const postConfig = {
    url: `/crm-fd/api/businessChance/query`,
    bodyData: filterObj,
    actionType: GET_OPPORTUNITY_LIST,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '获取商机列表失败'
    }
  }
  return post(postConfig)
}

export const deleteSchedule = (filterObj, callback) => {
  const postConfig = {
    url: `/crm-fd/api/workSchedule/delete`,
    bodyData: filterObj,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '删除日程失败'
    }
  }
  return post(postConfig)
}

export const getScheduleDetail = (id, callback) => {

  const postConfig = {
    url: `/crm-fd/api/workSchedule/details/${id}`,
    actionType: GET_SCHEDULE_DETAIL,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '获取日程详情失败'
    }
  }

  return get(postConfig)
}

export const saveSchedule = (filterObj = {}, callback) => {

  const postConfig = {
    url: `/crm-fd/api/workSchedule/save`,
    actionType: SAVE_SCHEDULE,
    bodyData: filterObj,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '新建日程失败'
    }
  }

  return post(postConfig)
}

export const updateSchedule = (filterObj = {}, callback) => {

  const postConfig = {
    url: `/crm-fd/api/workSchedule/update`,
    actionType: UPDATE_SCHEDULE,
    bodyData: filterObj,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '更新日程失败'
    }
  }

  return post(postConfig)
}

export const getTitleParams = (filterObj = {}, callback, failCallBack) => {

  const postConfig = {
    url: `/crm-fd/api/para/query`,
    actionType: GET_TITLE_PARAMS,
    bodyData: filterObj,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '获取主题失败',
      callback: () => {
        failCallBack && failCallBack()
      }
    }
  }

  return post(postConfig)
}

export const getScheduleList = (filterObj = {}, callback) => {
  const postConfig = {
    url: `/crm-fd/api/workSchedule/queryByRelate`,
    actionType: GET_SCHEDULE_LIST,
    bodyData: filterObj,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '获取日程列表失败'
    }
  }
  return post(postConfig)
}

export const getScheduleListByTime = (date, callback) => {
  const postConfig = {
    url: `/crm-fd/api/workSchedule/queryByClick/${date}`,
    actionType: GET_SCHEDULE_LIST,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '获取日程列表失败'
    }
  }

  return get(postConfig)
}

// 获取已关联某条客户动态的日程列表
export const getDynamicRelatedScheduleList = (dynamicKey, callback) => {
  const config = {
    url: `/crm-fd/api/customerDynamicWorkSchedule/query/${dynamicKey}`,
    actionType: GET_DYNAMIC_RELATED_SCHEDULE_LIST,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '获取日程列表失败'
    }
  }
  return get(config)
}

// 获取已关联某条商机的日程列表
export const getBusinessRelatedScheduleList = (businessChanceId, callback) => {
  const config = {
    url: `/crm-fd/api/businessChanceWorkSchedule/query/${businessChanceId}`,
    actionType: GET_BUSINESS_RELATED_SCHEDULE_LIST,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '获取日程列表失败'
    }
  }
  return get(config)
}

export const getCreateUser = (name,callback) => {

  const postConfig = {
    url: `/crm-fd/api/user/queryUser`,
    actionType: GET_CREATE_USER,
    bodyData: {
      "nameOrNo": name,
      "pageNo": 1,
      "pageSize": 100000
    },
    successConfig: {
      callback: (payload) => {
        callback&&callback(payload)
      }
    },
    failConfig: {
      message: '获取项目列表失败'
    }
  }

  return post(postConfig)
}

// 关联日程和客户动态
export const relateScheduleAndDynamic = (bodyData, callback) => {
  const config = {
    url: '/crm-fd/api/customerDynamicWorkSchedule/join',
    actionType: RELATE_SCHEDULE_AND_DYNAMIC,
    bodyData,
    successConfig: {
      message: '关联日程成功',
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '关联日程失败'
    }
  }
  return post(config)
}

// 取消关联日程和客户动态
export const unRelateScheduleAndDynamic = (bodyData, callback) => {
  const config = {
    url: '/crm-fd/api/customerDynamicWorkSchedule/unJoin',
    actionType: UNRELATE_SCHEDULE_AND_DYNAMIC,
    bodyData,
    successConfig: {
      message: '取消关联日程成功',
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '取消关联日程失败'
    }
  }
  return post(config)
}

// 关联日程和商机
export const relateScheduleAndBusiness = (bodyData, callback) => {
  const config = {
    url: '/crm-fd/api/businessChanceWorkSchedule/join',
    actionType: RELATE_SCHEDULE_AND_BUSINESS,
    bodyData,
    successConfig: {
      message: '关联日程成功',
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '关联日程失败'
    }
  }
  return post(config)
}

// 取消关联日程和商机
export const unRelateScheduleAndBusiness = (bodyData, callback) => {
  const config = {
    url: '/crm-fd/api/businessChanceWorkSchedule/unJoin',
    actionType: UNRELATE_SCHEDULE_AND_BUSINESS,
    bodyData,
    successConfig: {
      message: '取消关联日程成功',
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '取消关联日程失败'
    }
  }
  return post(config)
}



export function scheduleDetail(previousState = {data: {}}, action) {
  if (action.type === GET_SCHEDULE_DETAIL) {
    return action.data
  } else {
    return previousState
  }
}

export function titleParams(previousState = {data: []}, action) {
  if (action.type === GET_TITLE_PARAMS) {
    return action.data
  } else {
    return previousState
  }
}

export function scheduleList(previousState = {data: []}, action) {
  if (action.type === GET_SCHEDULE_LIST) {
    return action.data
  } else {
    return previousState
  }
}

const dynamicRelatedScheduleList = (previousState = {data: []}, action) => {
  if (action.type === GET_DYNAMIC_RELATED_SCHEDULE_LIST) {
    return action.data
  } else {
    return previousState
  }
}

const businessRelatedScheduleList = (previousState = {data: []}, action) => {
  if (action.type === GET_BUSINESS_RELATED_SCHEDULE_LIST) {
    return action.data
  } else {
    return previousState
  }
}

export function createUser(previousState = {data: []}, action) {
  if (action.type === GET_CREATE_USER) {
    return action.data
  } else {
    return previousState
  }
}

export function opportunityList(previousState = {data: []}, action) {
  if (action.type === GET_OPPORTUNITY_LIST) {
    return action.data
  } else {
    return previousState
  }
}

export function customerList(previousState = {data: []}, action) {
  if (action.type === GET_CUSTOMER_LIST) {
    return action.data
  } else {
    return previousState
  }
}


const schedule = combineReducers({
  scheduleList,
  dynamicRelatedScheduleList,
  businessRelatedScheduleList,
  titleParams,
  createUser,
  scheduleDetail,
  opportunityList,
  customerList
})
export default schedule
