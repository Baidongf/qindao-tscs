// import { hashHistory } from 'react-router'
import {combineReducers} from 'redux'
import {get, post} from 'utils/dataAccess/axios'

// ------------------------------------
// Constants
// ------------------------------------
const GET_Collection_LIST = 'GET_Collection_LIST'
const GET_Collection_DETAIL = 'GET_Collection_DETAIL'
const GET_Collection_CONFIG = 'GET_Collection_CONFIG'

// ------------------------------------
// Actions
// ------------------------------------
export const getCollectionList = (data = {}) => {
  const postConfig = {
    url: '/crm-fd/api/para/query',
    actionType: GET_Collection_LIST,
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

export const getCollectionConfig = () => {
  const postConfig = {
    url: `/crm-fd/api/para/Collection`,
    actionType: GET_Collection_CONFIG,
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

export const getCollectionDetail = (id) => {
  const postConfig = {
    url: `/crm-fd/api/knowledge/details/${id}`,
    actionType: GET_Collection_DETAIL,
    successConfig: {
      callback: (payload) => {
      }
    },
    failConfig: {
      message: '获取知识条目详情失败'
    }
  }
  return get(postConfig)
}

export const upDateCollection = (data, callback) => {
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

export const collectKnowl = (id, callback) => {
  const postConfig = {
    url: `/crm-fd/api/knowledgeCollection/save/${id}`,
    bodyData: id,
    successConfig: {
      message: '收藏成功',
      callback: (payload) => {
        callback && callback()
      }
    },
    failConfig: {
      message: '收藏失败'
    }
  }
  return post(postConfig)
}

export const collectDelKnowl = (id, callback) => {
  const postConfig = {
    url: `/crm-fd/api/knowledgeCollection/delete/${id}`,
    bodyData: id,
    successConfig: {
      message: '取消收藏成功',
      callback: (payload) => {
        callback && callback()
      }
    },
    failConfig: {
      message: '取消收藏失败'
    }
  }
  return post(postConfig)
}

export const CollectionList = (previousState = { data: [] }, action) => {
  if (action.type === GET_Collection_LIST) {
    return action.data
  } else {
    return previousState
  }
}

export const CollectionDetail = (previousState = {}, action) => {
  if (action.type === GET_Collection_DETAIL) {
    return action.data
  } else {
    return previousState
  }
}

export const CollectionConfig = (previousState = {}, action) => {
  if (action.type === GET_Collection_CONFIG) {
    return action.data
  } else {
    return previousState
  }
}

const CollectionMgt = combineReducers({
  CollectionList,
  CollectionDetail,
  CollectionConfig
})
export default CollectionMgt
