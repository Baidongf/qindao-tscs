// import { hashHistory } from 'react-router'
import { message } from 'antd'
import { combineReducers } from 'redux'
import { get, post } from 'utils/dataAccess/axios'
import {dateFmt} from 'utils/timeFormat'
// ------------------------------------
// Constants
// ------------------------------------
const GET_ORG_TREE='GET_ORG_TREE'
const FIND_CUSTOMER_LIST='FIND_CUSTOMER_LIST'
const GET_REPORT_TYPES='GET_REPORT_TYPES'
const GET_TOP_TEN_LIST='GET_TOP_TEN_LIST'
const GET_SINGLE_LIST='GET_SINGLE_LIST'
// ------------------------------------
// Actions
// ------------------------------------

export const getSingleByOrg = (id,data ,callback) => {
  console.log("getSingleByOrg")
  const postConfig = {
    url: `/crm-fd/api/marketingCampaignsReport/institutionSingleReport/${id}`,
    actionType: GET_SINGLE_LIST,
    bodyData:data,
    successConfig: {
      callback: (payload) => {
        callback&&callback(payload)
      }
    },
  }
  return post(postConfig)
}

export const getTopTenListByOrg = (id,reportDate ,reportKey ,callback) => {
  console.log("getTopTenListByOrg")
  const postConfig = {
    url: `/crm-fd/api/marketingCampaignsReport/institutionTopReport/${id}`,
    actionType: GET_TOP_TEN_LIST,
    bodyData: {
      reportDate:reportDate,
      reportKey:reportKey
    },
    successConfig: {
      callback: (payload) => {
        callback&&callback(payload)
      }
    },
  }
  return post(postConfig)
}

export const allByOrgId = (id,reportDate,callback) => {
  console.log("allByOrgId")
  const postConfig = {
    url: `/crm-fd/api/marketingCampaignsReport/institutionReport/${id}`,
    bodyData: {
      reportDate:reportDate
    },
    successConfig: {
      callback: (payload) => {
        callback&&callback(payload)
      }
    },
  }
  return post(postConfig)
}


export const getSingleByUser = (id,data ,callback) => {
  console.log("getSingleByUser")
  console.log(data)
  const postConfig = {
    url: `/crm-fd/api/marketingCampaignsReport/userSingleReport/${id}`,
    actionType: GET_SINGLE_LIST,
    bodyData:data,
    successConfig: {
      callback: (payload) => {
        callback&&callback(payload)
      }
    },
  }
  return post(postConfig)
}
export const getTopTenListByUser = (id,reportDate ,reportKey ,callback) => {
  console.log("getTopTenListByUser")
  const postConfig = {
    url: `/crm-fd/api//marketingCampaignsReport/userTopReport/${id}`,
    actionType: GET_TOP_TEN_LIST,
    bodyData: {
      reportDate:reportDate,
      reportKey:reportKey
    },
    successConfig: {
      callback: (payload) => {
        callback&&callback(payload)
      }
    },
  }
  return post(postConfig)
}

export const allByUserId = (id,reportDate,callback) => {
  console.log("allByUserId")
  const postConfig = {
    url: `/crm-fd/api/marketingCampaignsReport/userReport/${id}`,
    bodyData: {
      reportDate:reportDate
    },
    successConfig: {
      callback: (payload) => {
        callback&&callback(payload)
      }
    },
  }
  return post(postConfig)
}

// export const getTopTenListByUser = (id,reportDate ,reportKey ,callback) => {
//
//   const postConfig = {
//     url: `/crm-fd/api/marketingCampaignsReport/userTopReport/${id}`,
//     actionType: GET_TOP_TEN_LIST,
//     bodyData: {
//       reportDate:reportDate,
//       reportKey:reportKey
//     },
//     successConfig: {
//       callback: (payload) => {
//         callback&&callback(payload)
//       }
//     },
//   }
//   return post(postConfig)
// }


export const getReportTypes = (data,callback) => {

  const postConfig = {
    url: `/crm-fd/api/marketingCampaignsReport/types`,
    actionType: GET_REPORT_TYPES,
    bodyData: data,
    successConfig: {
      callback: (payload) => {
        callback&&callback(payload)
      }
    },
  }

  return get(postConfig)
}

export const getOrgTree = (data,callback) => {

  const postConfig = {
    url: `/crm-fd/api/auth/institution/tree`,
    actionType: GET_ORG_TREE,
    bodyData: data,
    successConfig: {
      callback: (payload) => {
        callback&&callback(payload)
      }
    },
  }

  return get(postConfig)
}

export const allByCustomerManagerId = (id,reportDate,callback) => {

  const postConfig = {
    url: `/crm-fd/api/marketingCampaignsReport/userReport/${id}`,
    bodyData: {
      reportDate:reportDate
    },
    successConfig: {
      callback: (payload) => {
        callback&&callback(payload)
      }
    },
  }
  return post(postConfig)
}

export const findCustomerManagertList = (id,callback) => {

  const postConfig = {
    url: `/crm-fd/api/user/findManager/${id}`,
    actionType: FIND_CUSTOMER_LIST,
    successConfig: {
      callback: (payload) => {
        callback&&callback(payload)
      }
    },
  }

  return get(postConfig)
}


export function reportTypes (previousState = {}, action) {
  if (action.type === GET_REPORT_TYPES) {
    return action.data || {}
  }  else {
    return previousState
  }
}

export function orgTree (previousState = {}, action) {
  if (action.type === GET_ORG_TREE) {
    return action.data || {}
  }  else {
    return previousState
  }
}

export function customerManagerList (previousState = [], action) {
  if (action.type === FIND_CUSTOMER_LIST) {
    return action.data.data || {}
  }  else {
    return previousState
  }
}


export function topTenList (previousState = {}, action) {
  if (action.type === GET_TOP_TEN_LIST) {
    return action.data || {}
  }  else {
    return previousState
  }
}

export function singleList (previousState = {}, action) {
  if (action.type === GET_SINGLE_LIST) {
    return action.data || {}
  }  else {
    return previousState
  }
}

const loginOut = combineReducers({
  orgTree,
  customerManagerList,
  reportTypes,
  topTenList,
  singleList
})
export default loginOut

