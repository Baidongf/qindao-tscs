import React from 'react'
import './component.scss'
import { Table } from 'antd'

class RelatedSchedule extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}

    this.columns = [{
      title: '主题',
      key: 'title',
      dataIndex: 'title',
      className: 'first-column'
    }, {
      title: '日程名称',
      key: 'name',
      dataIndex: 'name',
    }, {
      title: '开始时间',
      key: 'startTime',
      dataIndex: 'startTime',
    }, {
      title: '结束时间',
      key: 'endTime',
      dataIndex: 'endTime',
    }]
  }

  componentDidMount() {
    const businessId = this.props.businessId
    this.props.getBusinessRelatedScheduleList(businessId)
  }

  render() {

    const { columns } = this
    const { businessRelatedScheduleList } = this.props

    return (
      <div className='opportunity-related-schedule-component'>
        <div className='title'>
          <span className='schedule-icon'></span>
          关联日程
        </div>
        <div className='content'>
          <Table
            rowKey='id'
            columns={columns}
            dataSource={businessRelatedScheduleList.data}
            pagination={false}
          />
        </div>
      </div>
    )
  }
}

export default RelatedSchedule
