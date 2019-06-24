import React from 'react'
import './component.scss'
import HzBreadcrumb from 'components/HzBreadcrumb'
import { checkPermission } from 'utils/permission'
import { Tabs } from 'antd'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading/index'
import Auth from 'components/Auth'

const DynamicList = Loadable({
  loader: () => import('../List/index'),
  loading: RouteLoading,
})

const TabPane = Tabs.TabPane



class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.handleTabChange = this.handleTabChange.bind(this)
  }

  handleTabChange(activeKey) {
    localStorage.setItem('DYNAMIC_MGT_TAB_KEY', activeKey)
  }

  render() {

    // 从权限树中判断是否展示对应的列表
    const isShowInstitutionDynamicList = checkPermission('customerDynamic/institutionQuery')
    const isShowMyDynamicList = checkPermission('customerDynamic/userQuery')

    // 根据用户的权限情况生成保存所有 tabKey 的数组，以便取到第一个存在的标签页的 key
    const tabPaneKeys = []
    if (isShowInstitutionDynamicList) {
      tabPaneKeys.push('1')
    }
    if (isShowMyDynamicList) {
      tabPaneKeys.push('2')
    }
    const previousTabKey = localStorage.getItem('DYNAMIC_MGT_TAB_KEY') || tabPaneKeys[0]

    return (
      <div className='dynamic-home-component'>
        <HzBreadcrumb />

        <div className='hz-tabs'>

          <Tabs
            defaultActiveKey={!!previousTabKey ? previousTabKey : tabPaneKeys[0]}
            animated={false}
            onChange={this.handleTabChange}
          >

            {
              isShowInstitutionDynamicList ?
              <TabPane tab='机构客户动态' key='1'>
                <Auth permissionPath={['customerDynamic/institutionQuery']}>
                  <DynamicList listType='institutionDynamic' />
                </Auth>
              </TabPane> : null
            }


            {
              isShowMyDynamicList ?
              <TabPane tab='我的客户动态' key='2'>
                <Auth permissionPath={['customerDynamic/userQuery']} noCheck={true}>
                  <DynamicList listType='myDynamic' />
                </Auth>
              </TabPane> : null
            }

          </Tabs>

        </div>
      </div>
    )
  }
}

export default Home
