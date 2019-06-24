import React from 'react';
import Auth from 'components/Auth'
import {Route} from 'react-router-dom'

/**
 * @desc 实现背景：在<Switch>组件的内容区域，对<Route>用<Auth>组件进行包裹，
 *       如果Auth不配置<Route>组件的path和component属性（Auth配置没有必要）, 会导致非第一个Route失效，
 *       所以封装了AuthRouter，AuthRouter除了接收permissionPath之外，还接收<Route>组件需要的path和component属性
 */
class AuthRouter extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.location !== this.props.location
  }

  render() {
    const { permissionPath,noCheck } = this.props
    return (
      <Auth permissionPath={permissionPath} noCheck={noCheck}>
        <Route { ...this.props }></Route>
      </Auth>
    )
  }
}
export default AuthRouter
