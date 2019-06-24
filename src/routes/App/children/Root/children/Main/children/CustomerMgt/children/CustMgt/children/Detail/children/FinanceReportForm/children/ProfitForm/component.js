import React from 'react'
import './component.scss'
import { Table } from 'antd'

class ProfitForm extends React.Component {
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
        title: '上年年末数',
        dataIndex: 'termBeginVal',
        key: 'termBeginVal',
      }, {
        title: '期末余额',
        dataIndex: 'termEndVal',
        key: 'termEndVal',
      }
    ]

  }

  componentDidMount() {
    const { companyKey, term, period } = this.props
    this.props.getProfitList(companyKey, period, term)
  }

  render() {

    const { columns } = this
    const { customerProfitList } = this.props

    return (
      <div className='profit-form-component'>
        <Table
          rowKey='objectKey'
          className='profit-form-table'
          columns={columns}
          dataSource={customerProfitList}
          pagination={false}
        />
      </div>
    )
  }
}

export default ProfitForm
