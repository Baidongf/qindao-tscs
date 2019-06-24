import React from 'react'
import './component.scss'
import { Table } from 'antd'

class Business extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.columns = [{
      title: '主题',
      key: 'businessName',
      dataIndex: 'businessName',
    }, {
      title: '日程名称',
      key: 'customerName',
      dataIndex: 'customerName',
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

  render() {

    const { columns } = this

    return (
      <div className='schedule-component'>
        <div className='title'>关联日程</div>
        <div className='content'>
          <Table
            columns={columns}
          />
        </div>
      </div>
    )
  }
}

export default Business
