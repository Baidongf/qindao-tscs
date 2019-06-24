import {combineReducers} from 'redux'
import {get, post} from 'utils/dataAccess/axios'


const IS_MOCK = 0 ? '/mock' : ''
const GET_PROJECT_LIST = 'GET_PROJECT_LIST'
const GET_PROJECT_CUST_LIST = 'GET_PROJECT_CUST_LIST'
const GET_PROJECT_TREE = 'GET_PROJECT_TREE'
const GET_PROJECT_COUNT = 'GET_PROJECT_COUNT'
const DELETE_PROJECT = 'DELETE_PROJECT'
const GET_PROJECT_DETAIL = 'GET_PROJECT_DETAIL'
const SAVE_PROJECT = 'SAVE_PROJECT'
const UPDATE_PROJECT = 'UPDATE_PROJECT'
const GET_CREATE_USER = 'GET_CREATE_USER'
const ADD_CUSTOMER = 'ADD_CUSTOMER'


export const getSequence = ( callback) => {

  const postConfig = {
    url: `/crm-fd/api/sequence/next/project`,
    actionType: ADD_CUSTOMER,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    }
  }

  return get(postConfig)
}

export const addCustomer = (bodyData = {}, callback) => {

  const postConfig = {
    url: `/crm-fd/api/projectDetector/addCustomer`,
    actionType: ADD_CUSTOMER,
    bodyData: bodyData,
    successConfig: {
      callback: (payload) => {
        callback && callback()
      }
    },
    failConfig: {
      message: '获取项目列表失败'
    }
  }

  return post(postConfig)
}

export const getCreateUser = (name) => {

  const postConfig = {
    url: `/crm-fd/api/user/queryUser`,
    actionType: GET_CREATE_USER,
    bodyData: {
      "nameOrNo": name,
      "pageNo": 1,
      "pageSize": 100000
    },
    successConfig: {
      callback: (payload) => {

      }
    },
    failConfig: {
      message: '获取项目列表失败'
    }
  }

  return post(postConfig)
}

export const getProjectList = (filterObj = {}) => {

  const postConfig = {
    url: `${IS_MOCK}/crm-fd/api/projectDetector/query`,
    actionType: GET_PROJECT_LIST,
    bodyData: filterObj,
    successConfig: {
      callback: (payload) => {

      }
    },
    failConfig: {
      message: '获取项目列表失败'
    }
  }

  return post(postConfig)
}


export const getCustomerList = (filterObj = {}) => {

  const postConfig = {
    url: `${IS_MOCK}/crm-fd/api/projectDetector/queryList`,
    actionType: GET_PROJECT_CUST_LIST,
    bodyData: filterObj,
    successConfig: {
      callback: (payload) => {

      }
    },
    failConfig: {
      message: '获取客户列表失败'
    }
  }

  return post(postConfig)
}


export const getprojectCount = (queryObj) => {
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
              field: "createTime",
              value: filtersObj[key],
              operator: "LIKE"
            },
            {
              field: "institutionId",
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
    url: `${IS_MOCK}/crm-fd/api/auth/projectDetector/findOrgCount`,
    actionType: GET_PROJECT_COUNT,
    bodyData: bodyData,
    successConfig: {
      callback: (payload) => {

      }
    },
    failConfig: {
      message: '获取项目列表失败'
    }
  }

  return post(postConfig)
}

export const deleteOrg = (id) => {
  return get({
    url: `${IS_MOCK}/crm-fd/api/projectDetector/delete?id=${id}`,
    actionType: DELETE_PROJECT,
    successConfig: {
      message: '删除项目成功',
      callback: (data) => {

      }
    },
    failConfig: {
      message: '删除项目失败'
    }
  })
}
export const getProjectDetail = (id) => {
  return get({
    url: `${IS_MOCK}/crm-fd/api/projectDetector/details/${id}`,
    actionType: GET_PROJECT_DETAIL,
    successConfig: {
      callback: (data) => {

      }
    },
    failConfig: {
      message: '获取项目失败'
    }
  })
}

export const saveProject = (projectObj,callback) => {
  return post({
    url: `${IS_MOCK}/crm-fd/api/projectDetector/save`,
    bodyData: projectObj,
    actionType: SAVE_PROJECT,
    successConfig: {
      message: '新增项目成功',
      callback: (data) => {
        callback&&callback(data)
      }
    },
    failConfig: {
      message: '新建项目失败'
    }
  })
}
export const updateProject = (projectObj,callback) => {
  return post({
    url: `${IS_MOCK}/crm-fd/api/auth/projectDetector/update`,
    bodyData: projectObj,
    actionType: UPDATE_PROJECT,
    successConfig: {
      message: '更新项目成功',
      callback: (data) => {
        callback&&callback(data)
      }
    },
    failConfig: {
      message: '更新项目失败'
    }
  })
}

export function createUser(previousState = {data: []}, action) {
  if (action.type === GET_CREATE_USER) {
    return action.data
  } else {
    return previousState
  }
}

export function projectList(previousState = {data: []}, action) {
  if (action.type === GET_PROJECT_LIST) {
    return action.data
  } else {
    return previousState
  }
}

export function customerList(previousState = {data: []}, action) {
  if (action.type === GET_PROJECT_CUST_LIST) {
    return action.data
  } else {
    return previousState
  }
}

export function orgTree(previousState = {data: []}, action) {
  if (action.type === GET_PROJECT_TREE) {
    return action.data
  } else {
    return previousState
  }
}

export function projectDetail(previousState = {data: []}, action) {
  if (action.type === GET_PROJECT_DETAIL) {
    return action.data
  } else {
    return previousState
  }
}

export function projectCount(previousState = {data: 0}, action) {
  if (action.type === GET_PROJECT_COUNT) {
    return action.data
  } else {
    return previousState
  }
}

const projectMgt = combineReducers({
  projectList,
  customerList,
  orgTree,
  projectDetail,
  createUser
})
export default projectMgt
