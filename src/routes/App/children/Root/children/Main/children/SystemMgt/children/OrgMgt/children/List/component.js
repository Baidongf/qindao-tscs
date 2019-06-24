import React from 'react'
import styles from './component.module.scss'
import {Link} from 'react-router-dom'
import {Input, Button, Table, Select, Modal, Switch} from 'antd'
import HzLink from 'components/HzLink'

import {commonChangeHandler} from 'utils/antd'

let PAGE_SIZE = 10
const Option = Select.Option
const FILTER_INIT_VALUES = {
  status: undefined,
  nameOrNo: undefined
}

class List extends React.Component {

  // 成员属性、状态的声明，均在构造函数内部
  constructor(props) {
    super(props)

    this.state = {
      filterObj: {
        ...FILTER_INIT_VALUES
      },

      rowStatus: {}
    }

    this.columns = [
      {
        title: '机构名称',
        dataIndex: 'name',
        className: styles['td-name'],
        render: (value, row, index) => <HzLink to={`/root/main/systemMgt/orgMgt/detail?id=${row.id}`}><span
          title={value}>{value}</span></HzLink>,
      }, {
        title: '机构编号',
        dataIndex: 'orgNo',
        render: (value, row, index) => {
          return (<span title={value}>{value}</span>)
        }
      }, {
        title: '上级机构',
        dataIndex: 'parentName',
        render: (value, row, index) => {
          return (<span title={value}>{value}</span>)
        }
      }, {
        title: '机构等级',
        dataIndex: 'level',
        render: (text) => {
          return text ? text : '暂无'
        }
      },
      // {
      //   title: '生效日期区间',
      //   dataIndex: 'effectiveDate',
      //   width: 260,
      //   render: (value, row) => {
      //     return `${row.effectiveDate} 至 ${row.expiryDate}`
      //   }
      // }, {
      //   title: '状态',
      //   dataIndex: 'status',
      //   align: 'center',
      //   render: (value, row, index) => {
      //     return <Switch
      //       checked={this.state.rowStatus[index]}
      //       checkedChildren='有效'
      //       unCheckedChildren='无效'
      //       onChange={this.switchChangeHandler.bind(this, row, index)}
      //     />
      //   }
      // },
      {
        title: '操作',
        align: 'center',
        key: 'operation',
        width: 80,
        className: 'operation-column',
        render: (value, row, index) => (
          <div className={styles['operation-area']}>
            <HzLink
              to={`/root/main/systemMgt/orgMgt/createOrEdit?operation=edit&id=${row.id}`}
              className={styles['hz-link']}
            >编辑</HzLink>
          </div>
        )
      }]

    this.pagination = {
      className: styles['pagination-container'],
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


  switchChangeHandler(row, index) {
    const rowStatus = this.state.rowStatus
    const data = {
      id: row.id,
      orgNo: row.orgNo,
      name: row.name,
      status: rowStatus[index] ? '0' : '1',
    }

    this.props.updateOrg(data, () => {
      this.setState({
        rowStatus: Object.assign(this.state.rowStatus, {
          [index]: data.status === '1'
        })
      })
    })
  }

  deleteOrg(id) {
    Modal.confirm({
      title: '确定删除',
      content: '确认删除该机构？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.deleteOrg(id).then(() => {
          this.searchHandler()
        })
      }
    })
  }

  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'filterObj', key, value)
  }

  searchHandler() {
    const obj = {
      status: this.state.filterObj.status,
      nameOrNo: this.state.filterObj.nameOrNo,
      pageNo: this.pagination.current,
      pageSize: this.pagination.pageSize
    }
    this.props.getOrgList(obj)
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

  componentWillReceiveProps({orgList}) {
    let rowStatus = {}
    if (this.props.orgList !== orgList) {
      orgList.data.forEach((item, index) => {
        item.key = item.id
        rowStatus[index] = item.status === '1'
      })

      this.pagination.total = orgList.total
      this.setState({rowStatus})
    }

  }

  render() {
    const {filterObj} = this.state
    const {orgList} = this.props

    return (
      <div className={styles['list-component']}>
        {/* <HzBreadcrumb /> */}
        <div className={styles['filter-area']}>
          <div className={styles['inputs']}>
            <Select
              value={filterObj.status}
              onChange={this.valueChangeHandler.bind(this, 'status')}
              placeholder='机构状态'
              className={styles['input-item']}
              style={{width: 116}}
            >
              <Option value='1'>有效</Option>
              <Option value='0'>无效</Option>
            </Select>
            <Input
              value={filterObj.nameOrNo}
              onChange={this.valueChangeHandler.bind(this, 'nameOrNo')}
              placeholder='请输入名称、编号搜索'
              style={{width: 773}}
            />
          </div>
          <div className={styles['buttons']}>
            <Button type='primary' className={styles['btn-item']} onClick={this.searchHandler}>搜索</Button>
            <Button className={styles['btn-item']} onClick={this.resetHandler.bind(this)}>重置</Button>
          </div>
        </div>

        <div className={styles['result-area']}>
          <div className={styles['list-header']}>
            <span className={styles['total-area']}>共找到<span className={styles['total-num']}>{orgList.total || 0}</span>条机构信息</span>
            <div className={styles['btns']}>
              <Link to='/root/main/systemMgt/orgMgt/createOrEdit?operation=create'>
                <Button type='primary' className={styles['btn-create']}>添加机构</Button>
              </Link>
            </div>
          </div>
          <div className={styles['table-area']}>
            <div className={styles['hz-table']}>
              <Table
                columns={this.columns}
                bordered
                dataSource={orgList.data}
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
