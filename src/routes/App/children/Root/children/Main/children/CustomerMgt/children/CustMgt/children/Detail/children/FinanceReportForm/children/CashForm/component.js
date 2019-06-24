import React from 'react'
import './component.scss'
import { Table } from 'antd'

class CashForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.columns = [
      {
        title: '项目',
        dataIndex: 'itemName',
        key: 'itemName',
        className: 'first-column',
        render: (value) => {
          return (
            <span
              dangerouslySetInnerHTML={{ __html: value }}
            ></span>
          )
        }
      }, {
        title: '行次',
        dataIndex: 'itemLineMinor',
        key: 'itemLineMinor',
      }, {
        title: '上年数',
        dataIndex: 'termBeginVal',
        key: 'termBeginVal',
      }, {
        title: '本年累计数',
        dataIndex: 'termEndVal',
        key: 'termEndVal',
      }
    ]
  }

  componentDidMount() {
    const { companyKey, term, period } = this.props
    this.props.getCashList(companyKey, period, term)
  }

  render() {

    const { columns } = this
    const { customerCashList } = this.props

    return (
      <div className='cash-form-component'>
        <Table
          rowKey='objectKey'
          className='cash-form-table'
          columns={columns}
          dataSource={customerCashList}
          pagination={false}
        />
      </div>
    )
  }
}

export default CashForm
