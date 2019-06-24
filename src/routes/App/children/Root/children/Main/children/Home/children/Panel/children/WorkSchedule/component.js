import React from 'react'
import { Table } from 'antd'
import { withRouter } from 'react-router-dom'

class WorkSchedule extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      moduleName: 'workSchedule',
      tableColumns: [
        {
          title: '日程时间',
          dataIndex: 'startTime',
          key: 'startTime',
        }, {
          title: '主题',
          dataIndex: 'title',
          key: 'title',
        }, {
          title: '日程名称',
          dataIndex: 'name',
          key: 'name',
        },
      ],
      homeWorkSchedule: {data: []}
    }
  }

  componentWillMount() {
    const moduleName = this.state.moduleName
    this.props.getHomeModuleData(moduleName)
  }

  componentWillReceiveProps({ homeWorkSchedule }) {
    if (homeWorkSchedule !== this.props.homeWorkSchedule) {
      this.setState({ homeWorkSchedule })
    }
  }

  render() {
    const columns = this.state.tableColumns;
    let data = this.state.homeWorkSchedule.data
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
              this.props.history.push(`/root/main/schedule/detail?id=${id}`)
            }
          }
        }}
      />
    )
  }
}

export default withRouter(WorkSchedule)
