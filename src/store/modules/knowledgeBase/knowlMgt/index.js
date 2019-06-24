// import { hashHistory } from 'react-router'
import { combineReducers } from 'redux'
import { get, post } from 'utils/dataAccess/axios'
import { FILTER_INIT_VALUES } from 'config/baseFilter'
const GET_KNOWL_LIST = 'GET_KNOWL_LIST'
const GET_KNOWL_COUNT = 'GET_KNOWL_COUNT'
const DELETE_KNOWL = 'DELETE_KNOWL'
const GET_KNOWL_DETAIL = 'GET_KNOWL_DETAIL'
const SAVE_KNOWL = 'SAVE_KNOWL'
const UPDATE_KNOWL = 'UPDATE_KNOWL'
const PUBLISH_KNOWL = 'PUBLISH_KNOWL'
const GET_KNOWL_PARAMS='GET_KNOWL_PARAMS'
const GET_KONWL_COLLECTION_LIST='GET_KONWL_COLLECTION_LIST'
const GET_ALL_KONWL_LIST='GET_ALL_KONWL_LIST'
const SET_HOME_PARAMS = 'SET_HOME_PARAMS'
const SET_MANAGE_LIST_FILTER = 'SET_MANAGE_LIST_FILTER'
const SET_ALL_LIST_FILTER = 'SET_ALL_LIST_FILTER'
const SET_COLLECTION_LIST_FILTER = 'SET_COLLECTION_LIST_FILTER'

export const deleteKnowlItem = (id,callback) => {

  const postConfig = {
    url:  `/crm-fd/api/knowledge/delete/${id}`,
    successConfig: {
      callback: (payload) => {
        callback&&callback(payload)
      }
    },
    failConfig: {
      message: '删除失败'
    }
  }

  return get(postConfig)
}

export const getKnowlParams = (callBack) => {

  const postConfig = {
    url:  `/crm-fd/api/para/query`,
    actionType: GET_KNOWL_PARAMS,
    bodyData: {
      "name": "知识库类型",
      "pageNo": 1,
      "pageSize": 10
    },
    successConfig: {
      callback: (payload) => {
        callBack&&callBack(payload)
      }
    },
    failConfig: {
      message: '获取知识库类型失败'
    }
  }

  return post(postConfig)
}

export const getCollectionKnowlList = (filterObj = {}) => {

  const postConfig = {
    url:  `/crm-fd/api/knowledgeCollection/queryCollection`,
    actionType: GET_KONWL_COLLECTION_LIST,
    bodyData: filterObj,
    successConfig: {
      callback: (payload) => {

      }
    },
    failConfig: {
      message: '获取知识库列表失败'
    }
  }

  return post(postConfig)
}

export const getKnowlList = (filterObj = {}) => {

  const postConfig = {
    url:  `/crm-fd/api/knowledgeCollection/query`,
    actionType: GET_KNOWL_LIST,
    bodyData: filterObj,
    successConfig: {
      callback: (payload) => {

      }
    },
    failConfig: {
      message: '获取知识库列表失败'
    }
  }

  return post(postConfig)
}

export const getALLKnowList= (filterObj = {}) => {

  const postConfig = {
    url:  `/crm-fd/api/knowledge/query`,
    actionType: GET_ALL_KONWL_LIST,
    bodyData: filterObj,
    successConfig: {
      callback: (payload) => {

      }
    },
    failConfig: {
      message: '获取知识库列表失败'
    }
  }

  return post(postConfig)
}

export const getKnowlCount = (queryObj) => {
  var filtersObj = queryObj.filtersObj
  let bodyData = {
    filter: {
      logicConnector: 'AND',  // AND, OR
      filters: []
    }
  }

  /* 组装查询数据 START */
  bodyData.page = queryObj.page
  // bodyData.page.sortOrders = [
  //   {
  //     direction: 'DESC',
  //     property: 'orgId'
  //   }
  // ]
  for (var key in filtersObj) {
    if (key === 'searchKey') {
      if (filtersObj[key]) {
        bodyData.filter.filters.push({
          logicConnector: "OR",
          filters: [
            {
              field: "title",
              value: filtersObj[key],
              operator: "LIKE"
            },
            {
              field: "content",
              value: filtersObj[key],
              operator: "LIKE"
            }
          ]
          })
      }
    } else {
      if (filtersObj[key]) {
        bodyData.filter.filters.push({
          field: key,
          value: filtersObj[key],
          operator: 'EQ'
        })
      }
    }
  }
  // /* 组装查询数据 END */

  // // 检验查询数据

/*
  const postConfig = {
    url:  `/crm-fd/api/knowledge/findOrgCount`,
    actionType: GET_ORG_COUNT,
    bodyData: bodyData,
    successConfig: {
      callback: (payload) => {

      }
    },
    failConfig: {
      message: '获取机构列表失败'
    }
  }

  return post(postConfig)*/
}

export const deleteKnowl = (id) =>{
  return get({
    url: `/crm-fd/api/knowledge/delete?id=${id}`,
    actionType: DELETE_KNOWL,
    successConfig: {
      message: '删除知识条目成功',
      callback: (data) =>{

      }
    },
    failConfig: {
      message: '删除知识条目失败'
    }
  })
}

export const getKnowlDetail = (id,callback) =>{
  return get({
    url: `/crm-fd/api/knowledge/details/${id}`,
    actionType: GET_KNOWL_DETAIL,
    successConfig: {
      callback: (data) =>{
        callback&&callback(data)
      }
    },
    failConfig: {
      message: '获取知识条目失败'
    }
  })
}

export const getKnowlColectionDetail = (id) =>{
  return get({
    url: `/crm-fd/api/knowledge/details/${id}`,
    actionType: GET_KNOWL_DETAIL,
    successConfig: {
      callback: (data) =>{

      }
    },
    failConfig: {
      message: '获取知识条目失败'
    }
  })
}

export const saveKnowl = (knowlObj,callback) =>{
  return post({
    url: `/crm-fd/api/knowledge/save`,
    bodyData: knowlObj,
    actionType: SAVE_KNOWL,
    successConfig: {
      message: '新增知识条目成功',
      callback: (data) =>{
        callback&&callback()
      }
    },
    failConfig: {
      message: '新建知识条目失败'
    }
  })
}
export const updateKnowl = (knowlObj,callback) =>{
  return post({
    url: `/crm-fd/api/knowledge/update`,
    bodyData: knowlObj,
    actionType: UPDATE_KNOWL,
    successConfig: {
      message: '更新知识条目成功',
      callback: (data) =>{
        callback&&callback()
      }
    },
    failConfig: {
      message: '更新知识条目失败'
    }
  })
}

export const publishKnowl = (id, callback) => {
  return post({
    url: `/crm-fd/api/knowledge/publish/${id}`,
    actionType: PUBLISH_KNOWL,
    successConfig: {
      message: '发布知识条目成功',
      callback: (data) =>{
        callback&&callback()
      }
    },
    failConfig: {
      message: '发布知识条目失败'
    }
  })
}

export function knowlAllList (previousState = {data: []}, action) {
  if (action.type === GET_ALL_KONWL_LIST) {
    return action.data
  } else {
    return previousState
  }
}

export function knowlCollectionList (previousState = {data: []}, action) {
  if (action.type === GET_KONWL_COLLECTION_LIST) {
    return action.data
  } else {
    return previousState
  }
}

export function knowlList (previousState = {data: []}, action) {
  if (action.type === GET_KNOWL_LIST) {
    return action.data
  } else {
    return previousState
  }
}

export function knowlDetail (previousState = {data: []}, action) {
  if (action.type === GET_KNOWL_DETAIL) {
    return action.data
  } else {
    return previousState
  }
}

export function knowlCount(previousState = { data: 0 }, action) {
  if (action.type === GET_KNOWL_COUNT) {
    return action.data
  } else {
    return previousState
  }
}

export function knowlParams(previousState = { data: [] }, action) {
  if (action.type === GET_KNOWL_PARAMS) {
    return action.data
  } else {
    return previousState
  }
}

export function setTabKey (data) {
  return {
    type: SET_HOME_PARAMS,
    tabkey:data
  }
}
export function knowlTabKey(preState = {tabkey: "0"}, action){
  switch(action.type){
    case SET_HOME_PARAMS:
      return {tabkey: action.tabkey}
    default:
      return preState
  }
}

//设置默认过滤条件的reducer
export function manageListFilter(preState = {
  ...FILTER_INIT_VALUES
},action){
  switch(action.type){
    case SET_MANAGE_LIST_FILTER:
      Object.assign(preState,action.data)
      return preState
    default:
      return preState
  }
}
export function allListFilter(preState = {
  ...FILTER_INIT_VALUES
},action){
  switch(action.type){
    case SET_ALL_LIST_FILTER:
      Object.assign(preState,action.data)
      return preState
    default:
      return preState
  }
}
export function collectionListFilter(preState = {
  ...FILTER_INIT_VALUES
},action){
  switch(action.type){
    case SET_COLLECTION_LIST_FILTER:
      Object.assign(preState,action.data)
      return preState
    default:
      return preState
  }
}
//控制filter的action
export function setManageListFilter (data) {
  return {
    type: SET_MANAGE_LIST_FILTER,
    data
  }
}
export function setAllListFilter (data) {
  return {
    type: SET_ALL_LIST_FILTER,
    data
  }
}
export function setCollectionListFilter (data) {
  return {
    type: SET_COLLECTION_LIST_FILTER,
    data
  }
}

const knowlMgt = combineReducers({
  knowlList,
  knowlDetail,
  knowlCount,
  knowlParams,
  knowlCollectionList,
  knowlAllList,
  knowlTabKey,
  manageListFilter,
  allListFilter,
  collectionListFilter,
  publishKnowl
})
export default knowlMgt
