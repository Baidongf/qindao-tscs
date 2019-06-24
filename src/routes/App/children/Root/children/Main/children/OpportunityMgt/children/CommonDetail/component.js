import React from 'react'
import './component.scss'
import queryString from 'query-string'
import HzBreadcrumb from 'components/HzBreadcrumb'
import DetailHeader from './children/DetailHeader'
import DetailContent from './children/DetailContent'


class CommonOptDetail extends React.Component {
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
    const { id } = this
    const { opportunityDetail } = this.props

    return (
      <div className='common-opportunity-detail-component'>
        <HzBreadcrumb />
        <div className='common-detail-content-container'>

          <DetailHeader
            name={opportunityDetail.name}
            updateTime={opportunityDetail.updateTime}
            id={id}
          />

          <DetailContent
            customerType={opportunityDetail.customerType}
            createTime={opportunityDetail.createTime}
            source={opportunityDetail.source}
            status={opportunityDetail.status}
            type={opportunityDetail.type}
            description={opportunityDetail.description}
          />
        </div>

      </div>
    )
  }
}


export default CommonOptDetail
