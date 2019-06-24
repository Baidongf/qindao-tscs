import React from 'react'
import './component.scss'
// import { Switch, withRouter, HashRouter } from './node_modules/react-router-dom'
import { Route, Switch, withRouter, HashRouter } from 'react-router-dom'
import RouteLoading from 'components/RouteLoading/index'
import Loadable from 'react-loadable'
import Header from 'components/Header/container.js'
import AuthRouter from 'components/AuthRouter'

const Login = Loadable({
  loader: () => import('./children/Login/index'),
  loading: RouteLoading,
})
const Registered = Loadable({
  loader: () => import('./children/Registered/index'),
  loading: RouteLoading,
})

class LogAndReg extends React.Component {
  render() {
    const { match } = this.props

    return (
      <div className="main-component">
        <Header />
        <div className='main-component-router'>
          <HashRouter>
            {/* <Route path={`${match.url}/login`} component={withRouter(Login)}></Route> */}
            
            <Route path={`${match.url}/Login`} component={withRouter(Login)}></Route>
            <Route path={`${match.url}/Registered`} component={withRouter(Registered)}></Route>
            <Route path={'/'} component={withRouter(Login)}></Route>
            {/* <Switch>
              <AuthRouter
                path={`${match.url}/registered`}
                component={withRouter(Registered)}
                permissionPath={['registered']}
              />
            </Switch> */}
          </HashRouter>
        </div>
      </div>
    )
  }
}

export default LogAndReg
