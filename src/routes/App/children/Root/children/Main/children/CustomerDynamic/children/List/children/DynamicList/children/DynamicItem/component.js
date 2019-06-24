import React from 'react'
import './component.scss'
import HzLink from 'components/HzLink'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading/index'
import Auth from 'components/Auth'
import { checkPermission } from 'utils/permission'

const RelateSchedulePopup = Loadable({
  loader: () => import('components/RelateSchedulePopup'),
  loading: RouteLoading
})

const RelateBusinessPopup = Loadable({
  loader: () => import('components/RelateBusinessPopup'),
  loading: RouteLoading
})


// 获取权限
const canRelateSchedule = checkPermission('customerDynamicWorkSchedule/join')
const canRelateBusiness = checkPermission('customerDynamicBusiness/joinBusiness')


class DynamicItem extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isCustomerManager: null,
    }

    this.showSchedulePopup = this.showSchedulePopup.bind(this)
    this.showBusinessPopup = this.showBusinessPopup.bind(this)
  }

  componentWillMount() {
    const isCustomerManager = localStorage.getItem('IS_CUSTOMER_MANAGER')
    this.setState({ isCustomerManager })
  }

  showSchedulePopup() {
    this.scheduleRef.showPopup()
  }

  showBusinessPopup() {
    this.businessRef.showPopup()
  }

  render() {
    const { isCustomerManager } = this.state
    const { item, type } = this.props || {}
    const isMyDynamic = type === 'myDynamic'
    const isInstitutionDynamic = type === 'institutionDynamic'
    return (
      <div className={`dynamic-item-component ${isInstitutionDynamic ? 'institution-dynamic-item-content' : ''}`}>
        <span className='column'>
          <HzLink
            to={
              `/root/main/customerDynamic/detail?key=${item.objectKey}&source=${
                item.source === '行内动态' ? '0' : '1'
              }`
            }
          >
            <div
              className='title'
              title={item.name || item.title}
            >{ item.name || item.title || '--'}</div>
          </HzLink>
          <div className='desc' dangerouslySetInnerHTML={{__html: item.companyName || '暂无数据'}}></div>
        </span>

        <span className='column source'>{ item.source || '暂无' }</span>

        <span className='column type'>{ item.typeName || '暂无' }</span>

        {/* {
          isCustomerManager === '0' ?
          <span className='column institution'>{ item.institutionName }</span> : null
        }

        {
          isCustomerManager === '0' ?
          <span className='column manager'>{ item.userName }</span> : null
        } */}

        <span className={`column time ${
          canRelateSchedule || canRelateBusiness ?
          'is-customer-manager' : ''
        }`}>{ item.pushTime ? item.pushTime.substr(0, 10) : '暂无' }</span>

        {
          isMyDynamic && (canRelateSchedule || canRelateBusiness) ?
          <span className='column operation'>
            {
              canRelateBusiness ?
              <span
                className='relate-button business-button'
                onClick={this.showBusinessPopup}
              >关联商机</span> : null
            }

            {
              canRelateSchedule ?
              <span
                className='relate-button schedule-button'
                onClick={this.showSchedulePopup}
              >关联日程</span> : null
            }
          </span> : null
        }

        {
          canRelateSchedule ?
          <RelateSchedulePopup
            onRef={(ref) => { this.scheduleRef = ref }}
            relateWith='dynamic'
            relateKey={item.objectKey}
          /> : null
        }

        {
          canRelateBusiness ?
          <RelateBusinessPopup
            onRef={(ref) => { this.businessRef = ref }}
            relateKey={item.objectKey}
          /> : null
        }

      </div>
    )
  }
}

export default DynamicItem
