import React from 'react'
import './component.scss'
import { Link } from 'react-router-dom'
import { Input, Button, Table, Modal, Switch } from 'antd'
import HzLink from 'components/HzLink'

import { commonChangeHandler } from 'utils/antd'

const PAGE_SIZE = 10
const FILTER_INIT_VALUES = {
  pageNo: undefined,
  pageSize: undefined,
  roleName:undefined,
}

class List extends React.Component {

  // 成员属性、状态的声明，均在构造函数内部
  constructor(props) {
    super(props)

    this.columns = [{
      title: '角色名称',
      width: '25%',
      dataIndex: 'name',
      className: 'td-name',
      key: 'name',
      render: (value, row, index) => {
        return <HzLink
          to={`/root/main/systemMgt/roleMgt/detail/${row.id}`}
          className='btn-item'
        >{value || '--'}</HzLink>
      }
    }, {
      title: '角色备注',
      width: '50%',
      dataIndex: 'remark',
      key: 'remark',
      render: (value) => {
        return <span>{ value || '--' }</span>
      }
    }, {
      title: '状态',
      dataIndex: 'enabledFlag',
      align: 'center',
      key: 'enabledFlag',
      render: (value, row, index) => {
        return <Switch
          checked={this.state.rowStatus[index]}
          checkedChildren='有效'
          unCheckedChildren='无效'
          onChange={this.switchChangeHandler.bind(this, row, index)}
        />
      }
    }, {
      title: '操作',
      align: 'center',
      render: (value, row, index) => (
        <div className='operation-area'>
          <HzLink
            to={`/root/main/systemMgt/roleMgt/createOrEdit?operation=edit&id=${row.id}`}
          >
            <Button className='edit-role-btn'>编辑</Button>
          </HzLink>
        </div>
      )
    }]

    this.state = {
      filterObj: {
        ...FILTER_INIT_VALUES
      },

      rowStatus: { }
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

  switchChangeHandler(row, index) {
    const that = this
    const rowStatus = this.state.rowStatus
    const data = {
      id: row.id,
      enabledFlag: rowStatus[index] ? '0' : '1',
    }

    this.props.updateRoleStatus(data, function(){
      // 将按钮置为对应的状态
      that.setState({
        rowStatus: Object.assign(that.state.rowStatus, {
          [index]: !rowStatus[index]
        })
      })
    }, function(){
      console.log('fail')
    })
  }

  deleteRole(id) {
    Modal.confirm({
      title: '确定删除该角色？',
      content: '删除后角色资源将全部清空',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.deleteRole(id).then(() => {
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
      roleName: this.state.filterObj.roleName,
      pageNo: this.pagination.current,
      pageSize: this.pagination.pageSize
    }
    this.props.getRoleList(obj)
  }

  resetHandler() {
    this.setState({
      filterObj: {
        ...FILTER_INIT_VALUES
      }
    })
    this.props.getRoleList()
  }

  componentDidMount() {
    this.searchHandler()
  }

  componentWillReceiveProps({ roleList }) {
    const rowStatus = {}
    if (this.props.roleList !== roleList) {
      roleList.data.forEach((item, index) => {
        item.key = item.id
        rowStatus[index] = item.enabledFlag === '1'
      })
      this.pagination.total = roleList.total
      this.setState({ rowStatus })
    }
  }

  render() {
    const { filterObj } = this.state
    const { roleList } = this.props

    return (
      <div className='role-list-component'>
        {/* <HzBreadcrumb /> */}
        <div className='filter-area'>
          <div className='inputs'>
            <Input
              value={filterObj.roleName}
              onChange={this.valueChangeHandler.bind(this, 'roleName')}
              placeholder='请输入角色名称'
              style={{ width: 905 }}
            />
          </div>
          <div className='buttons'>
            <Button type='primary' className='btn-item' onClick={this.searchHandler.bind(this, false)}>搜索</Button>
            <Button className='btn-item' onClick={this.resetHandler.bind(this)}>重置</Button>
          </div>
        </div>
        <div className='result-area'>
          <div className='list-header clearfix'>
            <span className='total-area'>共找到<span className='total-num'>{roleList.total}</span>条角色信息</span>
            <div className='btns'>
              <Link to='/root/main/systemMgt/roleMgt/createOrEdit?operation=create'>
                <Button type="primary">添加角色</Button>
              </Link>
            </div>
          </div>
          <div className='table-area'>
            <div className='hz-table'>
              <Table
                columns={this.columns}
                bordered
                dataSource={roleList.data}
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
