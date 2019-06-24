import React from 'react'
import { Switch, HashRouter  } from 'react-router-dom'

class AccountMgt extends React.Component {
  componentDidMount() {
  }
  render () {

    return (
      <div className='orgMgt-component'>
          <HashRouter>
            <Switch>
            </Switch>
          </HashRouter>
      </div>
    )
  }
}

export default AccountMgt
