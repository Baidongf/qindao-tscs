import { BIG_DATA_ADDRESS } from '../config'

/**
 * 通用权限验证 fetch 函数
 * @param {String} url url
 * @param {Object} params params
 * @return {Object} fetch data promise
 */
export function authorizedFetch (url, params = {}) {
  // 在 http 头中带上 cookie 需要设置这个参数
  params.credentials = 'include'

  const token = localStorage.getItem('token') || getCookieItem('access_token')
  if (token) {
    if (params.headers) {
      params.headers.has('Authorization') ? params.headers.set('Authorization', 'Bearer ' + token)
        : params.headers.append('Authorization', 'Bearer ' + token)
    } else {
      params.headers = new Headers({
        'Authorization': 'Bearer ' + token
      })
    }
  }
  if (params.headers && !params.headers.has('Content-Type')) {
    params.headers.set('Content-Type', 'application/json')
  }

  return fetch(url, params)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.status)
      }
      return response
    }).then((response) => {
      return response.json()
    }).catch((e) => {
      // 如果未登录，跳转至 big_data 页面
      if (e.message === '403') {
        /*
        * TODO: 上线时放开
        * */
        // console.warn('未登录')
     //  window.location.href = BIG_DATA_ADDRESS
      }
      return Error(e)
    })
}

function getCookieItem (key) {
  if (!key) { return null }
  return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' +
    encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null
}

export function downloadFile (config) {
  config = Object.assign({
    type: 'POST',
    url: '/api/download_csv',
    fileType: 'csv'
  }, config)

  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const a = document.createElement('a')
      a.href = window.URL.createObjectURL(xhr.response)
      a.download = config.data.filename + '.' + config.fileType
      if (navigator.msSaveBlob) { // 兼容 IE
        navigator.msSaveBlob(xhr.response, a.download)
      } else {
        a.click()
      }
    }
  }
  xhr.open(config.type, config.url)
  xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
  xhr.responseType = 'blob'
  xhr.send(JSON.stringify(config.data))
}
