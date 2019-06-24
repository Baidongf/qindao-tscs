import {get, post} from 'utils/dataAccess/axios'
import {combineReducers} from 'redux'
import {makeUrlString} from 'utils/index'
import {getCookie} from 'utils/cookie.js'
import axios from 'axios';
// import { getLoginUrl } from '../loginOut';
const UPDATE_PASSWORD = 'UPDATE_PASSWORD'
const GET_LOGIN_USER_INFO = 'GET_LOGIN_USER_INFO'
const GET_LOGIN_ROLE_INFO = 'GET_LOGIN_ROLE_INFO'
const GET_LOGIN_RESOURCE_INFO = 'GET_LOGIN_RESOURCE_INFO'
const GET_LOGIN_All_RESOURCE_INFO = 'GET_LOGIN_All_RESOURCE_INFO'
const GET_LOGIN_URL = 'GET_LOGIN_URL'
const SET_ROLE = 'SET_ROLE'
const SELECT_ROLE = 'SELECT_ROLE'
const QUERY_USER_LIST = 'QUERY_USER_LIST'
const SET_PANEL_LIST = 'SET_PANEL_LIST'
const GET_USER_PERMISSION = 'GET_USER_PERMISSION'
const GET_MESSAGE_COUNT = 'GET_MESSAGE_COUNT'
const GET_HEADER_MESSAGE = 'GET_HEADER_MESSAGE'
const GET_BATCH_TIME = 'GET_BATCH_TIME'

const READ_ALL_MESSAGES = 'READ_ALL_MESSAGES'
const EMPTY_UNREAD_MESSAGES = 'EMPTY_UNREAD_MESSAGE'


// 获取数据日期
export function getBatchTime() {
  return post({
    url: '/crm-fd/api/homepage/lastBatchTime',
    actionType: GET_BATCH_TIME,
    failConfig: {
      message: '获取数据日期失败'
    }
  })
}

// 数据日期
export function batchTime(previousState = {}, action) {
  if (action.type === GET_BATCH_TIME) {
    return action.data
  } else {
    return previousState
  }
}


/**
 * @desc 更新密码
 *
 */
export function updatePassword(oldPassword, newPassword) {
  let url = makeUrlString('api/account/password/edit', {
    oldPassword: oldPassword,
    newPassword: newPassword,
  })
  let passwords = {
    oldPassword: oldPassword,
    newPassword: newPassword
  }
  let successTips = '修改密码成功'
  let failTips = '修改密码失败'

  return post(url, passwords, UPDATE_PASSWORD, 'data', {}, successTips, failTips)
}

export function getLoginUserInfo(callback = () => {
}) {
  return get({
    url: '/crm-fd/api/auth/info',
    actionType: GET_LOGIN_USER_INFO,
    successConfig: {
      callback,
    },
    failConfig: {
      message: '获取用户数据失败'
    }
  })
}


export function loginUserInfo(previousState = {}, action) {
  if (action.type === GET_LOGIN_USER_INFO) {

    // userId, userName
    const userId = action.data.id
    const userName = action.data.name

    // 是否是客户经理？ 1是 0不是
    const isCustomerManager = action.data.isCustomerManager

    // 登录用户的所在机构层级 1总行 2/3一二级机构
    const institutionLevel = action.data.institutionLevel

    const institutionId = action.data.institutionId

    localStorage.setItem('USER_ID', userId)
    localStorage.setItem('USER_NAME', userName)
    localStorage.setItem('IS_CUSTOMER_MANAGER', isCustomerManager)
    localStorage.setItem('INSTITUTION_LEVEL', institutionLevel)
    localStorage.setItem('INSTITUTION_ID', institutionId)

    return action.data
  } else {
    return previousState
  }
}


export function getLoginRoleInfo(callback = () => {
}) {
  return get({
    url: '/gap/api/login/getLoginUserRoleList',
    actionType: GET_LOGIN_ROLE_INFO,
    successConfig: {
      callback,
    },
    failConfig: {
      message: '获取用户数据失败'
    }
  })
}

export function loginRoleInfo(previousState = {data: []}, action) {
  if (action.type === GET_LOGIN_ROLE_INFO) {
    return action.data
  } else {
    return previousState
  }
}

export function getLoginResourceInfo(roleCode) {
  return get({
    url: `/gap/api/login/findRootResourcesByCode?roleCode=${roleCode}`,
    actionType: GET_LOGIN_RESOURCE_INFO,
    successConfig: {},
    failConfig: {
      message: '获取用户数据失败'
    }
  })
}

export function loginResourceInfo(previousState = {data: []}, action) {
  if (action.type === GET_LOGIN_RESOURCE_INFO) {
    return action.data
  } else {
    return previousState
  }
}

export function getLoginAllResourceInfo() {
  let role = JSON.parse(getCookie('role'))
  return get({
    url: `/gap/api/login/queryAllResourcesByCode?roleCode=${role.code}`,
    actionType: GET_LOGIN_All_RESOURCE_INFO,
    successConfig: {},
    failConfig: {
      message: '获取用户数据失败'
    }
  })
}

export function loginAllResourceInfo(previousState = {data: [], isInit: true}, action) {
  if (action.type === GET_LOGIN_All_RESOURCE_INFO) {
    /**
     * todo
     * 找到一个合适的地方去设置localStorage
     */
    window.localStorage.setItem('resource', JSON.stringify(action.data))
    action.data.isInit = false
    return action.data
  } else {
    return previousState
  }
}

export const getLoginUrl = () => {
  return get({
    url: '/gap/api/login/doLogin',
    actionType: GET_LOGIN_URL
  })
}

export function loginUrl(previousState = {type: '', url: ''}, action) {
  if (action.type === GET_LOGIN_URL) {
    return action.data
  } else {
    return previousState
  }
}

export const setRole = (role) => {
  return (dispatch) => {
    dispatch({
      type: SET_ROLE,
      data: role
    })
  }
}

/**
 * todo
 * 太繁杂了，后续合并
 */
export const switchRole = (role) => {
  const myPromise = () => {
    return axios({
      url: `/gap/api/login/switchLoginUserRole?code=${role.code}`,
      method: 'get',
    })
  }
  return myPromise
}

export function currentRole(previousState = {}, action) {
  if (action.type === SET_ROLE) {
    return action.data
  } else {
    return previousState
  }
}


/**
 * 测试接口 start
 */

export const queryUserList = () => {
  return get({
    url: `/gap/api/login/queryUserList`,
    actionType: QUERY_USER_LIST,
    successConfig: {},
    failConfig: {
      message: '获取用户数据失败'
    }
  })
}

export function userList(previousState = {data: []}, action) {
  if (action.type === QUERY_USER_LIST) {
    return action.data
  } else {
    return previousState
  }
}

export const switchUser = (id) => {
  return get({
    url: `/gap/api/login/switchLoginUser?id=${id}`,
    actionType: GET_LOGIN_USER_INFO,
    successConfig: {},
    failConfig: {
      message: '获取用户数据失败'
    }
  })
}


/**
 * 测试接口 end
 */


export const setPanelList = (arr) => {
  return (dispatch) => {
    dispatch({
      type: SET_PANEL_LIST,
      data: arr
    })
  }
}

export function panelList(previousState = [], action) {
  if (action.type === SET_PANEL_LIST) {
    return action.data
  } else {
    return previousState
  }
}

export function getUserPermission() {
  return get({
    url: makeUrlString('/crm-fd/api/auth/findPermissions', {
      type: 'pc'
    }),
    actionType: GET_USER_PERMISSION,
    successConfig: {
      callback: (payload) => {
        window.localStorage.setItem('_permission', JSON.stringify(payload.data))
      }
    },
    failConfig: {
      // message: '获取用户权限数据失败'
    }
  })
}

// 用户选择角色(接口返回的是角色的权限)
export function selectRole(roleId, callback = () => {
}) {
  return post({
    url: makeUrlString('/crm-fd/api/auth/changeRole', {
      type: 'pc',
      roleId,
    }),
    actionType: SELECT_ROLE,
    successConfig: {
      callback
    },
    failConfig: {
      message: `选择角色失败，roleId=${roleId}`
    }
  })
}

export function userPermission(previousState = {data: []}, action) {
  if (
    action.type === GET_USER_PERMISSION ||
    action.type === SELECT_ROLE
  ) {
    return action.data
  }
  return previousState
}

export function getMessageCount() { //获取未读消息总数
  return get({
    url: '/crm-fd/api/message/queryUnReadCount',
    actionType: GET_MESSAGE_COUNT,
    keepPayload: true,
    successConfig: {},
    failConfig: {
      message: '获取消息数失败'
    }
  })
}

export function emptyUnreadMessages() {
  // 清空未读消息后调用
  return (dispatch) => {
    dispatch({
      type: EMPTY_UNREAD_MESSAGES,
      data: 0,
    })
  }
}

export function messageCount(previousState = 0, action) {
  if (action.type === GET_MESSAGE_COUNT) {
    return action.data.data
  } else if (action.type === EMPTY_UNREAD_MESSAGES) {
    return action.data
  } else {
    return previousState
  }
}

export function getHeaderMessage() { //获取头部消息
  return post({
    url: '/crm-fd/api/message/queryUnRead',
    bodyData: {
      pageNo: 1,
      pageSize: 5,
    },
    actionType: GET_HEADER_MESSAGE,
    successConfig: {},
    failConfig: {
      message: '获取消息失败'
    }
  })
}

export function headerMessage(previousState = {}, action) {
  if (action.type === GET_HEADER_MESSAGE) {
    return action.data
  }
  return previousState
}


// 已读所有消息
export function readAllMessages(callback = () => {
}) {
  return post({
    url: '/crm-fd/api/message/readAll',
    actionType: READ_ALL_MESSAGES,
    successConfig: {
      callback,
    },
    failConfig: {
      message: '已读所有消息失败'
    }
  })
}


const account = combineReducers({
  loginUserInfo,
  loginRoleInfo,
  loginResourceInfo,
  loginUrl,
  currentRole,
  userList,
  loginAllResourceInfo,
  panelList,
  userPermission,
  messageCount,
  headerMessage,
  batchTime,
})
export default account
