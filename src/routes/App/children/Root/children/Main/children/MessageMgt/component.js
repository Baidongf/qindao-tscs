import React from 'react'
import { Switch, withRouter, HashRouter } from 'react-router-dom'
import AuthRouter from 'components/AuthRouter'
import Home from './children/Home'


class SystemMgt extends React.Component {
  componentDidMount() {
  }

  render() {
    const { match } = this.props

    return (
      <div className='systemMgt-component center-core-area'>
        <HashRouter className='systemMgt-component-router'>
          <Switch>
            <AuthRouter
              path={`${match.url}/home`}
              component={withRouter(Home)}
              noCheck={true}
            />
          </Switch>
        </HashRouter>
      </div>
    )
  }
}

export default SystemMgt
