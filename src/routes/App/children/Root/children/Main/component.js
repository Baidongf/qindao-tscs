import React from 'react'
import './component.scss'
import { Switch, withRouter, HashRouter } from 'react-router-dom'
import AuthRouter from 'components/AuthRouter'
import Header from 'components/Header/container.js'

import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading/index'

const SystemMgt = Loadable({
  loader: () => import('./children/SystemMgt/index'),
  loading: RouteLoading,
})
const CustomerMgt = Loadable({
  loader: () => import('./children/CustomerMgt/index'),
  loading: RouteLoading,
})
const Home = Loadable({
  loader: () => import('./children/Home/index'),
  loading: RouteLoading,
})
const SearchResultPage = Loadable({
  loader: () => import('./children/Home/children/SearchResultPage'),
  loading: RouteLoading,
})
const PersonalInfo = Loadable({
  loader: () => import('./children/PersonalInfo/index'),
  loading: RouteLoading,
})
const ProjectReserve = Loadable({
  loader: () => import('./children/ProjectReserve/index'),
  loading: RouteLoading,
})
const ProjectMonitor = Loadable({
  loader: () => import('./children/ProjectMonitor/index'),
  loading: RouteLoading,
})
const Schedule = Loadable({
  loader: () => import('./children/Schedule/index'),
  loading: RouteLoading,
})
const OpportunityMgt = Loadable({
  loader: () => import('./children/OpportunityMgt/index'),
  loading: RouteLoading,
})
const MarketingActivity = Loadable({
  loader: () => import('./children/MarketingActivity/index'),
  loading: RouteLoading,
})
const CustomerDynamic = Loadable({
  loader: () => import('./children/CustomerDynamic/index'),
  loading: RouteLoading,
})
const ProductBase = Loadable({
  loader: () => import('./children/ProductBase/index'),
  loading: RouteLoading,
})
const MessageMgt = Loadable({
  loader: () => import('./children/MessageMgt/index'),
  loading: RouteLoading,
})
const CustomerKnowlMgt = Loadable({
  loader: () => import('./children/KnowledgeBase/CustomerKnowlMgt'),
  loading: RouteLoading,
})
// const ManagerKnowlMgt = Loadable({
//   loader: () => import('./children/KnowledgeBase/ManagerKnowlMgt'),
//   loading: RouteLoading,
// })
const MarkResult = Loadable({
  loader: () => import('./children/MarkResult'),
  loading: RouteLoading,
})

class Main extends React.Component {
  render() {
    const { match } = this.props

    return (
      <div className="main-component">
        <Header />
        <div className='main-component-router'>
          <HashRouter>
            <Switch>
              <AuthRouter
                path={`${match.url}/systemMgt`}
                component={withRouter(SystemMgt)}
                permissionPath={['system']}
              />
              <AuthRouter
                path={`${match.url}/opportunityMgt`}
                component={withRouter(OpportunityMgt)}
                permissionPath={['businessChance']}
              />
              <AuthRouter
                path={`${match.url}/marketingActivity`}
                component={withRouter(MarketingActivity)}
                permissionPath={['marketingCampaigns']}
              />
              <AuthRouter
                path={`${match.url}/customerMgt`}
                component={withRouter(CustomerMgt)}
                permissionPath={['customer']}
              />
              <AuthRouter
                path={`${match.url}/customerDynamic`}
                component={withRouter(CustomerDynamic)}
                permissionPath={['customerDynamic']}
              />
              <AuthRouter
                path={`${match.url}/personalInfo`}
                component={withRouter(PersonalInfo)}
                permissionPath={[]}
                noCheck={true}
              />
              <AuthRouter
                path={`${match.url}/home`}
                component={withRouter(Home)}
                noCheck={true}
              />
              <AuthRouter
                path={`${match.url}/projectReserve`}
                component={withRouter(ProjectReserve)}
                permissionPath={['projectStore','projectStore/userQuery']}
              />

              <AuthRouter
                path={`${match.url}/projectMonitor`}
                component={withRouter(ProjectMonitor)}
                permissionPath={['projectDetector']}
              />
              <AuthRouter
                path={`${match.url}/schedule`}
                component={withRouter(Schedule)}
                permissionPath={['workSchedule']}
              />

              <AuthRouter
                path={`${match.url}/searchResult`}
                component={withRouter(SearchResultPage)}
                permissionPath={[]}
                noCheck={true}
              />
              <AuthRouter
                path={`${match.url}/productBase`}
                component={withRouter(ProductBase)}
                permissionPath={['product']}
              />

              <AuthRouter
                path={`${match.url}/customerKnowlMgt`}
                component={withRouter(CustomerKnowlMgt)}
                permissionPath={['knowledge']}
              />

              {/*<AuthRouter*/}
              {/*  path={`${match.url}/managerKnowlMgt`}*/}
              {/*  component={withRouter(ManagerKnowlMgt)}*/}
              {/*  permissionPath={['knowledge']}*/}
              {/*/>*/}

              <AuthRouter
                path={`${match.url}/messageMgt`}
                component={withRouter(MessageMgt)}
                noCheck={true}
                permissionPath={[]}
              />

              <AuthRouter
                path={`${match.url}/markResult`}
                component={withRouter(MarkResult)}
                permissionPath={['marketingCampaignsReport']}
              />

              <AuthRouter
                path={`${match.url}/`}
                component={withRouter(Home)}
                permissionPath={[]}
              />
            </Switch>
          </HashRouter>
        </div>
      </div>
    )
  }
}

export default Main
