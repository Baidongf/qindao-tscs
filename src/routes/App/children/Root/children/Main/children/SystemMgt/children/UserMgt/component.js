import React from 'react'
import { Switch , withRouter, HashRouter, Route  } from 'react-router-dom'
import CreateOrEdit from './children/CreateOrEdit'
import Detail from './children/Detail'
class UserMgt extends React.Component {
  componentDidMount() {
  }
  render () {
    const { match } = this.props
    return (
      <div className='usermgt-component'>
        <HashRouter>
          <Switch>
            <Route path={`${match.url}/createOrEdit`} component={withRouter(CreateOrEdit)}
                   permissionPath={['user/save']}
            ></Route>
            <Route path={`${match.url}/detail`} component={withRouter(Detail)}
                   permissionPath={['user/details']}
            ></Route>
          </Switch>
        </HashRouter>
      </div>
    )
  }
}

export default UserMgt
