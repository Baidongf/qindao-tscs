import axios from 'axios'
import { combineReducers } from 'redux'
import { get, post } from 'utils/dataAccess/axios'


const IS_MOCK =  1 ? '/mock': ''
const baseUrl = '/crm-fd/api'
const GET_TAG_LIST = 'GET_TAG_LIST'
const GET_TAG_COUNT = 'GET_TAG_COUNT'
const GET_TAG_DETAIL ='GET_TAG_DETAIL'
const EXPORT_CUSTOMERS = 'EXPORT_CUSTOMERS'
const UPLOAD_FILE = 'UPLOAD_FILE'
const CREATE_TAG = 'CREATE_TAG'


export const getTagList = (filterObj = {}) => {
  const postConfig = {
    url:  `${baseUrl}/tag/query`,
    actionType: GET_TAG_LIST,
    bodyData: filterObj,
    successConfig: {},
    failConfig: {
      message: '获取标签信息失败'
    }
  }

  return post(postConfig)
}

export const getTagCount = (queryObj) => {
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
    url:  `${IS_MOCK}/crm-fd/api/auth/institution/findOrgCount`,
    actionType: GET_TAG_COUNT,
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

export const getTagDetail = (tagId = '') =>{
  return post({
    url: `${baseUrl}/tag/details/${tagId}`,
    actionType: GET_TAG_DETAIL,
    successConfig: {},
    failConfig: {
      message: '获取标签详情失败'
    }
  })
}

export const exportCustomers = (tagId) => {
  return get({
    url: `${baseUrl}/tag/export/${tagId}`,
    actionType: EXPORT_CUSTOMERS,
    responseType: 'blob',
    successConfig: {
      callback: (res) => {
        console.log(res)
      }
    },
    failConfig: {
      message: '导出客户失败'
    }
  })
}

// 上传文件，成功后返回文件地址
export const uploadFile = (file) => {
  return post({
    url: `${baseUrl}/upload/file`,
    actionType: UPLOAD_FILE,
    contentType: 'multipart/form-data',
    successConfig: {
      message: '文件上传成功',
    },
    failConfig: {
      message: '文件上传失败',
    }
  })
}

// 新建标签
export const createTag = (data = {}, callback = ()=>{}) => {
  return post({
    url: `${baseUrl}/tag/save`,
    actionType: CREATE_TAG,
    bodyData: data,
    successConfig: {
      message: '新增标签成功',
      callback,
    },
    failConfig: {
      message: '新增标签失败'
    }
  })
}

const list = (previousState = {content: []}, action) => {
  if (action.type === GET_TAG_LIST) {
    return action.data
  } else {
    return previousState
  }
}

const tagDetail = (previousState = {data: []}, action) => {
  if (action.type === GET_TAG_DETAIL) {
    return action.data
  } else {
    return previousState
  }
}

const tagMgt = combineReducers({
  list,
  tagDetail
})
export default tagMgt
