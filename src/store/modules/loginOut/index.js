// import { hashHistory } from 'react-router'
import { combineReducers } from 'redux'
import { get, post } from 'utils/dataAccess/axios'

// ------------------------------------
// Constants
// ------------------------------------
const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'
const UPDATE_PASSWORD='UPDATE_PASSWORD'
// ------------------------------------
// Actions
// ------------------------------------
export const login = (data) => {
  // let formData = new FormData()

  // formData.append('name', data.name)
  // formData.append('password', data.password)
  let bodyData = {
    userNo: data.name,
    password: data.password,
    flag: '2'
  }
  const postConfig = {
    url: `/crm-fd/api/auth/login`,
    actionType: LOGIN,
    bodyData: bodyData,
    successConfig: {
      message: '登录成功',
      callback: (payload) => {
        localStorage.setItem('token', 'tempToken')
        if (payload) {
       /*   payload.userInfo = {
            "id": 2,
            "userNo": "admin",
            "name": "admin",
            "sex": "1",
            "institutionCode": "000000",
            "institutionName": "全行",
            "email": "2222",
            "phone": "111",
            "isCustomerManager": 0,
            "roleName": "超级管理员",
            "orgNo": "000000",
            "birthDt": "2018-10-09"
          }*/
          localStorage.setItem('currentUser', JSON.stringify(payload))
          window.location.href = '/#/root/main/home?isHome=true'
          // 将userId保存到页面隐藏的input元素，用以接口在调用时，检查是否切换了用户
          // document.querySelector('#userId').value = payload.userInfo.id
        }
      }
    },
    failConfig: {
      message: '登录失败'
    }
  }

  return post(postConfig)
}

export function logout () {

  return get({
    url: `/crm-fd/api/auth/logout`,
    actionType: LOGOUT,
  })
}

export function updatePassword(bodyData) {
  const postConfig = {
    url: `/crm-fd/api/auth/updatePassword`,
    bodyData: bodyData,
    successConfig: {
      message: '修改密码成功',
      callback: (payload) => {
      }
    },
    failConfig: {
      message: '修改密码失败'
    }
  }

  return post(postConfig)
}

export function loginUserInfo (previousState = {}, action) {
  if (action.type === LOGIN) {
    return action.data.payload || {}
  } else if (action.type === LOGOUT) {
    return {}
  } else {
    return previousState
  }
}

const loginOut = combineReducers({
  loginUserInfo
})
export default loginOut

