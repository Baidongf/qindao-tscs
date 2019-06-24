import React from 'react'
import './component.scss'
import queryString from 'query-string'
import HzBreadcrumb from 'components/HzBreadcrumb'
import DetailHeader from './children/DetailHeader'
import DetailContent from './children/DetailContent'
import RelatedSchedule from './children/RelatedSchedule'
import FollowedRecord from './children/FollowedRecord'
import RelateCustomerPanel from 'components/RelationCustomer'

class OptDetail extends React.Component {
  constructor(props) {
    super(props)
    this.queryObj = queryString.parse(props.location.search)
    this.id = this.queryObj.id
    this.status = {
      0: '新建',
      1: '沟通',
      2: '完成',
      3: '终止'
    }
  }

  componentDidMount() {
    this.props.getOpportunityDetail(this.id)
  }

  componentWillReceiveProps({ opportunityDetail }) {
    if (opportunityDetail !== this.props.opportunityDetail) {
      // 日期转化为时间戳格式
      ['createTime', 'updateTime'].forEach(dateKey => {
        if (opportunityDetail[dateKey]) {
          opportunityDetail[dateKey] = opportunityDetail[dateKey].split(" ")[0]
        }
      })
      opportunityDetail.customerType = opportunityDetail.status === '0' ? '行内' : '行外'
      opportunityDetail.status = this.status[opportunityDetail.status]
    }
  }

  render() {
    const { opportunityDetail } = this.props
    return (
      <div className='opportunity-detail-component'>
        <HzBreadcrumb />
        <div className='detail-content-container'>

          <DetailHeader
            name={opportunityDetail.name}
            updateTime={opportunityDetail.updateTime}
          />

          <DetailContent
            customerType={opportunityDetail.customerType}
            createTime={opportunityDetail.createTime}
            source={opportunityDetail.source}
            status={opportunityDetail.status}
            type={opportunityDetail.type}
            description={opportunityDetail.description}
            followUserName={opportunityDetail.followUserName}
            synergyUsers={opportunityDetail.synergyUsers}
            createName={opportunityDetail.userName}
          />

          {/* 已关联的日程，只作展示 */}
          <RelatedSchedule
            businessId={this.id}
          />

          <FollowedRecord
            businessId={this.id}
          />
          <div className='add-customer add-wrap'>
            <div className='title clearfix'>
              <div className='label'>关联客户</div>
            </div>
            <div className='content'>
              <div className='content-header'>
                <div>客户名称</div>
                <div>客户类型</div>
                <div>所属机构</div>
                <div>客户经理</div>
              </div>
              <div className='list'>
                {opportunityDetail.customers && opportunityDetail.customers.map(item => {
                  return (
                    <div className='item' key={item.objectKey}>
                      <div>{item.name}</div>
                      <div>{item.isInter == 0 ? '行内' : '行外'}</div>
                      <div>{item.groupName}</div>
                      <div>{item.legalPerson}</div>
                    </div>
                  )
                })}

              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}


export default OptDetail
