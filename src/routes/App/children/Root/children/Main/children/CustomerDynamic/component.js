import React from 'react'
import { Switch , withRouter, HashRouter  } from 'react-router-dom'
import AuthRouter from 'components/AuthRouter/'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading/index'


const Home = Loadable({
  loader: () => import('./children/Home'),
  loading: RouteLoading,
})

const Detail = Loadable({
  loader: () => import('./children/Detail'),
  loading: RouteLoading,
})

class CustomerDynamic extends React.Component {

  componentWillMount() {
    // 监听路由变化，若离开客户动态模块，则删掉 localStorage 中的 DYNAMIC_MGT_TAB_KEY
    this.props.history.listen((location, action) => {
      const pathname = location.pathname
      if (pathname.indexOf('/root/main/customerDynamic') === -1) {
        localStorage.removeItem('DYNAMIC_MGT_TAB_KEY')
      }
    })
  }

  render() {
    const { match } = this.props
    return (
      <div className='customer-dynamic-component center-core-area'>
        <HashRouter>
          <Switch>
            <AuthRouter
              path={`${match.url}/home`}
              component={withRouter(Home)}
              permissionPath={['customerDynamic/query']}
              noCheck={true}
            />

            <AuthRouter
              path={`${match.url}/detail`}
              component={withRouter(Detail)}
              permissionPath={['customerDynamic/details']}
            />
          </Switch>
        </HashRouter>
      </div>
    )
  }
}

export default CustomerDynamic
