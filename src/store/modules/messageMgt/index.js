import {get, post} from 'utils/dataAccess/axios'
import {combineReducers} from 'redux'

const GET_MESSAGE_CATEGORY = 'GET_MESSAGE_CATEGORY'
const GET_MESSAGE_LIST = 'GET_MESSAGE_LIST'
export const getMessageCategory = (filterObj = {}, callback) => {

  const postConfig = {
    url: `/crm-fd/api/message/categoryTree`,
    actionType: GET_MESSAGE_CATEGORY,
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

  return get(postConfig)
}

export const getMessageList = (filterObj = {}, callback) => {

  const postConfig = {
    url: `/crm-fd/api/message/query`,
    actionType: GET_MESSAGE_LIST,
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

export const deleteMessage = (ids, callback) => {

  const postConfig = {
    url: `/crm-fd/api/message/delete/${ids.join(',')}`,
    successConfig: {
      message: '删除消息成功',
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '删除消息失败'
    }
  }

  return post(postConfig)
}

export const readMessage = (ids, callback) => {

  const postConfig = {
    url: `/crm-fd/api/message/read/${ids.join(',')}`,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '标记已读失败'
    }
  }

  return post(postConfig)
}

export const readAllMessage = (filterObj = {}, callback) => {

  const postConfig = {
    url: `/crm-fd/api/message/readAll`,
    bodyData: filterObj,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
    failConfig: {
      message: '标记已读失败'
    }
  }

  return post(postConfig)
}


export function messageList(previousState = {data: []}, action) {
  if (action.type === GET_MESSAGE_LIST) {
    return action.data
  } else {
    return previousState
  }
}

export function messageCategory(previousState = {data: []}, action) {
  if (action.type === GET_MESSAGE_CATEGORY) {
    return action.data
  } else {
    return previousState
  }
}

const schedule = combineReducers({
  messageCategory,
  messageList
})
export default schedule
