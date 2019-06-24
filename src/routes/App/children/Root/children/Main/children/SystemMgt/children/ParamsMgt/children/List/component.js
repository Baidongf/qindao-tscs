import React from 'react'
import './component.scss'

import { Input, Button, Table } from 'antd'
import HzLink from 'components/HzLink'

import { commonChangeHandler } from 'utils/antd'
import { checkPermission } from 'utils/permission'

const PAGE_SIZE = 10
const FILTER_INIT_VALUES = {
  name: null
}
const typeMap = {
  system: '系统参数',
  date: '天数',
  amount: '金额'
}

const canUpdateParams = checkPermission('para/update')

class List extends React.Component {

  // 成员属性、状态的声明，均在构造函数内部
  constructor(props) {
    super(props)

    this.state = {
      filterObj: {
        ...FILTER_INIT_VALUES
      },

      rowStatus: {
        // 0: false
      }
    }

    this.columns = [
      {
        title: '类型',
        dataIndex: 'name',
        width: 150,
        className: 'td-name',
        render: (value, row, index) => <span title={value}>{value}</span>,
      }, {
        title: '描述',
        dataIndex: 'description',
        width: 230,
        render: (value, row, index) => {
          return (<span title={value}>{value}</span>)
        }
      }, {
        title: '参数种类',
        dataIndex: 'type',
        align: 'center',
        width: 150,
        render: (value, row, index) => {
          return (<span title={value}>{typeMap[row.type]}</span>)
        }
      }, {
        title: '参数',
        width: 260,
        dataIndex: 'value',
        render: (text) => {
          return text ? text : '暂无'
        }
      }, {
        title: '设置日期',
        width: 220,
        dataIndex: 'updatedDt'
      }
    ]

    // 如果有编辑参数的权限，则展示编辑按钮
    if (canUpdateParams) {
      this.columns.push({
        title: '操作',
        key: 'operation',
        align: 'center',
        width: 266,
        render: (value, row, index) => (
          <div className='operation-area'>
            <HzLink
              to={`/root/main/systemMgt/paramsMgt/createOrEdit?operation=edit&id=${row.id}`}
              className='reset-link-style'
            >编辑</HzLink>
          </div>
        )
      })
    }

    this.pagination = {
      className: 'pagination-container',
      showQuickJumper: true,
      showSizeChanger: true,
      total: 0,
      current: 1,
      pageSize: PAGE_SIZE,
      onChange: (page, pageSize) => {
        this.pagination.current = page
        this.searchHandler()
      },
      onShowSizeChange: (page, pageSize) => {
        this.pagination.pageSize = pageSize
        this.searchHandler()
      }
    }

    this.searchHandler = this.searchHandler.bind(this)
    this.resetHandler = this.resetHandler.bind(this)
    // this.commonChangeHandler = commonChangeHandler.bind(this)
  }


  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'filterObj', key, value)
  }

  searchHandler() {
    const obj = {
      name: this.state.filterObj.name,
      pageNo: this.pagination.current,
      pageSize: this.pagination.pageSize
    }
    this.props.getParamsList(obj)
  }

  resetHandler() {
    this.setState({
      filterObj: {
        ...FILTER_INIT_VALUES
      }
    })
  }

  componentDidMount() {
    this.searchHandler()
  }

  componentWillReceiveProps({ paramsList }) {
    if (this.props.paramsList !== paramsList) {
      paramsList.data.forEach((item, index) => {
        item.key = item.id
      })

      // FIXME: 需要根据后端新的结构 重新获取分页信息
      this.pagination.total = paramsList.total
    }
  }

  render() {
    const { filterObj } = this.state
    const { paramsList } = this.props

    return (
      <div className='param-list-component'>
        {/* <HzBreadcrumb /> */}
        <div className='filter-area'>
          <div className='inputs'>
            <Input
              value={filterObj.name}
              onChange={this.valueChangeHandler.bind(this, 'name')}
              placeholder='请输入参数类型'
              style={{ width: 905 }}
            />
          </div>
          <div className='buttons'>
            <Button type='primary' className='btn-item' onClick={this.searchHandler}>搜索</Button>
            <Button className='btn-item' onClick={this.resetHandler.bind(this)}>重置</Button>
          </div>
        </div>
        <div className='result-area'>
          <div className='list-header clearfix'>
            <span className='total-area'>共找到<span
              className='total-num'>{paramsList.total || 0}</span>条参数信息</span>
          </div>
          <div className='table-area'>
            <div className='hz-table'>
              <Table
                columns={this.columns}
                bordered
                dataSource={paramsList.data}
                pagination={this.pagination.total > 10 ? this.pagination : false}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default List
