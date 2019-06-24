import React from 'react'
import { Table } from 'antd'
import { withRouter } from 'react-router-dom'

class MarketingActivity extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      moduleName: 'marketingActivity',
      tableColumns: [
        {
          title: '活动名称',
          dataIndex: 'title',
          key: 'title',
        }, {
          title: '活动状态',
          dataIndex: 'status',
          key: 'status',
        }, {
          title: '时间区间',
          render(wording, row) {
            return (
              <span>{`${row.startTime}-${row.endTime}`}</span>
            )
          }
        },
      ],
      homeMarketingActivity: {data: []}
    }
  }

  componentWillMount() {
    const moduleName = this.state.moduleName
    this.props.getHomeModuleData(moduleName)
  }

  componentWillReceiveProps({ homeMarketingActivity }) {
    if (homeMarketingActivity !== this.props.homeMarketingActivity) {
      this.setState({ homeMarketingActivity })
    }
  }

  render() {
    const columns = this.state.tableColumns
    let data = this.state.homeMarketingActivity.data
    if (data.length > 5) {
      data = data.slice(0, 5)
    }
    return (
      <Table
        rowKey='id'
        pagination={false}
        columns={columns}
        dataSource={data}
        onRow={(row) => {
          return {
            onClick: (ev) => {
              const id = row.id
              this.props.history.push(`/root/main/marketingActivity/createActivity/detail?id=${id}`)
            }
          }
        }}
      />
    )
  }
}

export default withRouter(MarketingActivity)
