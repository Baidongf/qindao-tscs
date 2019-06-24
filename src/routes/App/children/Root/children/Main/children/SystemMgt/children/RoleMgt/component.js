import React from 'react'
import { Switch , withRouter, HashRouter  } from 'react-router-dom'
import AuthRouter from 'components/AuthRouter/index.js'
import CreateOrEdit from './children/CreateOrEdit'
import Detail from './children/Detail'

class RoleMgt extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render () {
    const { match } = this.props
    return (
      <div className='rolemgt-component'>
        <HashRouter>
          <Switch>
            <AuthRouter path={`${match.url}/createOrEdit`} component={withRouter(CreateOrEdit)}
                        permissionPath={['roleResource/save']}
            ></AuthRouter>
            <AuthRouter path={`${match.url}/detail/:roleId`} component={withRouter(Detail)}
                        permissionPath={['roleResource/details']}
            ></AuthRouter>
          </Switch>
        </HashRouter>
      </div>
    )
  }
}

export default RoleMgt
