import React from 'react'
import './component.scss'
import { Tabs } from 'antd'
import HzBreadcrumb from 'components/HzBreadcrumb'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading'
import Auth from 'components/Auth'
const OrgList = Loadable({
  loader: () => import('../OrgMgt/children/List'),
  loading: RouteLoading
})

const UserList = Loadable({
  loader: () => import('../UserMgt/children/List'),
  loading: RouteLoading
})

const ParamsList = Loadable({
  loader: () => import('../ParamsMgt/children/List'),
  loading: RouteLoading
})

const RoleList = Loadable({
  loader: () => import('../RoleMgt/children/List'),
  loading: RouteLoading
})

const TabPane = Tabs.TabPane

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeKey: '1'
    }

    this.handleTabChange= this.handleTabChange.bind(this)
  }


  handleTabChange(activeKey) {
    localStorage.setItem('SYSTEM_MGT_TAB_KEY', activeKey)
  }

  componentWillMount() {
    const localActiveKey = localStorage.getItem('SYSTEM_MGT_TAB_KEY')
    const activeKey = localActiveKey || '1'
    this.setState({ activeKey })
  }


  render() {

    const { activeKey } = this.state

    return (
      <div className='home-component'>
        <HzBreadcrumb />
        <div className='hz-tabs'>
          <Tabs
            defaultActiveKey={activeKey}
            animated={false}
            onChange={this.handleTabChange}
          >
            <TabPane tab="机构管理" key="1">
              <Auth permissionPath={['institution']}>
                <OrgList />
              </Auth>

            </TabPane>
            <TabPane tab="用户管理" key="2">
              <Auth permissionPath={['user']}>
                <UserList />
              </Auth>

            </TabPane>
            <TabPane tab="角色管理" key="3">
              <Auth permissionPath={['roleResource']}>
                <RoleList />
              </Auth>
            </TabPane>
            <TabPane tab="参数管理" key="4">
              <Auth permissionPath={['para']}>
                <ParamsList />
              </Auth>
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default Home
