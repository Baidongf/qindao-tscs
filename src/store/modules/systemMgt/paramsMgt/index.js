// import { hashHistory } from 'react-router'
import {combineReducers} from 'redux'
import {get, post} from 'utils/dataAccess/axios'

// ------------------------------------
// Constants
// ------------------------------------
const GET_PARAMS_LIST = 'GET_PARAMS_LIST'
const GET_PARAMS_DETAIL = 'GET_PARAMS_DETAIL'
const GET_PARAMS_CONFIG = 'GET_PARAMS_CONFIG'

// ------------------------------------
// Actions
// ------------------------------------
export const getParamsList = (data = {}) => {
  const postConfig = {
    url: '/crm-fd/api/para/query',
    actionType: GET_PARAMS_LIST,
    bodyData: data,
    successConfig: {
      callback: (payload) => {
      }
    },
    failConfig: {
      message: '获取参数列表失败'
    }
  }
  return post(postConfig)
}

export const getParamsConfig = () => {
  const postConfig = {
    url: `/crm-fd/api/para/params`,
    actionType: GET_PARAMS_CONFIG,
    successConfig: {
      callback: (payload) => {
      }
    },
    failConfig: {
      message: '获取参数配置失败'
    }
  }
  return get(postConfig)
}

export const getParamsDetail = (id) => {
  const postConfig = {
    url: `/crm-fd/api/para/details/${id}`,
    actionType: GET_PARAMS_DETAIL,
    successConfig: {
      callback: (payload) => {
      }
    },
    failConfig: {
      message: '获取参数详情失败'
    }
  }
  return get(postConfig)
}

export const upDateParams = (data, callback) => {
  const postConfig = {
    url: '/crm-fd/api/para/update',
    bodyData: data,
    successConfig: {
      message: '更新参数成功',
      callback: (payload) => {
        callback && callback()
      }
    },
    failConfig: {
      message: '更新参数失败'
    }
  }
  return post(postConfig)
}

export const paramsList = (previousState = { data: [] }, action) => {
  if (action.type === GET_PARAMS_LIST) {
    return action.data
  } else {
    return previousState
  }
}

export const paramsDetail = (previousState = {}, action) => {
  if (action.type === GET_PARAMS_DETAIL) {
    return action.data
  } else {
    return previousState
  }
}

export const paramsConfig = (previousState = {}, action) => {
  if (action.type === GET_PARAMS_CONFIG) {
    return action.data
  } else {
    return previousState
  }
}

const paramsMgt = combineReducers({
  paramsList,
  paramsDetail,
  paramsConfig
})
export default paramsMgt
