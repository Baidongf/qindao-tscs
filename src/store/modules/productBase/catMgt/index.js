// import { hashHistory } from 'react-router'
import { message } from 'antd'
import { combineReducers } from 'redux'
import { get, post } from 'utils/dataAccess/axios'

const GET_CAT_LIST = 'GET_CAT_LIST'
const GET_CAT_COUNT = 'GET_CAT_COUNT'
const GET_CAT_DETAIL = 'GET_CAT_DETAIL'
const SAVE_CAT = 'SAVE_CAT'
const UPDATE_CAT = 'UPDATE_CAT'


export const getCatList = (filterObj = {},callback) => {

  const postConfig = {
    url:  `/crm-fd/api/productCategory/categoryTree`,
    actionType: GET_CAT_LIST,
    bodyData: filterObj,
    successConfig: {
      callback: (payload) => {
        callback&&callback(payload)
      }
    },
    failConfig: {
      message: '获取产品目录树失败'
    }
  }

  return post(postConfig)
}

export const getProdCount = (queryObj) => {
  var filtersObj = queryObj.filtersObj
  let bodyData = {
    filter: {
      logicConnector: 'AND',  // AND, OR
      filters: []
    }
  }

  /* 组装查询数据 START */
  bodyData.page = queryObj.page
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
}

export const getProdDetail = (id) =>{
  return get({
    url: `/crm-fd/api/product/details/${id}`,
    actionType: GET_CAT_DETAIL,
    successConfig: {
      callback: (data) =>{

      }
    },
    failConfig: {
      message: '获取产品信息失败'
    }
  })
}

export const saveProd = (prodObj,callback) =>{
  return post({
    url: `/crm-fd/api/product/save`,
    bodyData: prodObj,
    actionType: SAVE_CAT,
    successConfig: {
      message: '新增产品信息成功',
      callback: (data) =>{
        callback&&callback()
      }
    },
    failConfig: {
      message: '新建产品信息失败'
    }
  })
}
export const updateProd = (prodObj,callback) =>{
  return post({
    url: `/crm-fd/api/product/update`,
    bodyData: prodObj,
    actionType: UPDATE_CAT,
    successConfig: {
      message: '更新产品信息成功',
      callback: (data) =>{
        callback&&callback()
      }
    },
    failConfig: {
      message: '更新产品信息失败'
    }
  })
}

export function catList (previousState = {data: []}, action) {
  if (action.type === GET_CAT_LIST) {
    return action.data
  } else {
    return previousState
  }
}

export function catDetail (previousState = {data: []}, action) {
  if (action.type === GET_CAT_DETAIL) {
    return action.data
  } else {
    return previousState
  }
}

export function catCount(previousState = { data: 0 }, action) {
  if (action.type === GET_CAT_COUNT) {
    return action.data
  } else {
    return previousState
  }
}

const catMgt = combineReducers({
  catList,
  catDetail,
  catCount
})
export default catMgt
