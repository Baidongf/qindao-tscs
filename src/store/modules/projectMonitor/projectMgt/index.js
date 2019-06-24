// import { hashHistory } from 'react-router'
import { message } from 'antd'
import { combineReducers } from 'redux'
import { get, post } from 'utils/dataAccess/axios'


const IS_MOCK =  0 ? '/mock': ''
const GET_ORG_LIST = 'GET_ORG_LIST'
const GET_ORG_COUNT = 'GET_ORG_COUNT'
const DELETE_ORG = 'DELETE_ORG'
const GET_ORG_DETAIL = 'GET_ORG_DETAIL'
const SAVE_ORG = 'SAVE_ORG'
const UPDATE_ORG = 'UPDATE_ORG'


export const getOrgList = (filterObj = {}) => {
  let bodyData = {
    nameOrNo: filterObj.nameOrNo,
    pageNo: filterObj.pageNo,
    pageSize: filterObj.pageSize,
    status: filterObj.status
  }

  const postConfig = {
    url:  `${IS_MOCK}/crm-fd/api/auth/institution/query`,
    actionType: GET_ORG_LIST,
    bodyData: bodyData,
    successConfig: {
      callback: (payload) => {

      }
    },
    failConfig: {
      message: '获取机构列表失败'
    }
  }

  return post(postConfig)
}

export const getOrgCount = (queryObj) => {
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
              field: "employeeId",
              value: filtersObj[key],
              operator: "LIKE"
            },
            {
              field: "orgName",
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


  const postConfig = {
    url:  '${IS_MOCK}/crm-fd/api/auth/institution/findOrgCount',
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

  return post(postConfig)
}

export const deleteOrg = (id) =>{
  return get({
    url: `${IS_MOCK}/crm-fd/api/auth/institution/delete?id=${id}`,
    actionType: DELETE_ORG,
    successConfig: {
      message: '删除机构成功',
      callback: (data) =>{

      }
    },
    failConfig: {
      message: '删除机构失败'
    }
  })
}
export const getOrgDetail = (id) =>{
  return get({
    url: `${IS_MOCK}/crm-fd/api/auth/institution/details/${id}`,
    actionType: GET_ORG_DETAIL,
    successConfig: {
      callback: (data) =>{

      }
    },
    failConfig: {
      message: '获取机构失败'
    }
  })
}

export const saveOrg = (orgObj) =>{
  return post({
    url: `${IS_MOCK}/crm-fd/api/auth/institution/save`,
    bodyData: orgObj,
    actionType: SAVE_ORG,
    successConfig: {
      message: '新增机构成功',
      callback: (data) =>{

      }
    },
    failConfig: {
      message: '新建机构失败'
    }
  })
}
export const updateOrg = (orgObj) =>{
  return post({
    url: `${IS_MOCK}/crm-fd/api/auth/institution/update`,
    bodyData: orgObj,
    actionType: UPDATE_ORG,
    successConfig: {
      message: '更新机构成功',
      callback: (data) =>{

      }
    },
    failConfig: {
      message: '更新机构失败'
    }
  })
}



export function list (previousState = {content: []}, action) {
  if (action.type === GET_ORG_LIST) {
    return action.data
  } else {
    return previousState
  }
}
export function orgDetail (previousState = {data: []}, action) {
  if (action.type === GET_ORG_DETAIL) {
    return action.data
  } else {
    return previousState
  }
}

export function orgCount(previousState = { data: 0 }, action) {
  if (action.type === GET_ORG_COUNT) {
    return action.data
  } else {
    return previousState
  }
}

const orgMgt = combineReducers({
  list,
  orgDetail,
  orgCount
})
export default orgMgt
