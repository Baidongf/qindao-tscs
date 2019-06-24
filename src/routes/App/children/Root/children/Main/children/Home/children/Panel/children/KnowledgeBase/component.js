import React from 'react'
import { Table } from 'antd'
import { withRouter } from 'react-router-dom'

class KnowledgeBase extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      moduleName: 'knowledgeBase',
      tableColumns: [
        {
          title: '信息名称',
          dataIndex: 'title',
          key: 'title',
        }, {
          title: '信息类型',
          dataIndex: 'type',
          key: 'type',
        }, {
          title: '发布时间',
          dataIndex: 'publishTime',
          key: 'publishTime',
        }, {
          title: '阅读量',
          dataIndex: 'viewCount',
          key: 'viewCount',
        },
      ],
      homeKnowledgeBase: {data: []},
    }
  }

  componentWillMount() {
    const moduleName = this.state.moduleName
    this.props.getHomeModuleData(moduleName)
  }

  componentWillReceiveProps({homeKnowledgeBase}) {
    if (homeKnowledgeBase !== this.props.homeKnowledgeBase) {
      this.setState({ homeKnowledgeBase })
    }
  }

  render() {
    const columns = this.state.tableColumns;
    const data = this.state.homeKnowledgeBase.data.slice(0, 5)
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
              this.props.history.push(`/root/main/customerKnowlMgt/detail?id=${id}`)
            }
          }
        }}
      />
    )
  }
}

export default withRouter(KnowledgeBase)
