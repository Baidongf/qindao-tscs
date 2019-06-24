import React from 'react'

 /**
 * permission 为资源数组，按照范围排列，如['项目管理', '编辑']，需要按层级顺序排列
 * permission 支持最后一层为数组，为了满足当子元素全部没有权限隐藏时，包裹的父元素也需要隐藏的场景
 * role 扩展，需要根据角色来划分权限
 * 这个组件只支持隐藏，不支持置灰的场景，置灰的场景使用 withAuth 组件
 */

class AuthWrap extends React.Component {
  constructor(props){
    super(props)
    this.state={
      auth: true
    }
    this.authJudge = this.authJudge.bind(this)
  }

  authJudge(){
    let {loginAllResourceInfo, permission} = this.props
    let auth = false

    if (loginAllResourceInfo.length === 0){
      loginAllResourceInfo = (JSON.parse(window.localStorage.getItem('resource')) || {data: []}).data
    }


    // 主要逻辑
    if (permission && permission instanceof Array) {
      let length = -1
      permission = permission.filter(item => !!item)
      length = permission.length
      // 通过长度来验证权限
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
      d(loginAllResourceInfo, permission[0])
      auth = length === 0
    }
    this.setState({
      auth
    })
  }

  componentWillMount(){
    this.authJudge()
  }


  render(){
    const {children} = this.props
    return (<React.Fragment>
      {this.state.auth ? children : null}
    </React.Fragment>

    )
  }
}
export default AuthWrap
