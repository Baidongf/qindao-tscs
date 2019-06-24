import React from 'react'
import './component.scss'
import { Tabs } from 'antd'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading'
import HzBreadcrumb from 'components/HzBreadcrumb'

const TabPane = Tabs.TabPane

// 收到的活动
const ReceiveActivity = Loadable({
  loader: () => import('../ReceiveActivity/children/List'),
  loading: RouteLoading,
})

// 创建的活动
const CreateActivity = Loadable({
  loader: () => import('../CreateActivity/children/List'),
  loading: RouteLoading,
})

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.isCustomerManager = null
    this.institutionLevel = null
  }

  componentWillMount() {
    const institutionLevel = localStorage.getItem('INSTITUTION_LEVEL')
    const isCustomerManager = localStorage.getItem('IS_CUSTOMER_MANAGER')
    this.institutionLevel = institutionLevel
    this.isCustomerManager = isCustomerManager
  }

  render() {

    const { institutionLevel, isCustomerManager } = this

    return (
      <div className='marketing-activity-home-component'>
        <HzBreadcrumb />
        <div className='hz-tabs'>
          <Tabs
            defaultActiveKey="1"
            animated={false}
            className={institutionLevel === '1' && isCustomerManager === '0' ? 'shrink-height' : ''}
          >

            {
              institutionLevel === '1' && isCustomerManager === '0' ?
              null :
              <TabPane tab="我收到的活动" key="1">
                <ReceiveActivity />
              </TabPane>
            }


            <TabPane
              tab={ institutionLevel === '1' && isCustomerManager === '0' ? '' : '我创建的活动' }
              key={ institutionLevel === '1' && isCustomerManager === '0' ? '1' : '2' }
            >
              <CreateActivity />
            </TabPane>

          </Tabs>
        </div>
      </div>
    )
  }
}

export default Home
