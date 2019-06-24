import React from 'react'
import './component.scss'
import { checkPermission } from 'utils/permission'
import { Tabs } from 'antd'
import HzBreadcrumb from 'components/HzBreadcrumb'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading/index'
import Auth from 'components/Auth'
const CustomerList = Loadable({
  loader: () => import('../CustMgt/children/List'),
  loading: RouteLoading,
})
const TagList = Loadable({
  loader: () => import('../TagMgt/children/List'),
  loading: RouteLoading,
})
const AccountList = Loadable({
  loader: () => import('../AccountMgt/children/List'),
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
    localStorage.setItem('CUSTOMER_MGT_TAB_KEY', activeKey)
  }

  render() {

    // 从权限树中判断是否展示对应的列表
    const isShowInstitutionCustomerList = checkPermission('customer/institutionSearch') // 机构客户列表
    const isShowMyCustomerList = checkPermission('customer/userSearch') // 我的客户列表
    const isShowInstitutionAccountList = checkPermission('customer/institutionAccount') // 机构客户账户列表
    const isShowMyAccountList = checkPermission('customer/userAccount') // 我的客户账户列表
    const isShowTagList = checkPermission('tag')

    // 根据用户的权限情况生成保存所有 tabKey 的数组，以便取到第一个存在的标签页的 key
    const tabPaneKeys = []
    if (isShowInstitutionCustomerList) {
      tabPaneKeys.push('1')
    }
    if (isShowMyCustomerList) {
      tabPaneKeys.push('2')
    }
    if (isShowInstitutionAccountList) {
      tabPaneKeys.push('3')
    }
    if (isShowMyAccountList) {
      tabPaneKeys.push('4')
    }
    if (isShowTagList) {
      tabPaneKeys.push('5')
    }

    const previousTabKey = localStorage.getItem('CUSTOMER_MGT_TAB_KEY') || tabPaneKeys[0]
    return (
      <div className='customer-manage-home-component'>
        <HzBreadcrumb />

        <div className='hz-tabs'>
          <Tabs
            defaultActiveKey={!!previousTabKey ? previousTabKey : tabPaneKeys[0]}
            animated={false}
            // className={isCustomerManager === '1' ? 'shrink-height' : ''}
            onChange={this.handleTabChange}
          >

            {
              isShowInstitutionCustomerList ?
                <TabPane tab='机构客户' key='1'>
                  <Auth permissionPath={['customer/institutionSearch']}>
                    <CustomerList listType='institutionCustomer' />
                  </Auth>
                </TabPane> : null
            }

            {
              isShowMyCustomerList ?
                <TabPane tab='我的客户' key='2'>
                  <Auth permissionPath={['customer/userSearch']}>
                    <CustomerList listType='myCustomer' />
                  </Auth>
                </TabPane> : null
            }

            {
              isShowInstitutionAccountList ?
                <TabPane tab='机构账户' key='3'>
                  <Auth permissionPath={['customer/institutionAccount']}>
                    <AccountList listType='institutionAccount' />
                  </Auth>
                </TabPane> : null
            }

            {
              isShowMyAccountList ?
                <TabPane tab='我的账户' key='4'>
                  <Auth permissionPath={['customer/userAccount']}>
                    <AccountList listType='myAccount' />
                  </Auth>
                </TabPane> : null
            }

            {
              isShowTagList ?
                <TabPane tab='标签' key='5'>
                  <Auth permissionPath={['tag']}>
                    <TagList />
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
