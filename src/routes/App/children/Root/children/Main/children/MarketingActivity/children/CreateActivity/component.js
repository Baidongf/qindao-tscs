import React from 'react'
import { Switch, withRouter, HashRouter } from 'react-router-dom'
import AuthRouter from 'components/AuthRouter/index.js'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading'

const CreateOrEdit = Loadable({
  loader: () => import('../Home/children/CreateOrEdit'),
  loading: RouteLoading
})

const Detail = Loadable({
  loader: () => import('../Home/children/Detail'),
  loading: RouteLoading
})


class CreateAct extends React.Component {

  render() {
    const { match } = this.props

    return (
      <div className='orgMgt-component'>
        <HashRouter>
          <Switch>

            <AuthRouter path={`${match.url}/createOrEdit`}
              component={withRouter(CreateOrEdit)}
              permissionPath={['marketingCampaigns/save']}
            />

            <AuthRouter path={`${match.url}/detail`}
              component={withRouter(Detail)}
              permissionPath={['marketingCampaigns/details']}
            />
          </Switch>
        </HashRouter>
      </div>
    )
  }
}

export default CreateAct
