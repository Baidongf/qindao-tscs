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

class ReceiveAct extends React.Component {
  componentDidMount() {
  }
  render() {
    const { match } = this.props

    return (
      <div className='orgMgt-component'>
        <HashRouter>
          <Switch>
            <AuthRouter path={`${match.url}/createOrEdit`} component={withRouter(CreateOrEdit)}></AuthRouter>
            <AuthRouter noCheck={true} path={`${match.url}/detail`} component={withRouter(Detail)}></AuthRouter>
          </Switch>
        </HashRouter>
      </div>
    )
  }
}

export default ReceiveAct
