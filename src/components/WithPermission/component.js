import React, { Component } from 'react'

const getDisplayName = component => component.displayName || component.name || 'Component';
export default (data, path = '') => WrappedComponent => class HOC extends Component {
  static displayName = `(${getDisplayName(WrappedComponent)})`;

  juge = (permissionArray) => {
    let flag = false
    let url = path
    if (!url) {
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
    return flag
  }
  render() {
    return (
      <div>
        { this.juge(data) ? <WrappedComponent {...this.props} /> : null }
      </div>
     )
  }
}

