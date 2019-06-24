import React from 'react'
import { Switch, withRouter, HashRouter } from 'react-router-dom'
import AuthRouter from 'components/AuthRouter'

import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading'

const Home = Loadable({
  loader: () => import('./children/Home'),
  loading: RouteLoading,
})

const Detail = Loadable({
  loader: () => import('./children/Detail'),
  loading: RouteLoading,
})

const CommonDetail = Loadable({
  loader: () => import('./children/CommonDetail'),
  loading: RouteLoading,
})

const CreateOrEdit = Loadable({
  loader: () => import('./children/CreateOrEdit'),
  loading: RouteLoading,
})

const AddFollowRecord = Loadable({
  loader: () => import('./children/AddFollowRecord'),
  loading: RouteLoading,
})

class OpportunityMgt extends React.Component {

  componentWillMount() {
    // 监听路由变化，若离开系统管理，则删掉 localStorage 中的 SYSTEM_MGT_TAB_KEY
    this.props.history.listen((location, action) => {
      const pathname = location.pathname
      if (pathname.indexOf('/root/main/opportunityMgt') === -1) {
        localStorage.removeItem('OPPORTUNITY_MGT_TAB_KEY')
      }
    })
  }

  render() {
    const { match } = this.props

    return (
      <div className='opportunityMgt-component center-core-area'>
        <HashRouter className='opportunityMgt-component-router'>
          <Switch>

            <AuthRouter
              exact
              path={`${match.url}/home`}
              component={withRouter(Home)}
              permissionPath={['businessChance']}
            />

            <AuthRouter
              exact
              path={`${match.url}/home/detail`}
              component={withRouter(Detail)}
              permissionPath={['businessChance/details']}
            />

            <AuthRouter
              exact
              path={`${match.url}/home/commonDetail`}
              component={withRouter(CommonDetail)}
              permissionPath={['businessChance/details']}
            />

            <AuthRouter
              exact
              path={`${match.url}/home/createOrEdit`}
              component={withRouter(CreateOrEdit)}
              permissionPath={['businessChance/save']}
            />

            <AuthRouter
              exact
              path={`${match.url}/home/addFollowRecord`}
              component={withRouter(AddFollowRecord)}
              permissionPath={['businessChanceFollowRecord']}
            />

          </Switch>
        </HashRouter>
      </div>
    )
  }
}

export default OpportunityMgt

