import React from 'react'
import {Switch, withRouter, HashRouter} from 'react-router-dom'
import AuthRouter from 'components/AuthRouter'
import Home from './children/Home'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading'

const ReceiveActivity = Loadable({
  loader: () => import('./children/ReceiveActivity'),
  loading: RouteLoading
})

const CreateActivity = Loadable({
  loader: () => import('./children/CreateActivity'),
  loading: RouteLoading
})


class MarketingActivity extends React.Component {

  render() {
    const {match} = this.props

    return (
      <div className='MarketingActivity-component center-core-area'>
        <HashRouter className='MarketingActivity-component-router'>
          <Switch>
            <AuthRouter
              path={`${match.url}/home`}
              component={withRouter(Home)}
              permissionPath={['marketingCampaigns/queryCreater']}
            />
            <AuthRouter
              path={`${match.url}/receiveActivity`}
              component={withRouter(ReceiveActivity)}
              permissionPath={['marketingCampaigns/save','marketingCampaigns/details']}
            />
            <AuthRouter
              path={`${match.url}/createActivity`}
              component={withRouter(CreateActivity)}
              permissionPath={['marketingCampaigns/save','marketingCampaigns/details']}
            />
          </Switch>
        </HashRouter>
      </div>
    )
  }
}

export default MarketingActivity

