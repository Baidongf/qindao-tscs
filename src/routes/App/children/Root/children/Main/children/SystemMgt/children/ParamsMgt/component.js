import React from 'react'
import { Switch, withRouter, HashRouter } from 'react-router-dom'
import AuthRouter from 'components/AuthRouter/index.js'
import CreateOrEdit from './children/CreateOrEdit'


class OrgMgt extends React.Component {
  componentDidMount() {
  }
  render() {
    const { match } = this.props
    console.log('match.url: ', match.url)
    return (
      <div className='orgMgt-component'>
        <HashRouter>
          <Switch>
            <AuthRouter
              path={`${match.url}/createOrEdit`}
              component={withRouter(CreateOrEdit)}
              permissionPath={['para/update']}
            />
          </Switch>
        </HashRouter>
      </div>
    )
  }
}

export default OrgMgt
