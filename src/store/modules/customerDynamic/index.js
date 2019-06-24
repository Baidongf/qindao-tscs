import { get, post } from 'utils/dataAccess/axios'
import { combineReducers } from 'redux'

const baseUrl = '/crm-fd/api'

// ======================== actions =============================
const GET_DYNAMIC_LIST = 'GET_DYNAMIC_LIST'
const GET_DYNAMIC_TYPE = 'GET_DYNAMIC_TYPE'
const DELIVER_DYNAMIC_FILTER = 'DELIVER_DYNAMIC_FILTER'
const GET_DYNAMIC_DETAIL = 'GET_DYNAMIC_DETAIL'

const GET_INSTITUTION_DYNAMIC_LIST = 'GET_INSTITUTION_DYNAMIC_LIST'
const GET_MY_DYNAMIC_LIST = 'GET_MY_DYNAMIC_LIST'

const DELIVER_INSTITUTION_DYNAMIC_FILTER = 'DELIVER_INSTITUTION_DYNAMIC_FILTER'
const DELIVER_MY_DYNAMIC_FILTER = 'DELIVER_MY_DYNAMIC_FILTER'



// ======================== dispatchers =========================

// 获取客户动态列表
export const getDynamicList = (bodyData = {}) => {
  const config = {
    url: `${baseUrl}/customerDynamic/query`,
    bodyData,
    actionType: GET_DYNAMIC_LIST,
    successConfig: {},
    failConfig: {
      message: '获取动态列表失败'
    }
  }
  return post(config)
}

// 获取机构客户动态
export const getInstitutionDynamicList = (bodyData = {}) => {
  const config = {
    url: `${baseUrl}/customerDynamic/institutionQuery`,
    bodyData,
    actionType: GET_INSTITUTION_DYNAMIC_LIST,
    successConfig: {},
    failConfig: {
      message: '获取机构动态列表失败'
    }
  }
  return post(config)
}

// 获取我的客户动态
export const getMyDynamicList = (bodyData = {}) => {
  const config = {
    url: `${baseUrl}/customerDynamic/userQuery`,
    bodyData,
    actionType: GET_MY_DYNAMIC_LIST,
    successConfig: {},
    failConfig: {
      message: '获取我的动态列表失败'
    }
  }
  return post(config)
}

// 获取客户动态类型
export const getDynamicType = () => {
  const config = {
    url: `${baseUrl}/customerDynamic/type`,
    actionType: GET_DYNAMIC_TYPE,
    failConfig: {
      message: '获取动态类型失败'
    }
  }
  return get(config)
}

// 传递客户动态筛选条件
export const deliverDynamicFilter = (filterObj) => {
  return (dispatch) => {
    dispatch({
      type: DELIVER_DYNAMIC_FILTER,
      data: filterObj,
    })
  }
}

// 传递机构客户动态的筛选条件
export const deliverInstitutionDynamicFilter = (filterObj) => {
  return (dispatch) => {
    dispatch({
      type: DELIVER_INSTITUTION_DYNAMIC_FILTER,
      data: filterObj,
    })
  }
}

// 传递我的客户动态的筛选条件
export const deliverMyDynamicFilter = (filterObj) => {
  return (dispatch) => {
    dispatch({
      type: DELIVER_MY_DYNAMIC_FILTER,
      data: filterObj,
    })
  }
}


// 获取客户动态详情
export const getDynamicDetail = (dynamicKey) => {
  const config = {
    url: `${baseUrl}/customerDynamic/details/${dynamicKey}`,
    actionType: GET_DYNAMIC_DETAIL,
    failConfig: {
      message: '获取详情失败'
    }
  }
  return get(config)
}




// ======================== reducers ============================

// 客户动态列表
const dynamicList = (previousState = {data:[]}, action) => {
  if (action.type === GET_DYNAMIC_LIST) {
    return action.data
  } else {
    return previousState
  }
}

// 机构客户动态列表
const institutionDynamicList = (previousState = {data: []}, action) => {
  if (action.type === GET_INSTITUTION_DYNAMIC_LIST) {
    return action.data
  } else {
    return previousState
  }
}

// 我的客户动态列表
const myDynamicList = (previousState = {data: []}, action) => {
  if (action.type === GET_MY_DYNAMIC_LIST) {
    return action.data
  } else {
    return previousState
  }
}

// 客户动态类型
const dynamicType = (previousState = {data:[]}, action) => {
  if (action.type === GET_DYNAMIC_TYPE) {
    return action.data
  } else {
    return previousState
  }
}

// 客户动态筛选条件对象
const dynamicFilter = (previousState = {}, action) => {
  if (action.type === DELIVER_DYNAMIC_FILTER) {
    return action.data
  } else {
    return previousState
  }
}


// 机构客户动态筛选条件对象
const institutionDynamicFilter = (previousState = {}, action) => {
  if (action.type === DELIVER_INSTITUTION_DYNAMIC_FILTER) {
    return action.data
  } else {
    return previousState
  }
}

// 我的客户动态筛选条件对象
const myDynamicFilter = (previousState = {}, action) => {
  if (action.type === DELIVER_MY_DYNAMIC_FILTER) {
    return action.data
  } else {
    return previousState
  }
}

const dynamicDetail = (previousState = {}, action) => {
  if (action.type === GET_DYNAMIC_DETAIL) {
    return action.data
  } else {
    return previousState
  }
}





// ======================= output ===============================
const customerDynamic = combineReducers({
  dynamicList,
  institutionDynamicList,
  myDynamicList,
  dynamicType,
  dynamicFilter,
  institutionDynamicFilter,
  myDynamicFilter,
  dynamicDetail,
})

export default customerDynamic
