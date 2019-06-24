import { combineReducers } from 'redux'
import { get, post,drop } from 'utils/dataAccess/axios'

const GET_PROJECT_RESERVE_LIST = 'GET_PROJECT_RESERVE_LIST'
const GET_QUERY_ENUM = 'GET_QUERY_ENUM'
const DEL_PROJECT_RESERVE = 'DEL_PROJECT_RESERVE'

export const delProjectReserve = (id,callback) => {
  const postConfig = {
    url: `/crm-fd/api/projectStore/delete/${id}`,
    actionType: DEL_PROJECT_RESERVE,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
  }
  return drop(postConfig)
}

export const getQueryEnum = (filterObj = {}) => {

  const postConfig = {
    url: `/crm-fd/api/projectStore/queryEnum`,
    actionType: GET_QUERY_ENUM,
    bodyData: filterObj,
    successConfig: {
      callback: (payload) => {
      }
    },

  }
  return post(postConfig)
}

export const getProjectReserveList = (filterObj = {}) => {

  const postConfig = {
    url: `/crm-fd/api/projectStore/query`,
    actionType: GET_PROJECT_RESERVE_LIST,
    bodyData: filterObj,
    successConfig: {
      callback: (payload) => {
      }
    },

  }
  return post(postConfig)
}

export const getOneDetail = (id, callback) => {

  const postConfig = {
    url: `/crm-fd/api/projectStore/details/${id}`,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },

  }
  return get(postConfig)
}

export const getTwoDetail = (id, callback) => {

  const postConfig = {
    url: `/crm-fd/api/projectStore/details/baseInfo/${id}`,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)

      }
    },

  }
  return get(postConfig)
}

export const getThreeDetail = (id, callback) => {

  const postConfig = {
    url: `/crm-fd/api/projectStore/details/topic/${id}`,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)

      }
    },

  }
  return get(postConfig)
}

export const getFourDetail = (id, callback) => {

  const postConfig = {
    url: `/crm-fd/api/projectStore/details/boost/${id}`,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)

      }
    },

  }
  return get(postConfig)
}

export const getFiveDetail = (id, callback) => {

  const postConfig = {
    url: `/crm-fd/api/projectStore/details/desc/${id}`,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)

      }
    },

  }
  return get(postConfig)
}


export const saveOneDetail = (obj = {}, callback) => {

  const postConfig = {
    url: `/crm-fd/api/projectStore/save`,
    bodyData: obj,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },

  }
  return post(postConfig)
}

export const saveTwoDetail = (obj = {}, callback) => {

  const postConfig = {
    url: `/crm-fd/api/projectStore/saveBaseInfo`,
    bodyData: obj,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },

  }
  return post(postConfig)
}

export const saveThreeDetail = (obj = {}, callback) => {

  const postConfig = {
    url: `/crm-fd/api/projectStore/saveStoreTopic`,
    bodyData: obj,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
  }
  return post(postConfig)
}

export const saveFourDetail = (obj = {}, callback) => {

  const postConfig = {
    url: `/crm-fd/api/projectStore/saveBoost`,
    bodyData: obj,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
  }
  return post(postConfig)
}

export const saveFiveDetail = (obj = {}, callback) => {

  const postConfig = {
    url: `/crm-fd/api/projectStore/saveDesc`,
    bodyData: obj,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
  }
  return post(postConfig)
}




export const updateOneDetail = (obj = {}, callback) => {

  const postConfig = {
    url: `/crm-fd/api/projectStore/update`,
    bodyData: obj,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },

  }
  return post(postConfig)
}

export const updateTwoDetail = (obj = {}, callback) => {

  const postConfig = {
    url: `/crm-fd/api/projectStore/updateBaseInfo`,
    bodyData: obj,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },

  }
  return post(postConfig)
}

export const updateThreeDetail = (obj = {}, callback) => {

  const postConfig = {
    url: `/crm-fd/api/projectStore/updateStoreTopic`,
    bodyData: obj,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
  }
  return post(postConfig)
}

export const updateFourDetail = (obj = {}, callback) => {

  const postConfig = {
    url: `/crm-fd/api/projectStore/updateBoost`,
    bodyData: obj,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
  }
  return post(postConfig)
}

export const updateFiveDetail = (obj = {}, callback) => {

  const postConfig = {
    url: `/crm-fd/api/projectStore/updateDesc`,
    bodyData: obj,
    successConfig: {
      callback: (payload) => {
        callback && callback(payload)
      }
    },
  }
  return post(postConfig)
}



export function projectReserveList(previousState = { data: [] }, action) {
  if (action.type === GET_PROJECT_RESERVE_LIST) {
    return action.data
  } else {
    return previousState
  }
}


export function queryEnum(previousState = { data: [] }, action) {
  if (action.type === GET_QUERY_ENUM) {
    return action.data
  } else {
    return previousState
  }
}

const prodMgt = combineReducers({
  projectReserveList,
  queryEnum
})
export default prodMgt
