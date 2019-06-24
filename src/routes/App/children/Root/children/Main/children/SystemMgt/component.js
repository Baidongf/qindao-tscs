import React from 'react'
import { Switch, withRouter, HashRouter } from 'react-router-dom'
import AuthRouter from 'components/AuthRouter'
import Home from './children/Home'
import OrgMgt from './children/OrgMgt'
import UserMgt from './children/UserMgt'
import ParamsMgt from './children/ParamsMgt/index'
import RoleMgt from './children/RoleMgt'

class SystemMgt extends React.Component {


  componentWillMount() {
    // 监听路由变化，若离开系统管理，则删掉 localStorage 中的 SYSTEM_MGT_TAB_KEY
    this.props.history.listen((location, action) => {
      const pathname = location.pathname
      if (pathname.indexOf('/root/main/systemMgt') === -1) {
        localStorage.removeItem('SYSTEM_MGT_TAB_KEY')
      }
    })
  }

  render() {
    const {match} = this.props

    return (
      <div className='systemMgt-component center-core-area'>
        <HashRouter className='systemMgt-component-router'>
          <Switch>
            <AuthRouter
              path={`${match.url}/home`}
              component={withRouter(Home)}
              permissionPath={['system']}
            />
            <AuthRouter
              path={`${match.url}/userMgt`}
              component={withRouter(UserMgt)}
              permissionPath={['user']}
            />
            <AuthRouter
              path={`${match.url}/orgMgt`}
              component={withRouter(OrgMgt)}
              permissionPath={['institution']}
            />
            <AuthRouter
              path={`${match.url}/paramsMgt`}
              component={withRouter(ParamsMgt)}
              permissionPath={['para']}
            />
            <AuthRouter
              path={`${match.url}/roleMgt`}
              component={withRouter(RoleMgt)}
              permissionPath={['roleResource']}
            />
          </Switch>
        </HashRouter>
      </div>
    )
  }
}

export default SystemMgt
