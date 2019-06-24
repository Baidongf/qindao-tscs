import { message } from 'antd'
// import { hashHistory } from 'react-router'

const TIPS_DURATION = 2
const TIPS_INTERFACE_ERROR = '接口获取数据失败，详情请查看控制台'

/**
 *
 * @desc get、post、drop等请求的response的通用处理器
 *
 * @param data { PlainObject } 后端返回的reponse, 格式为：
 *   {
      "payload": {...},
      "errorMsg":
      { "errorCode": null, "errorMsg": "用户未登录" },
      "msgId": 1515567900129,
      "status": 10004,
      "properties": null
    }
 *
 *
*/
const responseHandler = (dispatch, data, actionType, actionDataKey,  extendData = {}, successMsg, failMsg, successCallback, failCallback) => {

  // 处理成功
  if (data.status === 0) {
    if (data.payload && typeof payload =='object') {
      data.payload.extendData = extendData
    }
    dispatch({
      type: actionType,
      [actionDataKey]: data.payload
    })

    if (successMsg) {
      message.success(successMsg, TIPS_DURATION)
    }
    if (successCallback) {
      successCallback(data.payload)
    }
  } else if (data.status === 10000) {
    message.error(data.errorMsg.errorMsg, TIPS_DURATION)
    // 这里获取不到state。。。。
    //pushState(state, pathname, query)
    window.location.href = "/"
  } else if (data.status === 10004) { // token超时
    message.error(data.errorMsg.errorMsg, TIPS_DURATION)
    window.location.href = "/"
  } else { // 其它异常处理

    // 如果后端接口有返回错误提示语，则优先显示
    if (data.errorMsg.errorMsg){
      if(data.errorMsg.errorMsg == "服务器内部错误"){
        message.error(failMsg, TIPS_DURATION)
      }
      else{
        message.error(data.errorMsg.errorMsg, TIPS_DURATION)
      }
    }
    else if (failMsg) { // 显示自定义错误提示语
      message.error(failMsg, TIPS_DURATION)
    } else { // 显示默认提示语
      message.error(TIPS_INTERFACE_ERROR, TIPS_DURATION)
    }

    // 执行自定义的failCallback
    if (failCallback) {
      failCallback(data.payload)
    }
  }
}

/**
 * @desc 用于判断是否切换登录
 *
*/
const loginUserIsChanged = (url) => {
  const currentUser = JSON.parse(window.localStorage.getItem('currentUser') || '{}')
  const userIdInput = document.querySelector('#userId')
  let userId = userIdInput.value

  // excludeUrls包含不需要登录就可以访问的接口
  const excludeUrls = ['/api/account/login']
  if (!excludeUrls.includes(url)) {
    if (currentUser.id && (currentUser.id != userId)) {
      document.querySelector('#userId').value = currentUser.id
      // hashHistory.push('/main')
      message.error('账号已重新登录，重新刷新页面', TIPS_DURATION)
      setTimeout(()=>{
        window.location.reload()
      }, 2500)
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

export const get = (url, actionType, actionDataKey = 'data',  extendData = {}, successMsg, failMsg, successCallback, failCallback) => {
  // if (loginUserIsChanged(url)) return
  return (dispatch) => {
        return fetch(url, {
            method: 'GET',
            // credentials: 'include'
            credentials: 'same-origin'
        }).then(res => {
            return res.json()
        }).then(data => {
          responseHandler(dispatch, data, actionType, actionDataKey,  extendData, successMsg, failMsg, successCallback, failCallback)
        }).catch(err => {

          console.log(err)
          message.error(TIPS_INTERFACE_ERROR, TIPS_DURATION)
          // message.error(err, TIPS_DURATION)
        })
    }
  }

export const drop = (url, actionType, actionDataKey = 'data',  extendData = {}, successMsg, failMsg, successCallback, failCallback) => {
  // if (loginUserIsChanged(url)) return
  return (dispatch) => {
      return fetch(url, {
          method: 'DELETE',
          // credentials: 'include'
          credentials: 'same-origin'
      }).then(res => {
          return res.json()
      }).then(data => {
        responseHandler(dispatch, data, actionType, actionDataKey,  extendData, successMsg, failMsg, successCallback, failCallback)
      }).catch(err => {

        console.log(err)
        message.error(TIPS_INTERFACE_ERROR, TIPS_DURATION)
        // message.error(err, TIPS_DURATION)
      })
  }
}

export const post = (url, bodyData, actionType, actionDataKey = 'data', extendData = {}, successMsg, failMsg, successCallback, failCallback) => {
  // if (loginUserIsChanged(url)) return
  return (dispatch) => {

      let contentType = ''
      if (!(bodyData instanceof FormData)) {
        bodyData = JSON.stringify(bodyData)
        contentType = 'application/json'
      } else if (bodyData instanceof FormData) {
        contentType = 'application/x-www-form-urlencoded'
        bodyData = [...bodyData.entries()].map((d) => `${d[0]}=${d[1]}`)
        bodyData = bodyData.join('&')
      }
      return fetch(url, {
          method: 'POST',
          // credentials: 'include',
          credentials: 'same-origin',
          headers: contentType?new Headers({'content-type': contentType}):{},
          body: bodyData,
      }).then(res => {
          return res.json()
      }).then(data => {
        responseHandler(dispatch, data, actionType, actionDataKey,  extendData, successMsg, failMsg, successCallback, failCallback)
      }).catch(err => {
        console.log('catch error'+ err)
        message.error(TIPS_INTERFACE_ERROR, TIPS_DURATION)
      })
  }
}
