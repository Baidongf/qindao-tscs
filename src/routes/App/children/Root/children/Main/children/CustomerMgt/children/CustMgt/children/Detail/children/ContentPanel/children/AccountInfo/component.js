import React from 'react'
import './component.scss'
import { Table } from 'antd'

class AccountInfo extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      customerAccountInfo: [],
    }
    this.columns = [
      {
        align: 'center',
        title: '账户',
        dataIndex: 'code',
        key: 'code',
      }, {
        align: 'center',
        title: '账户类型',
        dataIndex: 'type',
        key: 'type',
      }, {
        align: 'center',
        title: '账户余额',
        dataIndex: 'amount',
        key: 'amount',
        render: (value) => {
          return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
      }, {
        align: 'center',
        title: '余额更新时间',
        dataIndex: 'updateDate',
        key: 'updateDate',
      },
    ]
  }

  componentWillMount() {
    const companyKey = this.props.companyKey
    this.props.getCustomerDetailAccount(companyKey)
  }

  componentWillReceiveProps({ customerAccountInfo }) {
    if (customerAccountInfo !== this.props.customerAccountInfo) {
      this.setState({ customerAccountInfo })
    }
  }

  shouldComponentUpdate({ customerAccountInfo }) {
    return customerAccountInfo !== this.props.customerAccountInfo
  }

  render() {
    const { columns } = this
    const { customerAccountInfo } = this.state
    return (
      <div className='account-info-component'>
        <Table
          columns={columns}
          pagination={false}
          dataSource={customerAccountInfo}
          rowKey='code'
        />
      </div>
    )
  }
}

export default AccountInfo
