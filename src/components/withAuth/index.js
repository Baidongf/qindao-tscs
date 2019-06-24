import React from 'react'

/**
 * permission 为资源数组，按照范围排列，如['项目管理', '编辑']，多层级也是一样的
 * permissiontype   禁止类型，置灰还是隐藏，默认隐藏，置灰传disabled，隐藏为hidden
 * role 扩展，只在某个角色层级才显示，不管分配
 */
// 处理无法使用组合组件
export function hzAuth(permission){
  return auth(permission)
}


function auth (permission){
  if (!permission || !(permission instanceof Array)){
    return true
  }
  let resource = JSON.parse(window.localStorage.getItem('resource')) || {data: []}
  let length = -1
  permission = permission.filter(item => !!item)
  length = permission.length

  function d(resource,  name) {

    // 需要满足同级多个权限的场景，目前的逻辑值允许最后一层是数组
    if (name instanceof Array) {
      let l = name.length
      name.forEach(i => {
        resource.map(item => {
          if (item.name === i) {
            l--
          }
        })
      })
      length = length - 1 + l
    }else {
      resource.map(item => {
        if (item.name === name) {
          length--
          if (item.sons && permission[permission.length - length]) {
            d(item.sons, permission[permission.length - length])
          }
        }
      })
    }
  }

  d(resource.data, permission[0])
  return length === 0
}


let wrapAuth = ComposedComponent =>class WrapComponent extends React.Component {
  // 构造
  constructor(props) {
    super(props);
  }
  render() {
    const {permissionType, permission} = this.props
    let flag = auth(permission)
    if (flag) {
      return <ComposedComponent  { ...this.props}  />;
    } else if (permissionType === 'disabled'){
      return <ComposedComponent  { ...this.props} disabled={true}/>
    } else {
      return null
    }
  }
};

export default wrapAuth

