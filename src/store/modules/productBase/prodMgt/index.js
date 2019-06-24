import {combineReducers} from 'redux'
import {get, post} from 'utils/dataAccess/axios'

const GET_PROD_LIST = 'GET_PROD_LIST'
const GET_PROD_COUNT = 'GET_PROD_COUNT'
const GET_PROD_DETAIL = 'GET_PROD_DETAIL'
const SAVE_PROD = 'SAVE_PROD'
const UPDATE_PROD = 'UPDATE_PROD'
const GET_KNOWLEDGE_LIST = 'GET_KNOWLEDGE_LIST'
const SAVE_CATEGORY='SAVE_CATEGORY'
const UPDATE_CATEGORY='UPDATE_CATEGORY'

export const deleteCategory = (id,callback) => {

  const postConfig = {
    url: `/crm-fd/api/productCategory/delete/${id}`,
    successConfig: {
      callback: (payload) => {
        callback&&callback(payload)
      }
    },

  }
  return post(postConfig)
}

export const updateCategory = (filterObj = {},callback) => {

  const postConfig = {
    url: `/crm-fd/api/productCategory/update`,
    actionType: UPDATE_CATEGORY,
    bodyData: filterObj,
    successConfig: {
      callback: (payload) => {
        callback&&callback(payload)
      }
    },

  }
  return post(postConfig)
}

export const saveCategory = (filterObj = {},callback) => {

  const postConfig = {
    url: `/crm-fd/api/productCategory/save`,
    actionType: SAVE_CATEGORY,
    bodyData: filterObj,
    successConfig: {
      callback: (payload) => {
        callback&&callback(payload)
      }
    },

  }
  return post(postConfig)
}

export const getKnowledgeList = (filterObj = {}) => {

  const postConfig = {
    url: `/crm-fd/api/knowledgeCollection/query`,
    actionType: GET_KNOWLEDGE_LIST,
    bodyData: filterObj,
    successConfig: {
      callback: (payload) => {

      }
    },

  }
  return post(postConfig)
}

export const getProdList = (filterObj = {}) => {

  const postConfig = {
    url: `/crm-fd/api/product/query`,
    actionType: GET_PROD_LIST,
    bodyData: filterObj,
    successConfig: {
      callback: (payload) => {

      }
    },
    failConfig: {
      message: '获取产品库列表失败'
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

export const getProdDetail = (id, callback) => {
  const postConfig = {
    url: `/crm-fd/api/product/details/${id}`,
    actionType: GET_PROD_DETAIL,
    successConfig: {
      callback: (data) => {
        callback && callback(data)
      }
    },
    failConfig: {
      message: '获取产品信息失败'
    }
  }
  return post(postConfig)
}

export const saveProd = (prodObj, callback) => {
  return post({
    url: `/crm-fd/api/product/save`,
    bodyData: prodObj,
    actionType: SAVE_PROD,
    successConfig: {
      message: '新增产品信息成功',
      callback: (data) => {
        callback && callback()
      }
    },
    failConfig: {
      message: '新建产品信息失败'
    }
  })
}
export const updateProd = (prodObj, callback) => {
  return post({
    url: `/crm-fd/api/product/update`,
    bodyData: prodObj,
    actionType: UPDATE_PROD,
    successConfig: {
      message: '更新产品信息成功',
      callback: (data) => {
        callback && callback()
      }
    },
    failConfig: {
      message: '更新产品信息失败'
    }
  })
}

export function prodList(previousState = {data: []}, action) {
  if (action.type === GET_PROD_LIST) {
    return action.data
  } else {
    return previousState
  }
}

export function prodDetail(previousState = {data: []}, action) {
  if (action.type === GET_PROD_DETAIL) {
    return action.data
  } else {
    return previousState
  }
}

export function prodCount(previousState = {data: 0}, action) {
  if (action.type === GET_PROD_COUNT) {
    return action.data
  } else {
    return previousState
  }
}

export function knowledgeList(previousState = {data: []}, action) {
  if (action.type === GET_KNOWLEDGE_LIST) {
    return action.data
  } else {
    return previousState
  }
}

const prodMgt = combineReducers({
  prodList,
  prodDetail,
  prodCount,
  knowledgeList
})
export default prodMgt
