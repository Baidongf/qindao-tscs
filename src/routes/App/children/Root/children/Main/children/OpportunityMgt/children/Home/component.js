import React from 'react'
import './component.scss'
import {Tabs} from 'antd'
import HzBreadcrumb from 'components/HzBreadcrumb'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading'
import Auth from 'components/Auth'
// 下属的商机列表
const SubordinateList = Loadable({
  loader: () => import('./children/SubordinateList'),
  loading: RouteLoading
})

// 跟进商机列表(是客户经理时展示)
const FollowedList = Loadable({
  loader: () => import('./children/FollowedList'),
  loading: RouteLoading
})

// 协同商机列表
const CollaborationList = Loadable({
  loader: () => import('./children/CollaborationList'),
  loading: RouteLoading
})

// 公共商机列表
const CommonList = Loadable({
  loader: () => import('./children/CommonList'),
  loading: RouteLoading
})


const TabPane = Tabs.TabPane

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeKey: '1'
    }
    this.isCustomerManager = null

    this.handleTabChange = this.handleTabChange.bind(this)
  }

  componentWillMount() {
    const localActiveKey = localStorage.getItem('OPPORTUNITY_MGT_TAB_KEY')
    const activeKey = localActiveKey || '1'
    this.setState({ activeKey })

    const isCustomerManager = localStorage.getItem('IS_CUSTOMER_MANAGER')
    this.isCustomerManager = isCustomerManager
  }

  handleTabChange(activeKey) {
    localStorage.setItem('OPPORTUNITY_MGT_TAB_KEY', activeKey)
  }

  render() {

    const { isCustomerManager } = this
    const { activeKey } = this.state

    return (
      <div className='home-component'>
        <HzBreadcrumb/>
        <div className='hz-tabs'>
          <Tabs
            defaultActiveKey={activeKey}
            animated={false}
            onChange={this.handleTabChange}
          >

            {/* {
              isCustomerManager === '1' ?
                <TabPane tab='跟进商机' key='1'>
                  <Auth permissionPath={['businessChanceFollowRecord']} >
                    <FollowedList/>
                  </Auth>

                </TabPane> :
                <TabPane tab='下属商机' key='1'>
                  <Auth permissionPath={['businessChance/queryBranch']} >
                    <SubordinateList/>
                  </Auth>

                </TabPane>
            } */}
           
            <TabPane tab='跟进商机' key='1'>
              <Auth permissionPath={['businessChanceFollowRecord']} >
                <FollowedList/>
              </Auth>
            </TabPane>
            {
              isCustomerManager === '0' ?<TabPane tab='下属商机' key='2'>
              <Auth permissionPath={['businessChance/queryBranch']} >
                <SubordinateList history={this.props.history}/>
              </Auth>
            </TabPane>:""
            }
            <TabPane tab='协同商机' key='3'>
              <Auth permissionPath={['businessChance/querySynergy']} >
                <CollaborationList/>
              </Auth>
            </TabPane>
            <TabPane tab='公共商机' key='4'>
              <Auth permissionPath={['businessChance/queryCommon']} >
                <CommonList/>
              </Auth>

            </TabPane>

          </Tabs>
        </div>
      </div>
    )
  }
}

export default Home
