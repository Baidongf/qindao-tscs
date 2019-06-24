import React from 'react'
import { Switch, withRouter, HashRouter } from 'react-router-dom'
import AuthRouter from 'components/AuthRouter'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading'

const Home = Loadable({
  loader: () => import('./children/Home'),
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

class ProjectReserve extends React.Component {

  render() {
    const { match } = this.props

    return (
      <div className='systemMgt-component center-core-area'>
        <HashRouter className='systemMgt-component-router'>
          <Switch>
            <AuthRouter
              path={`${match.url}/home`}
              component={withRouter(Home)}
              permissionPath={['projectStore/query']}
            />
            <AuthRouter
              path={`${match.url}/createOrEdit`}
              component={withRouter(CreateOrEdit)}
              permissionPath={['projectStore/save']}
            />
            <AuthRouter
              path={`${match.url}/detail`}
              component={withRouter(Detail)}
              permissionPath={['projectStore/details']}
            />
          </Switch>
        </HashRouter>
      </div>
    )
  }
}

export default ProjectReserve
