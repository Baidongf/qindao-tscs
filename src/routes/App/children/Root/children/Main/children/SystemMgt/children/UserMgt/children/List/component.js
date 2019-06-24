import React from 'react'
import './component.scss'
import { Link } from 'react-router-dom'
import { Input, Button, Table, Modal, Switch, Select } from 'antd'
import HzLink from 'components/HzLink'
import SingleOwnInstitution from 'components/SingleOwnInstitution'

import { commonChangeHandler } from 'utils/antd'

const Option = Select.Option
const PAGE_SIZE = 10
const FILTER_INIT_VALUES = {
  orgId: undefined,
  roleId: undefined,
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

    this.columns = [{
      title: '姓名',
      dataIndex: 'name',
      className: 'td-name column',
      render: (value, row) => <HzLink to={`/root/main/systemMgt/userMgt/detail?id=${row.id}`}><span title={value}>{value}</span></HzLink>
    }, {
      title: '工号',
      dataIndex: 'userNo',
      className: 'column',
      render: (value) => <span title={value}>{value}</span>
    }, {
      title: '性别',
      dataIndex: 'sex',
      className: 'column-gender column',
      render: value => {
        if (value === '1') {
          return '男'
        } else if (value === '2') {
          return '女'
        } else {
          return '其他'
        }
      }
    }, {
      title: '所属机构',
      dataIndex: 'institutionName',
      className: 'column-institution column ellipsis',
      render: (value) => (
        <span title={value}>{value}</span>
      ),
    }, {
      title: '手机',
      dataIndex: 'phone',
      className: 'column',
    }, {
      title: '岗位',
      dataIndex: 'emplyPost',
      className: 'column-job column',
      render: (value) => {
        return (
          <span>{ value || '--' }</span>
        )
      }
    }, {
      title: '角色',
      className: 'column',
      render: (value, row, index) => {
        const roles = row.roles
        const roleName = !!roles && roles.length > 0 ? roles[0].name : '--'
        return (
          <span>{roleName}</span>
        )
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      className: 'column-status column',
      render: (value, row, index) => {
        return <Switch
          checkedChildren='有效'
          unCheckedChildren='无效'
          checked={this.state.rowStatus[index]}
          onChange={this.updateUserStatus.bind(this, row, index)}
        />
      }

    }, {
      title: '操作',
      width: 250,
      align: 'center',
      className: 'column',
      render: (value, row, index) => (
        <div className='operation-area'>
          <HzLink
            to={`/root/main/systemMgt/userMgt/createOrEdit?operation=edit&id=${row.id}`}
            className='btn-item'
          >编辑</HzLink>
          <span
            className='reset-button'
            onClick={this.resetPasswordHandler.bind(this, row.id)}
          >重置密码</span>
        </div>
      )
    }]



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

  resetPasswordHandler(id) {
    const _this = this
    Modal.confirm({
      title: '确定重置密码？',
      content: '密码将被重置为默认密码',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        _this.props.resetPassword(id)
      }
    })
  }

  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'filterObj', key, value)
  }

  updateUserStatus(userObj, rowIndex, value) {
    const _this = this
    this.props.updateUserStatus({
      id: userObj.id,
      status: value ? '1' : '0'
    }, () => {
      _this.setState({
        rowStatus: Object.assign(this.state.rowStatus, { [rowIndex]: value })
      })
    })
  }

  searchHandler() {
    const { orgId, nameOrNo, roleId } = this.state.filterObj
    const { current, pageSize } = this.pagination

    let orgKey
    if (orgId && orgId.indexOf('===' > -1)) {
      // 由于 TreeSelect 的特殊性，需要对机构 id 进行预处理
      const orgKeys = orgId.split('===')[1]
      const orgKeyArr = orgKeys.split('-')
      orgKey = orgKeyArr[orgKeyArr.length - 1]
    }

    const obj = {
      orgId: parseInt(orgKey),
      roleId: parseInt(roleId),
      nameOrNo: nameOrNo,
      pageNo: current,
      pageSize: pageSize
    }
    this.props.getUserList(obj)
  }

  resetHandler() {
    this.setState({
      filterObj: {
        ...FILTER_INIT_VALUES
      }
    })
  }

  componentWillMount() {
    this.props.getOrgList()
    this.props.getAllRoles()
  }

  componentDidMount() {
    this.searchHandler()
  }

  componentWillReceiveProps({ userList }) {
    const rowStatus = {}
    if (this.props.userList !== userList) {
      userList.data.forEach((item, index) => {
        item.key = `${item.id}-${index}`
        rowStatus[index] = item.status === '1'
      })

      this.pagination.total = userList.total
      this.setState({ rowStatus })
    }

  }
  render() {
    const { filterObj } = this.state
    const { userList, allRoles } = this.props

    return (
      <div className='user-list-component'>
        <div className='filter-area'>
          <div className='inputs'>

            <span className='own-institution'>
              <SingleOwnInstitution
                value={filterObj.orgId}
                onChange={this.valueChangeHandler.bind(this, 'orgId')}
              />
            </span>

            <span className='role-selector'>
              <Select
                placeholder='用户角色'
                style={{ width: 250, marginRight: 10 }}
                value={filterObj.roleId}
                onChange={this.valueChangeHandler.bind(this, 'roleId')}
              >
                {
                  allRoles.data.map(role => {
                    return (
                      <Option
                        key={role.id}
                        value={role.id}
                      >{role.name || '--'}</Option>
                    )
                  })
                }
              </Select>
            </span>

            <Input
              value={filterObj.nameOrNo}
              onChange={this.valueChangeHandler.bind(this, 'nameOrNo')}
              placeholder='请输入员工姓名或工号'
              style={{ width: 390 }}
            />
          </div>
          <div className='buttons'>
            <Button type='primary' className='btn-item' onClick={() => {
              this.pagination.current = 1
              this.searchHandler()
            }}>搜索</Button>
            <Button className='btn-item' onClick={this.resetHandler}>重置</Button>
          </div>
        </div>


        <div className='result-area'>
          <div className='list-header clearfix'>
            <span className='total-area'>共找到<span className='total-num'>{userList.total || 0}</span>条用户信息</span>
            <div className='btns'>
              <Link to='/root/main/systemMgt/userMgt/createOrEdit?operation=create'>
                <Button  type="primary">添加用户</Button>
              </Link>
            </div>
          </div>
          <div className='table-area'>
            <div className='hz-table'>
              <Table
                // rowKey='id'
                columns={this.columns}
                bordered
                dataSource={userList.data}
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
