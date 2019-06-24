import React from 'react'
import PropTypes from 'prop-types'
import './component.scss'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading/index'

import { Route, Switch, withRouter, HashRouter } from 'react-router-dom'

const Login = Loadable({
  loader: () => import('./children/Login/index'),
  loading: RouteLoading
})

const Main = Loadable({
  loader: () => import('./children/Main/index'),
  loading: RouteLoading
})

// const LoginAndRegistered = Loadable({
//   loader: () => import('./children/LoginAndRegistered/index'),
//   loading: RouteLoading
// })

class Root extends React.Component {

  // 声明需要使用的Context属性
  static contextTypes = {
    reduxStore: PropTypes.object
  }

  componentWillMount() {

  }

  render() {
    const { match } = this.props
    return (
      <div className='root-component'>
        {/*
          FIXME: 切换路由的时候会初始化header，导致权限接口重复调用
        */}
        <div className='root-component-router'>
          <HashRouter>
            <Switch>
              <Route path={`${match.url}/login`} component={withRouter(Login)}></Route>
              {/* <Route path={`${match.url}/LogAndReg`} component={withRouter(LoginAndRegistered)}></Route> */}
              <Route path={`${match.url}/main`} component={withRouter(Main)}></Route>
              
              <Route path={'/'} component={withRouter(Login)}></Route>
              {/* <Route path={'/'} component={withRouter(LoginAndRegistered)}></Route> */}
            </Switch>
          </HashRouter>
        </div>
      </div>
    )
  }
}

Root.propTypes = {
  children: PropTypes.node,
}

export default Root
