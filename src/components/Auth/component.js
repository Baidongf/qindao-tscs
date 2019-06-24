import React from 'react'
import './component.scss'

class Auth extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      hasPermission: true
    }

    // 调试字段，为true时表示取消权限控制
    this.cancelPermission = false

  }

  juge = (permissionArray) => {

    let flag = false
    let url = this.props.permissionPath
    if (this.props.noCheck) {
      this.setState({
        hasPermission: true
      })
      return
    }
    if (url == null || url == undefined) {
      this.setState({
        hasPermission: false
      })
      return
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
    this.setState({
      hasPermission: flag
    })
  }

  componentWillMount() {
    this.juge(this.props.userPermission.data)
  }

  componentWillReceiveProps({userPermission}) {
    if (userPermission.data.length !== this.props.userPermission.data.length) {
      this.juge(userPermission.data)
    }
  }


  render() {
    let {children, noCheck, showNoPermission, noPermission} = this.props
    let {hasPermission} = this.state
    noPermission = noPermission || (<div className="noPermission">没有查看该模块的权限</div>)
    return (
      hasPermission || this.cancelPermission || noCheck ?
        children
        // : showNoPermission ? noPermission : null
        :noPermission
    )
  }
}

export default Auth
