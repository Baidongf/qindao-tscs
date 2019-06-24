import React from 'react'
import './component.scss'
import Search from './children/Search'
import Recent from './children/Recent'
import Panel from './children/Panel'
import CustomButton from './children/CustomButton'
import RoleSelect from './children/RoleSelect'
import emptyPic from './images/empty.png'
import { message, Icon } from 'antd'


/**
 * Home
 * @desc 首页
 */
class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      roles: [], // 登录用户拥有的所有角色
      roleSelectVisible: false,
    }
    this.panels = [
      {
        title: '客户信息',
        moreLinkHref: '/root/main/customerMgt/home',
        contentType: 0,
        resourceId: 24,
      }, {
        title: '客户动态',
        moreLinkHref: '/root/main/customerDynamic/home',
        contentType: 1,
        resourceId: 48,
      }, {
        title: '商机管理',
        moreLinkHref: '/root/main/opportunityMgt/home',
        contentType: 2,
        resourceId: 56,
      }, {
        title: '工作日程',
        moreLinkHref: '/root/main/schedule/home',
        contentType: 3,
        resourceId: 47,
      }, {
        title: '营销活动',
        moreLinkHref: '/root/main/marketingActivity/home',
        contentType: 4,
        resourceId: 62,
      }, {
        title: '知识库',
        moreLinkHref: '/root/main/customerKnowlMgt/home',
        contentType: 5,
        resourceId: 85,
      }, {
        title: '营销成果',
        moreLinkHref: '/root/main/markResult',
        contentType: 6,
        resourceId: 76,
      },
    ]

    this.goBackPageTop = this.goBackPageTop.bind(this)
  }

  componentWillMount() {
    this.props.getHomeModules()
    this.props.getRecentBrowse()
  }

  handleUserRoles() {
    // 检测当前用户拥有的角色
    // 0. 在 localStorage 中检测是否存在（首页手动刷新的场景）,若存在，自动选择
    // 1. 用户是否已经选择角色，若选择过，则 do nothing
    // 2. 如果只有一个角色，默认选择该角色
    // 3. 如果有一个或一个以上的角色，显示角色选择框

    const localRole = localStorage.getItem('CURRENT_ROLE')
    if (localRole) {
      let role = JSON.parse(localRole)
      this.props.selectRole(role.roleId, () => {
        this.props.getLoginUserInfo()
        this.props.setRole({ ...role })
      })
      return false
    }

    const currentRole = this.props.currentRole
    if (Object.keys(currentRole).length === 0) {
      this.props.getLoginUserInfo((info) => {
        const roles = info.roles
        if (roles.length === 0) {
          message.error('当前用户没有角色')
          console.log('从接口中读取的角色数组为:')
          console.log(roles)
        } else if (roles.length === 1) {
          console.log('只有一个角色，后端直接选择')
          this.props.setRole({
            roleId: roles[0].id,
            roleName: roles[0].name
          })
          localStorage.setItem('CURRENT_ROLE', JSON.stringify({
            roleId: roles[0].id,
            roleName: roles[0].name
          }))
          // 如果用户只有一个角色 直接选择这个角色
          // 20190423: 后端直接选择角色，这里前端就不用调接口了
          // this.props.selectRole(roles[0].id, () => {
          //   this.props.setRole({
          //     roleId: roles[0].id,
          //     roleName: roles[0].name
          //   })
          //   localStorage.setItem('CURRENT_ROLE', JSON.stringify({
          //     roleId: roles[0].id,
          //     roleName: roles[0].name
          //   }))
          // })
        } else {
          // 拥有的角色数量大于1个 展示角色选择弹窗 让用户选择
          // 20190520 永远不展示角色选择弹窗
          // this.setState({ roleSelectVisible: true })
        }
      })
    } else {
      console.log('已选择过角色')
      console.log(currentRole)
    }
  }

  componentDidMount() {
    // this.handleUserRoles()
  }

  shouldComponentUpdate({ homeModules, recentBrowseRecords }) {
    if (
      JSON.stringify(homeModules) !== JSON.stringify(this.props.homeModules) ||
      JSON.stringify(recentBrowseRecords) !== JSON.stringify(this.props.recentBrowseRecords)
    ) {
      return true
    } else {
      return false
    }
  }

  goBackPageTop() {
    const body = document.querySelector('body')
    body.scrollIntoView({
      behavior: 'smooth',
    })
  }

  render() {
    const { roleSelectVisible } = this.state
    const { homeModules, recentBrowseRecords, userPermission } = this.props
    const panels = this.panels
    let shouldRenderPanel = []

    const MAP = {
      // resourceId: permissionId
      '24': 1, //客户信息
      '48':13, // 客户动态
      '56': 30, // 商机管理
      '62': 40, // 营销活动
      '76': 49, // 营销成果
      '85': 56, // 知识库
      '47': 82, // 工作日程
    }

    const permission = userPermission.data

    if (homeModules) {
      const length = homeModules.data.length
      const permissionLength = permission.length

      shouldRenderPanel = panels.filter((panel) => {
        let result = false
        let hasModulePermission = false

        for (let j = 0; j < permissionLength; j++) {
          if (
            MAP[panel.resourceId] === permission[j].id
          ) {
            hasModulePermission = true
            j = permissionLength
          }
        }

        for (let i = 0; i < length; i++) {
          if (
            homeModules.data[i].resourceId === panel.resourceId
          ) {
            result = true
            i = length
          }
        }

        return hasModulePermission && result
      })
    }

    // console.log(shouldRenderPanel)

    return (
      <div className='home-component'>
        <div className='home-banner'>
          <div className='center-container'>
            <Search />
            <Recent records={recentBrowseRecords.data.slice(0, 15)} />
          </div>
        </div>

        {
          homeModules !== null ?
            (
              shouldRenderPanel.length > 0 ?
                (
                  <div className='home-content'>
                    {
                      shouldRenderPanel.map((prop) => {
                        return (
                          <Panel
                            key={prop.title}
                            panelTitle={prop.title}
                            moreLinkHref={prop.moreLinkHref}
                            contentType={prop.contentType}
                          />
                        )
                      })
                    }
                    <CustomButton />
                  </div>
                ) : (
                  <div className='home-content'>
                    <div className='no-content-container'>
                      <div className='image-container'>
                        <img className='empty-pic' alt='' src={emptyPic} />
                      </div>
                      <div className='info'>暂无数据</div>
                      <div className='sub-info'>试试添加一个工作模块吧</div>
                      <CustomButton type='empty' />
                    </div>
                  </div>
                )
            )
            : null
        }

        {/*
          注意：只有当用户的可选择角色大于等于两个的时候，才显示角色选择弹窗
        */}
        <RoleSelect visible={roleSelectVisible} />

        <div className='back-to-top-container' onClick={this.goBackPageTop}>
          <Icon type='to-top' style={{ fontSize: 35, color: '#b3b3b3' }} />
          <div className='back-to-top-wording'>回到顶部</div>
        </div>

      </div>
    )
  }
}

export default Home
