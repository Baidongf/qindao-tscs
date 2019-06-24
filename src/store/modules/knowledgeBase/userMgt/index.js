// import { hashHistory } from 'react-router'
import { message } from 'antd'
import { combineReducers } from 'redux'
import { get, post } from 'utils/dataAccess/axios'


const IS_MOCK =  0 ? '/mock': ''
const GET_USER_LIST = 'GET_USER_LIST'
const GET_USER_COUNT = 'GET_USER_COUNT'
const DELETE_USER = 'DELETE_USER'
const GET_USER_DETAIL = 'GET_USER_DETAIL'
const SAVE_USER = 'SAVE_USER'
const UPDATE_USER = 'UPDATE_USER'
const UPDATE_USER_STATUS = 'UPDATE_USER_STATUS'
const RESET_PASSWORD = 'RESET_PASSWORD'


export const getUserList = (filterObj = {}) => {
  let bodyData = {
    orgId: filterObj.orgId,
    nameOrNo: filterObj.nameOrNo,
    pageNo: filterObj.pageNo,
    pageSize: filterObj.pageSize
  }

  const postConfig = {
    url:  `${IS_MOCK}/crm-fd/api/user/queryUser`,
    actionType: GET_USER_LIST,
    bodyData: bodyData,
    successConfig: {
      callback: (payload) => {

      }
    },
    failConfig: {
      message: '获取用户列表失败'
    }
  }
  return post(postConfig)
}

export function userList (previousState = {data: []}, action) {
  if (action.type === GET_USER_LIST) {
    return action.data
  } else {
    return previousState
  }
}

export const deleteUser = (id) =>{
  return get({
    url: `${IS_MOCK}/crm-fd/api/user/delete?id=${id}`,
    actionType: DELETE_USER,
    successConfig: {
      message: '删除用户成功',
      callback: (data) =>{

      }
    },
    failConfig: {
      message: '删除用户失败'
    }
  })
}

export const getUserDetail = (id) =>{
  return get({
    url: `${IS_MOCK}/crm-fd/api/user/details/${id}`,
    actionType: GET_USER_DETAIL,
    successConfig: {
      callback: (data) =>{

      }
    },
    failConfig: {
      message: '获取用户失败'
    }
  })
}

export const saveUser = (userObj) =>{
  return post({
    url: `${IS_MOCK}/crm-fd/api/user/save`,
    bodyData: userObj,
    actionType: SAVE_USER,
    successConfig: {
      message: '新增用户成功',
      callback: (data) =>{

      }
    },
    failConfig: {
      message: '新建用户失败'
    }
  })
}

const updateUserURL = `${IS_MOCK}/crm-fd/api/user/update`
export const updateUser = (userObj) =>{
  return post({
    url: updateUserURL,
    bodyData: userObj,
    actionType: UPDATE_USER,
    successConfig: {
      message: '更新用户成功'
    },
    failConfig: {
      message: '更新用户失败'
    }
  })
}

export const updateUserStatus = (userObj, successCallback) =>{
  return post({
    url: updateUserURL,
    bodyData: userObj,
    actionType: UPDATE_USER_STATUS,
    successConfig: {
      message: '更新用户状态成功',
      callback: successCallback
    },
    failConfig: {
      message: '更新用户状态失败'
    }
  })
}

export const userDetail = (previousState = {}, action) => {
  if (action.type === GET_USER_DETAIL) {
    return action.data
  } else {
    return previousState
  }
}

export const resetPassword = (id) => {
  return get({
    url: `${IS_MOCK}/crm-fd/api/user/resetPassword?id=${id}`,
    actionType: RESET_PASSWORD,
    successConfig: {
      message: '重置密码成功',
      callback: (data) =>{
      }
    },
    failConfig: {
      message: '重置密码失败'
    }
  })
}

const userMgt = combineReducers({
  userList,
  userDetail
})
export default userMgt
