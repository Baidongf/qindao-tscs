### actionType、action方法和reducer方法的命名
1. actionType常量采用下划线命名法
2. action、reducer采用驼峰命名法，适当可使用下划线
3. actionType名称与action的名称，结构都动宾结构：‘V+N’
4. reducer方法的命名为action名去掉动词部分的宾语（名词）部分

以获取登录用户信息为例子：
```
// actionType常量
GET_LOGIN_USER_INFO = 'GET_LOGIN_USER_INFO'

// action方法
export function getLoginUserInfo () {
  ...
}

//reducer
export function loginUserInfo (previousState = {}, action) {
  if (action.type === GET_LOGIN_USER_INFO || action.type === LOGIN) {
    return action.data.userInfo || {}
  } else if (action.type === LOGOUT) {
    return {}
  } else {
    return previousState
  }
}
```
