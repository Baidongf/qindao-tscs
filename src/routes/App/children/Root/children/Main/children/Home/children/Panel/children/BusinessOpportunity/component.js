import React from 'react'
import { Table } from 'antd'
import { withRouter } from 'react-router-dom'
import './component.scss'

class BusinessOpportunity extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      moduleName: 'businessOpportunity',
      clickRowId: null,
      tableColumns: [
        {
          title: '商机名称',
          dataIndex: 'name',
          key: 'name',
          className: 'business-name',
          width: 500,
          render: (name) => {
            return <span title={name}>{name}</span>
          }
        }, {
          title: '商机来源',
          dataIndex: 'source',
          key: 'source',
        }, {
          title: '商机状态',
          dataIndex: 'status',
          key: 'status',
          render: (status) => {
            const wording = ['新建','沟通','完成','终止']
            let value = wording[status]
            return !!value ? value : status
          }
        }, {
          title: '商机类型',
          dataIndex: 'type',
          key: 'type',
        }
      ],
      homeBusinessOpportunity: {data: []},
    }

    this.onRowHandler = this.onRowHandler.bind(this)
  }

  onRowHandler(row) {
    return {
      onClick: () => {
        const id = row.id
        this.props.history.push(`/root/main/opportunityMgt/home/detail?id=${id}`)
      }
    }
  }

  componentWillMount() {
    const moduleName = this.state.moduleName
    this.props.getHomeModuleData(moduleName)
  }

  componentWillReceiveProps({ homeBusinessOpportunity }) {
    if (homeBusinessOpportunity !== this.props.homeBusinessOpportunity) {
      this.setState({ homeBusinessOpportunity })
    }
  }

  render() {
    const columns = this.state.tableColumns
    const data = this.state.homeBusinessOpportunity.data.slice(0, 5)
    return (
      <Table
        className='business-opportunity-panel'
        pagination={false}
        columns={columns}
        dataSource={data}
        rowKey='id'
        onRow={this.onRowHandler}
      />
    )
  }

  componentDidMount() {

  }
}

export default withRouter(BusinessOpportunity)
