import React from 'react'
import { Switch , withRouter, HashRouter  } from 'react-router-dom'
import AuthRouter from 'components/AuthRouter/index.js'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading'
const Home = Loadable({
  loader: () => import('./Home'),
  loading: RouteLoading
})

const Detail = Loadable({
  loader: () => import('./children/Detail'),
  loading: RouteLoading
})
const CreateOrEdit = Loadable({
  loader: () => import('../ManagerKnowlMgt/children/CreateOrEdit'),
  loading: RouteLoading
})

const ManagerDetail = Loadable({
  loader: () => import('../ManagerKnowlMgt/children/Detail'),
  loading: RouteLoading
})

class OrgMgt extends React.Component {

  render () {
    const { match } = this.props
    return (
      <div className='center-core-area orgMgt-component'>
        <HashRouter>
          <Switch>
            <AuthRouter path={`${match.url}/detail`} component={withRouter(Detail)}
                        permissionPath={['knowledge']}
            ></AuthRouter>
            <AuthRouter path={`${match.url}/home`} component={withRouter(Home)}
                        permissionPath={['knowledge']}
            ></AuthRouter>
            <AuthRouter path={`${match.url}/createOrEdit`} component={withRouter(CreateOrEdit)}
                        permissionPath={['knowledge/save']}
            ></AuthRouter>
            <AuthRouter path={`${match.url}/managerdetail`} component={withRouter(ManagerDetail)}
                        permissionPath={['knowledge']}
            ></AuthRouter>
          </Switch>
        </HashRouter>
      </div>

    )
  }
}

export default OrgMgt
