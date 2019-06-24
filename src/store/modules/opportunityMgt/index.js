import { combineReducers } from 'redux'
import { get, post } from 'utils/dataAccess/axios'


// ======================== actions ====================================

// 商机列表相关
const GET_MY_LIST = 'GET_MY_LIST'
const GET_SUBORDINATE_LIST = 'GET_SUBORDINATE_LIST' //获取下属的商机列表
const GET_COLLABORATION_LIST = 'GET_COLLABORATION_LIST' //获取协同商机列表
const GET_COMMON_LIST = 'GET_COMMON_LIST' //获取公共商机
const GET_FOLLOWED_LIST = 'GET_FOLLOWED_LIST' //获取跟进商机列表
const FOLLOW_OPPORTUNITY = 'FOLLOW_OPPORTUNITY' //跟进公共商机

// 关联商机相关
// 动态 - 商机
const GET_DYNAMIC_RELATED_BUSINESS_LIST = 'GET_DYNAMIC_RELATED_BUSINESS_LIST' //获取关联了某动态的商机列表
const RELATE_BUSINESS_WITH_DYNAMIC = 'RELATE_BUSINESS_WITH_DYNAMIC' //关联商机和动态
const UNRELATE_BUSINESS_WITH_DYNAMIC = 'UNRELATE_BUSINESS_WITH_DYNAMIC' //取消关联商机和动态

// 日程 - 商机
const GET_BUSINESS_RELATED_SCHEDULE_LIST = 'GET_BUSINESS_RELATED_SCHEDULE_LIST' //获取关联了某个商机的日程列表
const RELATE_BUSINESS_WITH_SCHEDULE = 'RELATE_BUSINESS_WITH_SCHEDULE' //关联商机和日程
const UNRELATE_BUSINESS_WITH_SCHEDULE = 'UNRELATE_BUSINESS_WITH_SCHEDULE' // 取消关联商机和日程

// 商机详情相关
const GET_OPPORTUNITY_DETAIL = 'GET_OPPORTUNITY_DETAIL' // 商机详情
const CREATE_OPPORTUNITY = 'CREATE_OPPORTUNITY'
const UPDATE_OPPORTUNITY = 'UPDATE_OPPORTUNITY' // 修改商机

// 机构/客户经理数据（下属的商机需要用到）
const GET_USER_OWN_INSTITUTION = 'GET_USER_OWN_INSTITUTION' // 获取用户权限内的机构树
const GET_INSTITUTION_MANAGERS = 'GET_INSTITUTION_MANAGERS' // 获取某一个机构下的客户经理
const GET_ALL_MANAGERS = 'GET_ALL_MANAGERS' // 获取辖内所有的客户经理

// 搜索所有的客户（公司）
const SEARCH_CUSTOMERS = 'SEARCH_CUSTOMERS'

// 跟进商机相关
const GET_FOLLOWED_RECORD_LIST = 'GET_FOLLOWED_RECORD_LIST' // 获取跟进记录列表
const ADD_FOLLOW_RECORD = 'ADD_FOLLOW_RECORD' // 添加跟进记录


// ========================= dispatchers ================================


// 获取我的商机列表(后期是否需要？)
export const getOpportunityList = (filterObj = {}, callback = () => { }) => {
  const bodyData = {
    createTime: filterObj.createTime,
    pageNo: filterObj.pageNo,
    pageSize: filterObj.pageSize,
    status: filterObj.status,
    type: filterObj.type,
    source: filterObj.source,
    nameOrCustomerName: filterObj.nameOrCustomerName,
    customerType: filterObj.customerType
  }

  const postConfig = {
    url: '/crm-fd/api/businessChance/query',
    actionType: GET_MY_LIST,
    bodyData,
    successConfig: { callback },
    failConfig: { message: '获取我的商机失败' },
  }

  return post(postConfig)
}


// 获取下属的商机列表
export const getSubordinateList = (filterObj = {}, callback = () => { }) => {
  const bodyData = {
    updateTime: filterObj.updateTime,
    pageNo: filterObj.pageNo,
    pageSize: filterObj.pageSize,
    status: filterObj.status,
    type: filterObj.type,
    source: filterObj.source,
    nameOrCustomerName: filterObj.nameOrCustomerName,
    customerType: filterObj.customerType,
    followUserId: filterObj.followUserId,
  }

  const postConfig = {
    url: '/crm-fd/api/businessChance/queryBranch',
    actionType: GET_SUBORDINATE_LIST,
    bodyData,
    successConfig: { callback },
    failConfig: { message: '获取下属商机失败' },
  }

  return post(postConfig)
}


// 获取协同商机列表
export const getCollaborationList = (filterObj = {}, callback = () => { }) => {
  const bodyData = {
    updateTime: filterObj.updateTime,
    pageNo: filterObj.pageNo,
    pageSize: filterObj.pageSize,
    status: filterObj.status,
    type: filterObj.type,
    source: filterObj.source,
    nameOrCustomerName: filterObj.nameOrCustomerName,
    customerType: filterObj.customerType
  }

  const postConfig = {
    url: '/crm-fd/api/businessChance/querySynergy',
    actionType: GET_COLLABORATION_LIST,
    bodyData,
    successConfig: { callback },
    failConfig: { message: '获取协同商机失败' },
  }

  return post(postConfig)
}


// 获取公共商机列表
export const getCommonList = (filterObj = {}, callback = () => { }) => {
  const bodyData = {
    pageNo: filterObj.pageNo,
    pageSize: filterObj.pageSize,
    nameOrCustomerName: filterObj.nameOrCustomerName,
    customerType: filterObj.customerType,
    type: filterObj.type,
  }

  const postConfig = {
    url: '/crm-fd/api/businessChance/queryCommon',
    actionType: GET_COMMON_LIST,
    bodyData,
    successConfig: { callback },
    failConfig: { message: '获取公共商机失败' },
  }

  return post(postConfig)
}


// 获取跟进的商机列表
export const getFollowedList = (filterObj = {}, callback = () => { }) => {
  const bodyData = {
    updateTime: filterObj.updateTime,
    pageNo: filterObj.pageNo,
    pageSize: filterObj.pageSize,
    status: filterObj.status,
    type: filterObj.type,
    source: filterObj.source,
    nameOrCustomerName: filterObj.nameOrCustomerName,
    customerType: filterObj.customerType
  }

  const postConfig = {
    url: '/crm-fd/api/businessChance/query',
    actionType: GET_FOLLOWED_LIST,
    bodyData,
    successConfig: { callback },
    failConfig: { message: '获取跟进商机失败' },
  }

  return post(postConfig)
}

// 获取已关联某个动态的商机列表
export const getDynamicRelatedBusinessList = (dynamicKey) => {
  const config = {
    url: `/crm-fd/api/customerDynamicBusiness/query/${dynamicKey}`,
    actionType: GET_DYNAMIC_RELATED_BUSINESS_LIST,
    successConfig: {},
    failConfig: {
      message: '获取商机列表失败'
    }
  }
  return get(config)
}

// 关联商机和动态
export const relateBusinessWithDynamic = (bodyData, callback = () => { }) => {
  const postConfig = {
    url: '/crm-fd/api/customerDynamicBusiness/join',
    actionType: RELATE_BUSINESS_WITH_DYNAMIC,
    bodyData,
    successConfig: {
      message: '关联商机成功',
      callback
    },
    failConfig: {
      message: '关联商机失败'
    }
  }
  return post(postConfig)
}

// 取消关联商机和动态
export const unRelateBusinessWithDynamic = (bodyData, callback = () => { }) => {
  const postConfig = {
    url: '/crm-fd/api/customerDynamicBusiness/unJoin',
    actionType: UNRELATE_BUSINESS_WITH_DYNAMIC,
    bodyData,
    successConfig: {
      message: '取消关联商机成功',
      callback
    },
    failConfig: {
      message: '取消关联商机失败'
    }
  }
  return post(postConfig)
}


// 获取关联了某个商机的日程列表
export const getBusinessRelatedScheduleList = (businessId) => {
  const config = {
    url: `/crm-fd/api/businessChanceWorkSchedule/query/${businessId}`,
    actionType: GET_BUSINESS_RELATED_SCHEDULE_LIST,
    successConfig: {},
    failConfig: {
      message: '获取已关联日程列表失败'
    }
  }
  return get(config)
}


// 关联商机和日程
export const relateBusinessWithSchedule = (bodyData, callback = () => { }) => {
  const postConfig = {
    url: '/crm-fd/api/businessChanceWorkSchedule/join',
    actionType: RELATE_BUSINESS_WITH_SCHEDULE,
    bodyData,
    successConfig: {
      message: '关联日程成功',
      callback
    },
    failConfig: {
      message: '关联商机失败'
    }
  }
  return post(postConfig)
}

// 取消关联商机和日程
export const unRelateBusinessWithSchedule = (bodyData, callback = () => { }) => {
  const postConfig = {
    url: '/crm-fd/api/businessChanceWorkSchedule/unjoin',
    actionType: UNRELATE_BUSINESS_WITH_SCHEDULE,
    bodyData,
    successConfig: {
      message: '取消关联日程成功',
      callback
    },
    failConfig: {
      message: '取消关联日程失败'
    }
  }
  return post(postConfig)
}


// 商机详情
export const getOpportunityDetail = (id) => {
  return get({
    url: `/crm-fd/api/businessChance/details/${id}`,
    actionType: GET_OPPORTUNITY_DETAIL,
    successConfig: {},
    failConfig: {
      message: '获取商机详情失败'
    }
  })
}


// 创建商机
export const createOpportunity = (bodyData, callback = () => {}) => {
  const postConfig = {
    url: '/crm-fd/api/businessChance/save',
    actionType: CREATE_OPPORTUNITY,
    bodyData,
    successConfig: {
      message: '添加商机成功',
      callback
    },
    failConfig: {
      message: '添加商机失败'
    }
  }
  return post(postConfig)
}

// 修改商机
export const updateOpportunity = (bodyData, callback = () => {}) => {
  const postConfig = {
    url: '/crm-fd/api/businessChance/update',
    actionType: UPDATE_OPPORTUNITY,
    bodyData,
    successConfig: {
      message: '修改商机成功',
      callback
    },
    failConfig: {
      message: '修改商机失败'
    }
  }
  return post(postConfig)
}
//跟进公共商机
export const followOpportunity = (id, callback = () => {}) => {
  const postConfig = {
    url: `/crm-fd/api/businessChance/followUp/${id}`,
    actionType: FOLLOW_OPPORTUNITY,
    successConfig: {
      callback
    },
    failConfig: {
      message: '跟进商机失败'
    }
  }
  return post(postConfig)
}
// 获取用户权限内的机构树
export const getUserOwnInstitutions = () => {
  return get({
    url: '/crm-fd/api/auth/institution/managerTree',
    actionType: GET_USER_OWN_INSTITUTION,
    successConfig: {},
    failConfig: {
      message: '获取权限内机构树失败'
    }
  })
}


// 获取某一机构下的所有客户经理
export const getInstitutionManagers = (institutionId,callback=()=>{}) => {
  return get({
    url: `/crm-fd/api/user/findManager/${institutionId}`,
    actionType: GET_INSTITUTION_MANAGERS,
    successConfig: {callback},
    failConfig: {
      message: '获取客户经理失败'
    }
  })
}


// 获取当前用户辖内的所有客户经理
export const getAllManagers = () => {
  return get({
    url: 'crm-fd/api/user/findCurrentManager',
    actionType: GET_ALL_MANAGERS,
    successConfig: {},
    failConfig: {
      message: '获取客户经理失败'
    }
  })
}

// 搜索客户（公司）
export const searchCustomers = (customerName) => {
  return post({
    url: 'crm-fd/api/customer/search',
    actionType: SEARCH_CUSTOMERS,
    bodyData: {
      keyWord: customerName,
      pageSize: 20,
    },
    successConfig: {},
    failConfig: {
      message: '搜索客户失败'
    }
  })
}


// 获取某个商机的跟进记录
export const getFollowedRecordList = (businessId) => {
  return post({
    url: `/crm-fd/api/businessChanceFollowRecord/query/${businessId}`,
    actionType: GET_FOLLOWED_RECORD_LIST,
    successConfig: {},
    failConfig: {
      message: '获取跟进记录失败'
    }
  })
}


// 添加跟进记录
export const addFollowRecord = (bodyData, callback = () => {}) => {
  return post({
    url: '/crm-fd/api/businessChanceFollowRecord/save',
    bodyData,
    actionType: ADD_FOLLOW_RECORD,
    successConfig: {
      message: '添加成功',
      callback,
    },
    failConfig: {
      message: '添加失败'
    }
  })
}



// ============================ reducers ==============================


// 我的商机列表
const opportunityList = (previousState = { data: [] }, action) => {
  if (action.type === GET_MY_LIST) {
    return action.data
  } else {
    return previousState
  }
}

// 下属商机列表
const subordinateList = (previousState = { data: [] }, action) => {
  if (action.type === GET_SUBORDINATE_LIST) {
    return action.data
  } else {
    return previousState
  }
}

// 协同商机列表
const collaborationList = (previousState = { data: [] }, action) => {
  if (action.type === GET_COLLABORATION_LIST) {
    return action.data
  } else {
    return previousState
  }
}

// 公共商机列表
const commonList = (previousState = { data: [] }, action) => {
  if (action.type === GET_COMMON_LIST) {
    return action.data
  } else {
    return previousState
  }
}

// 跟进商机列表
const followedList = (previousState = { data: [] }, action) => {
  if (action.type === GET_FOLLOWED_LIST) {
    return action.data
  } else {
    return previousState
  }
}

// 已关联某个动态的商机列表
const dynamicRelatedBusinessList = (previousState = { data: [] }, action) => {
  if (action.type === GET_DYNAMIC_RELATED_BUSINESS_LIST) {
    return action.data
  } else {
    return previousState
  }
}

// 已关联某个商机的日程列表
const businessRelatedScheduleList = (previousState = { data: [] }, action) => {
  if (action.type === GET_BUSINESS_RELATED_SCHEDULE_LIST) {
    return action.data
  } else {
    return previousState
  }
}


// 商机详情
const opportunityDetail = (previousState = { data: [] }, action) => {
  if (action.type === GET_OPPORTUNITY_DETAIL) {
    return action.data
  } else {
    return previousState
  }
}


// 用户权限内的机构树
const userOwnInstitutions = (previousState = { data: [] }, action) => {
  if (action.type === GET_USER_OWN_INSTITUTION) {
    return action.data
  } else {
    return previousState
  }
}

// 某一机构下的所有客户经理
const institutionManagers = (previousState = { data: [] }, action) => {
  if (action.type === GET_INSTITUTION_MANAGERS) {
    return action.data
  } else {
    return previousState
  }
}

// 辖内全部的客户经理
const allManagers = (previousState = { data: [] }, action) => {
  if (action.type === GET_ALL_MANAGERS) {
    return action.data
  } else {
    return previousState
  }
}

// 搜索得到的客户(公司)列表
const searchedCustomers = (previousState = { data: [] }, action) => {
  if (action.type === SEARCH_CUSTOMERS) {
    return action.data
  } else {
    return previousState
  }
}

// 商机的跟进记录
const followedRecordList = (previousState = { data: [] }, action) => {
  if (action.type === GET_FOLLOWED_RECORD_LIST) {
    return action.data
  } else {
    return previousState
  }
}



const opportunityMgt = combineReducers({
  opportunityList,
  subordinateList,
  collaborationList,
  commonList,
  followedList,
  dynamicRelatedBusinessList,
  businessRelatedScheduleList,
  opportunityDetail,
  userOwnInstitutions,
  institutionManagers,
  followedRecordList,
  allManagers,
  searchedCustomers,
})
export default opportunityMgt
