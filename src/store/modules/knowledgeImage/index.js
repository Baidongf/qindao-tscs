// import { hashHistory } from 'react-router'
import { message } from 'antd'
import { combineReducers } from 'redux'
import { get, post } from 'utils/dataAccess/axios'



export const standardAtlasExpand = (params,callBack) => { //挖掘关系

  const postConfig = {
    url:  `/crm-fd/api/search/gdb/standardAtlasExpand`,
    bodyData: params,
    successConfig: {
      callback: (payload) => {
        callBack&&callBack(payload)
      }
    },
    failConfig: {
    }
  }
  return post(postConfig)
}



const knowlMgt = combineReducers({

})
export default knowlMgt
