import React from 'react'
import { Table } from 'antd'
import { withRouter } from 'react-router-dom'

class CustomerInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      moduleName: 'customerInfo',
      tableColumns: [
        {
          title: '客户',
          dataIndex: 'name',
          key: 'name',
        }, {
          title: '客户编号',
          dataIndex: 'code',
          key: 'code',
          width: 120,
        }, {
          title: '行业分类',
          dataIndex: 'industry',
          key: 'industry',
        }, {
          title: '法人代表',
          width: 120,
          dataIndex: 'legalPerson',
          key: 'legalPerson',
        }, {
          title: '成立日期',
          width: 120,
          dataIndex: 'establishmentDate',
          key: 'establishmentDate',
        }, {
          title: '注册资本',
          dataIndex: 'regCapital',
          key: 'regCapital',
        }, {
          title: '信用等级',
          width: 120,
          dataIndex: 'intCrdtLevel',
          key: 'intCrdtLevel',
        }, {
          title: '办公地址',
          dataIndex: 'regAddress',
          key: 'regAddress',
        },
      ],
      homeCustomerInfo: {data:[]}
    }
  }

  componentWillMount() {
    const moduleName = this.state.moduleName
    this.props.getHomeModuleData(moduleName)
  }

  componentWillReceiveProps({ homeCustomerInfo }) {
    if (homeCustomerInfo !== this.props.homeCustomerInfo) {
      this.setState({ homeCustomerInfo })
    }
  }

  render() {
    const columns = this.state.tableColumns;
    const data = this.state.homeCustomerInfo.data.slice(0, 5) //只取前五个
    return (
      <Table
        pagination={false}
        columns={columns}
        dataSource={data}
        rowKey='objectKey'
        onRow={(row) => {
          return {
            onClick: (ev) => {
              const companyKey = row.objectKey
              this.props.history.push(`/root/main/customerMgt/custMgt/detail?companyKey=${companyKey}`)
            }
          }
        }}
      />
    )
  }

}

export default withRouter(CustomerInfo)
