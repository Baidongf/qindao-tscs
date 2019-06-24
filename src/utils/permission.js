export function checkPermission(url) {
  let flag = false
  let permissionArray
  try {
    permissionArray = JSON.parse(window.localStorage.getItem('_permission'))
  } catch (e) {
    return false
  }
  let step = (arr) => {
    arr.forEach(item => {
      if (typeof url === 'string') {
        if (item.url === url) {
          flag = true
        }
        item.subs && step(item.subs)
      } else if (Array.isArray(url)) {
        url.forEach(subUrl => {
          if (subUrl === item.url) {
            flag = true
          }
        })
        item.subs && step(item.subs)
      } else {
        throw new Error(`permissionPath配置必须是数组或字符串`)
      }
    })
  }
  step(permissionArray)
  return flag
}
