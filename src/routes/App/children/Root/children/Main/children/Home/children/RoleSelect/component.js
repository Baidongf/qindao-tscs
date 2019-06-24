import React from 'react'
import './component.scss'
import Popup from 'components/Popup'

class RoleSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selfVisible: true,
      roles: [],
    }

    this.selectRoleHandler = this.selectRoleHandler.bind(this)
  }

  closePopup() {
    this.setState({
      selfVisible: false,
    })
  }

  selectRoleHandler(roleId, roleName, ev) {
    ev.stopPropagation()
    // this.props.selectRole(roleId, () => {
    //   this.props.getLoginUserInfo()
    //   this.props.setRole({
    //     roleId,
    //     roleName
    //   })
    //   localStorage.setItem('CURRENT_ROLE', JSON.stringify({roleId, roleName}))
    //   this.closePopup()
    // })
  }

  componentWillMount() {
/*    const roles = this.props.loginUserInfo.roles
   */
// fix bug :256
    if (true) {
      this.props.getLoginUserInfo((info) => {
        this.setState({roles: info.roles})
      })
    } else {
    //  this.setState({roles: roles})
    }
  }

  render() {

    const {visible} = this.props
    const {selfVisible, roles} = this.state
    let isVisible = visible && selfVisible

    return (
      <div className='role-select-component'>
        <Popup
          visible={isVisible}
          footer={null}
          keyboard={false}
          closable={false}
          title='请选择登录的角色'
          width='978px'
          bodyStyle={{
            padding: '35px 92px 70px 92px'
          }}
        >
          <div className={`select-area ${roles && roles.length > 2 ? 'more-than-two' : ''}`}>
            <div className='select-center-area'>

              {
                roles && roles.map((role) => {
                  return (
                    <div
                      key={role.id}
                      className='select-block'
                      onClick={this.selectRoleHandler.bind(this, role.id, role.name)}
                    >
                      {role.name}
                    </div>
                  )
                })
              }

            </div>
          </div>
        </Popup>
      </div>
    )
  }
}

export default RoleSelect
