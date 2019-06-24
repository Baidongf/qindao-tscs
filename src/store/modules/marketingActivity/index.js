import { combineReducers } from 'redux'
import { get, post } from 'utils/dataAccess/axios'

const IS_MOCK = 0 ? '/mock' : ''

// ============ actions ============================

const GET_RECEIVE_ACTIVITY_LIST = 'GET_RECEIVE_ACTIVITY_LIST'
const GET_CREATE_ACTIVITY_LIST = 'GET_ACTIVITY_LIST'
const GET_ACT_DETAIL = 'GET_ACT_DETAIL'
const SAVE_ACTIVITY = 'SAVE_ACTIVITY'
const GET_ACT_NUMBER = 'GET_ACT_NUMBER'
const FINISH_ACTIVITY = 'FINISH_ACTIVITY'
const SUSPEND_ACTIVITY = 'SUSPEND_ACTIVITY'
const CONFIRM_ACTIVITY = 'CONFIRM_ACTIVITY'



// ============ dispatch ============================

// 获取“我收到的营销活动”列表
export const getReceiveActivityList = (
  filterObj = {},
  callback = () => { }
) => {
  let bodyData = {
    pageNo: filterObj.pageNo,
    pageSize: filterObj.pageSize,
    status: filterObj.status,
    type: filterObj.type,
    titleOrCode: filterObj.titleOrCode,
  }

  const postConfig = {
    url: `${IS_MOCK}/crm-fd/api/marketingCampaigns/queryExecutor`,
    actionType: GET_RECEIVE_ACTIVITY_LIST,
    bodyData: bodyData,
    successConfig: { callback },
    failConfig: {
      message: '获取活动列表失败'
    }
  }
  return post(postConfig)
}


// 获取“我创建的营销活动”列表
export const getCreateActivityList = (
  filterObj = {},
  callback = () => { }
) => {
  let bodyData = {
    pageNo: filterObj.pageNo,
    pageSize: filterObj.pageSize,
    status: filterObj.status,
    type: filterObj.type,
    titleOrCode: filterObj.titleOrCode,
    institutionIds: filterObj.institutionIds
  }

  const postConfig = {
    url: `${IS_MOCK}/crm-fd/api/marketingCampaigns/queryCreater`,
    actionType: GET_CREATE_ACTIVITY_LIST,
    bodyData: bodyData,
    successConfig: { callback },
    failConfig: {
      message: '获取活动列表失败'
    }
  }
  return post(postConfig)
}


// 获取营销活动详情
export const getActivityDetail = (id, callback = () => { }) => {
  return get({
    url: `${IS_MOCK}/crm-fd/api/marketingCampaigns/details/${id}`,
    actionType: GET_ACT_DETAIL,
    successConfig: { callback },
    failConfig: {
      message: '获取活动详情失败'
    }
  })
}


// 新建活动
export const saveActivity = (activityObj, callback = () => { }) => {
  return post({
    url: `${IS_MOCK}/crm-fd/api/marketingCampaigns/save`,
    bodyData: activityObj,
    actionType: SAVE_ACTIVITY,
    successConfig: {
      message: '新建活动成功',
      callback,
    },
    failConfig: {
      message: '新建活动失败'
    }
  })
}

// 获取活动编号(全局序列值生成器)
export const getActivityNumber = (callback = (data) => { }) => {
  return get({
    url: `${IS_MOCK}/crm-fd/api/sequence/next/market`,
    actionType: GET_ACT_NUMBER,
    successConfig: {
      callback: (data) => {
        callback(data)
      }
    },
    failConfig: {
      message: '获取活动编号失败'
    }
  })
}


// 确认活动
export const confirmActivity = (id, callback) => {
  const postConfig = {
    url: `/crm-fd/api/marketingCampaigns/confirmed/${id}`,
    actionType: CONFIRM_ACTIVITY,
    successConfig: {
      message: '确认成功',
      callback,
    },
    failConfig: {
      message: '确认失败'
    }
  }
  return post(postConfig)
}


// 完成活动
export const finishActivity= (id, callback) => {
  const postConfig = {
    url: `/crm-fd/api/marketingCampaigns/finish/${id}`,
    actionType: FINISH_ACTIVITY,
    successConfig: {
      message: '已完成',
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '完成失败'
    }
  }

  return post(postConfig)
}

// 终止活动
export const  suspendActivity= (id, callback) => {
  const postConfig = {
    url: `/crm-fd/api/marketingCampaigns/termination/${id}`,
    actionType: SUSPEND_ACTIVITY,
    successConfig: {
      message: '中止成功',
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '中止失败'
    }
  }

  return post(postConfig)
}



// ============ reducers =============================

// “我收到的营销活动”列表
const receiveActivityList = (previousState = { data: [] }, action) => {
  if (action.type === GET_RECEIVE_ACTIVITY_LIST) {
    return action.data
  } else {
    return previousState
  }
}

// “我创建的营销活动”列表
const createActivityList = (previousState = { data: [] }, action) => {
  if (action.type === GET_CREATE_ACTIVITY_LIST) {
    return action.data
  } else {
    return previousState
  }
}

// 营销活动详情
const actDetail = (previousState = { data: [] }, action) => {
  if (action.type === GET_ACT_DETAIL) {
    return action.data
  } else {
    return previousState
  }
}

// 通过序列值生成器生成的活动编号
const actNumber = (previousState = { data: [] }, action) => {
  if (action.type === GET_ACT_NUMBER) {
    return action.data
  } else {
    return previousState
  }
}





const marketingActivity = combineReducers({
  receiveActivityList,
  createActivityList,
  actDetail,
  actNumber,
})

export default marketingActivity
