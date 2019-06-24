import React from 'react'
import { Table } from 'antd'
import './component.scss'
import { withRouter } from 'react-router-dom'


class CustomerActivity extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      moduleName: 'customerActivity',
      clickRowId: null,
      homeCustomerActivity: { data: [] },
    }

    this.tableColumns = [
      {
        title: '动态名称',
        dataIndex: 'name',
        key: 'name',
        render: (name, row) => {
          return (
            <span
              onClick={this.jumpToDetail.bind(this, row.objectKey, row.source)}
            >{ name }</span>
          )
        }
      }, {
        title: '动态类型',
        dataIndex: 'typeName',
        key: 'typeName',
      }, {
        title: '推送时间',
        dataIndex: 'pushTime',
        key: 'pushTime',
      },
    ]

  }

  jumpToDetail(detailId, source) {
    const sourceCode = source === '行内动态' ? '0' : '1'
    this.props.history.push(`/root/main/customerDynamic/detail?key=${detailId}&source=${sourceCode}`)
  }

  componentWillMount() {
    const moduleName = this.state.moduleName
    this.props.getHomeModuleData(moduleName)
  }

  componentWillReceiveProps({ homeCustomerActivity }) {
    if (homeCustomerActivity !== this.state.homeCustomerActivity) {
      this.setState({ homeCustomerActivity })
    }
  }

  render() {
    const columns = this.tableColumns
    const data = this.state.homeCustomerActivity.data.slice(0, 5)
    return (
      <Table
        pagination={false}
        columns={columns}
        dataSource={data}
        rowKey='objectKey'
      />
    )
  }
}

export default withRouter(CustomerActivity)
