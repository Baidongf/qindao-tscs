import { message } from 'antd'
import { combineReducers } from 'redux'
import { get, post } from 'utils/dataAccess/axios'
import { dispatch } from 'rxjs/internal/observable/range';

const GET_ROLE_LEVEL = 'GET_ROLE_LEVEL'
const GET_TIER = 'GET_TIER'
const GET_ROLE = 'GET_ROLE'
const SET_REDUX_STORE = 'SET_REDUX_STORE'

export const getRoleLevel = () =>{
  return get({
    url: `/gap/api/user/listRoleLevel`,
    actionType: GET_ROLE_LEVEL,
    successConfig: {
      callback: (data) =>{
      }
    },
    failConfig: {
      message: '获取用户层级失败'
    }
  })
}
export const getOrg = (roleLevelId) =>{
  return get({
    url: `/gap/api/user/findOrgByType?id=${roleLevelId}`,
    actionType: GET_TIER,
    successConfig: {
      callback: (data) =>{
      }
    },
    failConfig: {
      message: '获取机构失败'
    }
  })
}
export const getRole = (orgId,levelId) =>{
  return post({
    url: `/gap/api/user/findRoleByOrgId`,
    bodyData: {orgId,levelId},
    actionType: GET_ROLE,
    successConfig: {
      callback: (data) =>{
      }
    },
    failConfig: {
      message: '获取角色失败'
    }
  })
}

export function roleLevelList (previousState = {data: []}, action) {
  if (action.type === GET_ROLE_LEVEL) {
    return action.data
  } else {
    return previousState
  }
}
export function orgList (previousState = {data: []}, action) {
  if (action.type === GET_TIER) {
    return action.data
  } else {
    return previousState
  }
}
export function roleList (previousState = {data: []}, action) {
  if (action.type === GET_ROLE) {
    return action.data
  } else {
    return previousState
  }
}

export const setReduxStore = (store) =>{
  return (dispatch, getState) => {
    dispatch({
        type: SET_REDUX_STORE,
        data: store
    })
  }
}
export function reduxStore (previousState = {}, action) {
  if (action.type === SET_REDUX_STORE) {
    return action.data
  } else {
    return previousState
  }
}


const global = combineReducers({
  roleLevelList,
  orgList,
  roleList,
  reduxStore
})
export default global
