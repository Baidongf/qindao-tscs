import {message} from 'antd'
import {hashHistory, Redirect} from 'react-router'
import axios from 'axios'
import {isNullOrUndefined} from 'utils/common.js'
import {code} from 'config/const'

const TIPS_DURATION = 2
const TIPS_INTERFACE_ERROR = '接口获取数据失败，详情请查看控制台'

const isPlainObject = require('is-plain-object')

message.config({
  top: 55
})

axios.interceptors.response.use(function (response) {
  return response
}, function (error) {

  // error包含3个字段，分别为config、request和reponse，仅response有用
  return Promise.reject(error.response)
})

const DEFAULT_CONFIG = {
  url: '',
  method: 'get',
  timeout: 10000,
  bodyData: {},
  actionType: '',
  actionDataKey: 'data',
  contentType: 'application/json',
  responseType: 'json',
  extendData: {},
  successConfig: null, // {message: '', callback: function, isForceShow: false}
  failConfig: null // {message: '', callback: function, isForceShow: false}
}

const formatPayload = (responseData) => {
  if (!isPlainObject(responseData.payload)) {
    if (responseData.payload !== null && responseData.payload !== undefined) {
      responseData.payload = {

        // 如果payload不是{}对象，都被认为是丑陋的数据，封装到payload中
        uglyData: responseData.payload
      }
    } else {
      responseData.payload = {}
    }
  }

  /* if (isPlainObject(responseData.payload.data) && Object.keys(responseData.payload).length === 1) {
     responseData.payload = responseData.payload.data
   }*/
  if (isPlainObject(responseData.payload.data)) {
    responseData.payload = responseData.payload.data
  }
}
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
const responseHandler = (dispatch, config) => {
  formatPayload(config.responseData)

  // 后端返回的结果数据和前端发起请求时的额外数据，都会通过payload发给请求处理完毕的回调函数
  config.responseData.payload.extendData = config.extendData

  if (config.responseData.success === true) { // 处理成功： 200

    if (config.actionType) {
      dispatch({
        type: config.actionType,
        [config.actionDataKey]: config.responseData.payload
      })
    }
    if (config.successConfig) {
      if (config.successConfig.message) {
        message.success(config.successConfig.message, TIPS_DURATION)
      }
      if (config.successConfig.callback) {
        config.successConfig.callback(config.responseData.payload)
      }
    }
  } else { // 其它异常处理: 404、500等
    if (
      config.responseData.message &&
      config.responseData.message.code === code.UNLOGIN
    ) { //未登录，登录超时,跳转登录
      window.location.href = '/'
    }

    if (!config.responseData.message) {
      config.responseData.message = {}
    }
    let errorMsg = config.responseData.message || config.responseData.message.desc
    if (typeof errorMsg === 'object') {
      errorMsg = errorMsg.desc
    }
    if (errorMsg) {
      if (config.failConfig && config.failConfig.isForceShow) { // 判断是否强制执行前端自定义错误提示信息
        if (config.failConfig.message) {
          message.error(config.failConfig.message, TIPS_DURATION)
        }
      } else {
        message.error(errorMsg, TIPS_DURATION)
      }
    } else { // 如果后端没有默认的错误信息，则执行前端自定义错误提示信息
      if (config.failConfig) {
        if (config.failConfig.message) {
          // message.error(config.failConfig.message, TIPS_DURATION)
        }
      }
    }

    // 执行自定义的failCallback
    if (config.failConfig) {
      if (config.failConfig.callback) {
        config.failConfig.callback(config.responseData.payload)
      }
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
      setTimeout(() => {
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


export const axiosHandler = (config) => {
  // if (loginUserIsChanged(url)) return

  config = Object.assign({}, DEFAULT_CONFIG, config)
  return (dispatch) => {

    let axiosConfig = {
      url: config.url,
      method: config.method,
      responseType: config.responseType,
    }
    if (config.method.toLowerCase() === 'post') {
      let contentType = config.contentType
      // if (!(config.bodyData instanceof FormData)) {
      //   contentType = 'application/json'
      // } else if (config.bodyData instanceof FormData && config.contentType === 'multipart/form-data') {
      //   contentType = 'multipart/form-data'
      // } else if (config.bodyData instanceof FormData) {
      //   contentType = 'application/x-www-form-urlencoded'
      //   config.bodyData = [...config.bodyData.entries()].map((d) => `${d[0]}=${d[1]}`)
      //   config.bodyData = config.bodyData.join('&')
      // }

      axiosConfig = Object.assign(axiosConfig, {
        headers: contentType ? {'content-type': contentType} : {},
        data: config.bodyData
      })
    }

    return axios(axiosConfig).then(response => { // 200
      config.responseData = response.data
      responseHandler(dispatch, config)
    }).catch(response => { // 404, 500等，一些非http请求错误也会被捕获到
      if (response.status === 500) { //500统一拦截
        message.error(
          response.request.response ? (response.request.response.message && (response.request.response.message.indexOf('，') ? response.request.response.message.split('，')[0] : response.request.response.message)) : 'Internal Server Error',
          TIPS_DURATION
        )
        return
      }
      response = response ? response : {}
      config.responseData = response.data = {}
      responseHandler(dispatch, config)
    })
  }
}

export const get = (config) => {
  config.method = 'GET'
  return axiosHandler(config)
}

export const drop = (config) => {
  config.method = 'DELETE'
  return axiosHandler(config)
}

export const post = (config) => {
  config.method = 'POST'
  return axiosHandler(config)
}

export const fetchData = (config) =>{
  return axios(Object.assign({}, DEFAULT_CONFIG, config))
}
