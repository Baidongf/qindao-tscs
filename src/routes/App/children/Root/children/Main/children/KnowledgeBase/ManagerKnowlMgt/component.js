import React from 'react'
import {Switch, withRouter, HashRouter} from 'react-router-dom'
import AuthRouter from 'components/AuthRouter/index.js'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading'

const Detail = Loadable({
  loader: () => import('./children/Detail'),
  loading: RouteLoading
})

const List = Loadable({
  loader: () => import('./children/List'),
  loading: RouteLoading
})

const CreateOrEdit = Loadable({
  loader: () => import('./children/CreateOrEdit'),
  loading: RouteLoading
})

class OrgMgt extends React.Component {

  render() {
    const {match} = this.props
    return (
      <div className='orgMgt-component center-core-area'>
        <HashRouter>
          <Switch>
            <AuthRouter path={`${match.url}/createOrEdit`} component={withRouter(CreateOrEdit)}
                        permissionPath={['knowledge/save']}
            ></AuthRouter>
            <AuthRouter path={`${match.url}/detail`} component={withRouter(Detail)}
                        permissionPath={['knowledge']}
            ></AuthRouter>
            <AuthRouter path={`${match.url}/home`} component={withRouter(List)}
                        permissionPath={['knowledge']}
            ></AuthRouter>
          </Switch>
        </HashRouter>
      </div>
    )
  }
}

export default OrgMgt
