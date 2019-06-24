import React from 'react'
import {Switch, withRouter, HashRouter} from 'react-router-dom'
import AuthRouter from 'components/AuthRouter/index.js'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading'

const CustomerInsert = Loadable({
  loader: () => import('./children/CustomerInsert'),
  loading: RouteLoading
})

const CreateOrEdit = Loadable({
  loader: () => import('./children/CreateOrEdit'),
  loading: RouteLoading
})

const Detail = Loadable({
  loader: () => import('./children/Detail'),
  loading: RouteLoading
})

const Home = Loadable({
  loader: () => import('./children/Home'),
  loading: RouteLoading
})


class ProjectMonitor extends React.Component {

  render() {
    const {match} = this.props

    return (
      <div className='projectMgt-component systemMgt-component center-core-area'>
        <HashRouter>
          <Switch>
            <AuthRouter path={`${match.url}/customerInsert`}
                        component={withRouter(CustomerInsert)}
                        permissionPath={['projectDetector/save']}
            ></AuthRouter>
            <AuthRouter path={`${match.url}/createOrEdit`}
                        component={withRouter(CreateOrEdit)}
                        permissionPath={['projectDetector/save']}
            ></AuthRouter>
            <AuthRouter
              path={`${match.url}/detail`}
              component={withRouter(Detail)}
              permissionPath={['projectDetector/details']}
            ></AuthRouter>
            <AuthRouter path={`${match.url}/home`}
                        component={withRouter(Home)}
                        permissionPath={['projectDetector/query']}
            ></AuthRouter>
          </Switch>
        </HashRouter>
      </div>
    )
  }
}

export default ProjectMonitor
