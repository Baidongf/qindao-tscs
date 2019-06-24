// import { hashHistory } from 'react-router'
import { combineReducers } from 'redux'
import { get, post, fetchData } from 'utils/dataAccess/axios'
import { func } from 'prop-types';


const IS_MOCK =  1 ? '/mock': ''
const GET_ACCOUNT_LIST = 'GET_ACCOUNT_LIST'
const DISTRIBUTE_ACCOUNT = 'DISTRIBUTE_ACCOUNT'
const GET_MANAGER_BY_ACCOUNT = 'GET_MANAGER_BY_ACCOUNT'
const GET_INSTITUTION_ACCOUNT_LIST = 'GET_INSTITUTION_ACCOUNT_LIST'
const GET_MY_ACCOUNT_LIST = 'GET_MY_ACCOUNT_LIST'

const GET_ALL_MANAGERS = 'GET_ALL_MANAGERS' // 获取辖内所有的客户经理



// ----------------- dispatcher ------------------------

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

export const getAccountList = (filterObj = {}) => {
  const postConfig = {
    url:  `/crm-fd/api/customer/searchAccount`,
    actionType: GET_ACCOUNT_LIST,
    bodyData: filterObj,
    successConfig: { },
    failConfig: {
      message: '获取账户列表失败'
    }
  }
  return post(postConfig)
}

// 机构账户列表
export const getInstitutionAccountList = (filterObj = {}) => {
  const postConfig = {
    url:  `/crm-fd/api/customer/institutionAccount`,
    actionType: GET_INSTITUTION_ACCOUNT_LIST,
    bodyData: filterObj,
    successConfig: { },
    failConfig: {
      message: '获取机构账户列表失败'
    }
  }
  return post(postConfig)
}

// 我的账户列表
export const getMyAccountList = (filterObj = {}) => {
  const postConfig = {
    url:  `/crm-fd/api/customer/userAccount`,
    actionType: GET_MY_ACCOUNT_LIST,
    bodyData: filterObj,
    successConfig: { },
    failConfig: {
      message: '获取我的账户列表失败'
    }
  }
  return post(postConfig)
}
// 获取账户的客户经理allocationCustomer/findAccount/
export function getManagerByAccount(account, data, callback = () => {}) {
  return get({
    url: `/crm-fd/api/allocationCustomer/findAccount/${account}`,
    actionType: GET_MANAGER_BY_ACCOUNT,
    bodyData: data,
    successConfig: {
      callback
    },
    failConfig: {
      message: '获取账户的客户经理失败'
    }
  })

}
// 账户分配
export function distributeAccount(account, data, callback = () => {}) {
  return post({
    url: `/crm-fd/api/allocationCustomer/updateAccount/${account}`,
    actionType: DISTRIBUTE_ACCOUNT,
    bodyData: data,
    successConfig: {
      callback
    },
    failConfig: {
      message: '分配账户失败'
    }
  })
}


// -------------------------- reducers --------------------------

export function managerByAccount(preState = {}, action){
  if(action.type === GET_MANAGER_BY_ACCOUNT){
    return action.data
  } else {
    return preState
  }
}

export function accountList (previousState = {data: []}, action) {
  if (action.type === GET_ACCOUNT_LIST) {
    return action.data
  } else {
    return previousState
  }
}

const institutionAccountList = (previousState = {data: []}, action) => {
  if (action.type === GET_INSTITUTION_ACCOUNT_LIST) {
    return action.data
  } else {
    return previousState
  }
}

const myAccountList = (previousState = {data: []}, action) => {
  if (action.type === GET_MY_ACCOUNT_LIST) {
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



const accountMgt = combineReducers({
  accountList,
  institutionAccountList,
  myAccountList,
  allManagers,
  managerByAccount,
})
export default accountMgt
