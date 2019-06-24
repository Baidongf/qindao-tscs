import React from 'react'
import { Switch, withRouter, HashRouter } from 'react-router-dom'
import AuthRouter from 'components/AuthRouter/index.js'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading/index'

const Detail = Loadable({
  loader: () => import('./children/Detail'),
  loading: RouteLoading,
})

const FinanceReportForm = Loadable({
  loader: () => import('./children/Detail/children/FinanceReportForm'),
  loading: RouteLoading
})


class CustMgt extends React.Component {
  render() {
    const { match } = this.props

    return (
      <div className='custMgt-component'>
        <HashRouter>
          <Switch>
            <AuthRouter exact
              path={`${match.url}/detail`}
              component={withRouter(Detail)}
              permissionPath={['customer']}
            ></AuthRouter>

            <AuthRouter exact
              path={`${match.url}/detail/financeReportForm`}
              component={withRouter(FinanceReportForm)}
              permissionPath={['customer']}
            ></AuthRouter>
          </Switch>
        </HashRouter>
      </div>
    )
  }
}

export default CustMgt
