import React from 'react'
import { Switch , withRouter, HashRouter  } from 'react-router-dom'
import AuthRouter from 'components/AuthRouter/index.js'
import CreateOrEdit from './children/CreateOrEdit'
import Detail from './children/Detail'
// import Detail from './children/Detail'
class TagMgt extends React.Component {
  componentDidMount() {
  }
  render () {
    const { match } = this.props

    return (
      <div className='tagMgt-component'>
          <HashRouter>
            <Switch>
              <AuthRouter path={`${match.url}/createOrEdit`} component={withRouter(CreateOrEdit)}   permissionPath={['tag/save']}></AuthRouter>
              <AuthRouter path={`${match.url}/detail`} component={withRouter(Detail)} permissionPath={['tag/details']}></AuthRouter>
            </Switch>
          </HashRouter>
      </div>
    )
  }
}

export default TagMgt
