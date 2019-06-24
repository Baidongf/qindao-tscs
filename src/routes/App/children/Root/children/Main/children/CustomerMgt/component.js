import React from 'react'
import { Switch, withRouter, HashRouter } from 'react-router-dom'
import AuthRouter from 'components/AuthRouter/'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading/index'

const Home = Loadable({
  loader: () => import('./children/Home'),
  loading: RouteLoading,
})
const TagMgt = Loadable({
  loader: () => import('./children/TagMgt'),
  loading: RouteLoading,
})
const CustMgt = Loadable({
  loader: () => import('./children/CustMgt'),
  loading: RouteLoading,
})

class CustomerMgt extends React.Component {

  componentWillMount() {
    // 监听路由变化，若离开系统管理，则删掉 localStorage 中的 CUSTOMER_MGT_TAB_KEY
    this.props.history.listen((location, action) => {
      const pathname = location.pathname
      if (pathname.indexOf('/root/main/customerMgt') === -1) {
        localStorage.removeItem('CUSTOMER_MGT_TAB_KEY')
      }
    })
  }

  render() {
    const { match } = this.props

    return (
      <div className='customerMgt-component center-core-area'>
        <HashRouter className='customerMgt-component-router'>
          <Switch>
            <AuthRouter
              path={`${match.url}/home`}
              component={withRouter(Home)}
              permissionPath={['customer']}
            />
            <AuthRouter
              path={`${match.url}/custMgt`}
              component={withRouter(CustMgt)}
              permissionPath={['customer']}
            />
            <AuthRouter
              path={`${match.url}/tagMgt`}
              component={withRouter(TagMgt)}
              permissionPath={['tag']}
            />
          </Switch>
        </HashRouter>
      </div>
    )
  }
}

export default CustomerMgt
