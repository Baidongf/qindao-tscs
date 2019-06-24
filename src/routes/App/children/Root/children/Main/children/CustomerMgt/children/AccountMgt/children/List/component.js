import React from 'react'
import './component.scss'
import { Input, Button, Table, Select } from 'antd'
import { commonChangeHandler } from 'utils/antd'
import AccountAssign from './children/AccountAssign'


const PAGE_SIZE = 10
const Option = Select.Option
const FILTER_INIT_VALUES = {
  status: undefined,
  nameOrNo: undefined,
}

class List extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      filterObj: {
        ...FILTER_INIT_VALUES
      },

      amountOrder: undefined,
      openDateOrder: undefined,

      rowStatus: {
        // 0: false
      },

      foundCustomerManagers: [], // “跟进人”输入框根据用户的输入在全部数据中搜到的数据
      fetchingManager: false, // 控制“跟进人”输入框的搜索状态
    }

    this.columns = [{
      title: '账户',
      width: 260,
      className: 'td-name',
      key: 'code',
      render: (value, row, index) => {
        return (
          <div className='account-info'>
            <p>{row.companyName || '公司名暂无数据'}</p>
            <p>{row.code}</p>
          </div>
        )
      }
    }, {
      title: '账户类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
    }, {
      title: '开户日期',
      dataIndex: 'openDate',
      sorter: true,
      key: 'openDate',
      align: 'center',
    }, {
      title: '账户余额（元）',
      dataIndex: 'amount',
      sorter: true,
      key: 'amount',
      align: 'center',
      render: (value) => {
        return value
      }
    }, {
      title: '客户经理',
      align: 'center',
      key: 'accountManager',
      render: (value, row, index) => {
        const managers = row.allocationAccountVos
        let managerStr = ''
        managers.forEach((manager) => {
          managerStr += (manager.userName + ' ')
        })
        return (
          <span>{managerStr}</span>
        )
      }
    }]

    // 只有机构账户才展示分配分配按钮
    if (this.props.listType === 'institutionAccount') {
      this.columns.push({
        title: '操作',
        key: 'operation',
        align: 'center',
        render: (value, row, index) => (
          <div className='operation-area'>
            <AccountAssign
              companyKey={row.companyKey}
              companyName={row.companyName}
              accountCode={row.code}
              okCallback={this.searchHandler}
            />
          </div>
        )
      })
    }

    this.pagination = {
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
        this.pagination.current = 1
        this.pagination.pageSize = pageSize
        this.searchHandler()
      }
    }

    this.searchHandler = this.searchHandler.bind(this)
    this.resetHandler = this.resetHandler.bind(this)

    this.handleTableChange = this.handleTableChange.bind(this)
    this.handleSortByOpenDate = this.handleSortByOpenDate.bind(this)
    this.handleSortByAmount = this.handleSortByAmount.bind(this)

  }


  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'filterObj', key, value)
  }

  searchHandler() {
    const obj = {
      typeFilter: this.state.filterObj.status,
      keyWord: this.state.filterObj.nameOrNo,
      amountOrder: this.state.amountOrder,
      openDateOrder: this.state.openDateOrder,
      pageNo: this.pagination.current,
      pageSize: this.pagination.pageSize
    }

    const listType = this.props.listType || 'myAccount'
    if (listType === 'institutionAccount') {
      this.props.getInstitutionAccountList(obj)
    } else {
      this.props.getMyAccountList(obj)
    }
  }

  handleTableChange(pagination, filters, sorter) {
    let { columnKey, order } = sorter
    if (order === 'ascend') {
      order = 'asc'
    } else if (order === 'descend') {
      order = 'desc'
    }

    // columnKey: openDate || amount
    // order: ascend || descend
    if (columnKey === 'openDate') {
      this.handleSortByOpenDate(order)
    } else if (columnKey === 'amount') {
      this.handleSortByAmount(order)
    } else {
      this.setState({
        openDateOrder: undefined,
        amountOrder: undefined,
      }, () => {
        this.searchHandler()
      })
    }

  }

  handleSortByOpenDate(openDateOrder) {
    this.setState({ openDateOrder }, () => {
      this.searchHandler()
    })
  }

  handleSortByAmount(amountOrder) {
    this.setState({ amountOrder }, () => {
      this.searchHandler()
    })
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

  componentWillReceiveProps({ institutionAccountList, myAccountList }) {
    if (this.props.institutionAccountList !== institutionAccountList) {
      this.pagination.total = institutionAccountList.total
    }
    if (this.props.myAccountList !== myAccountList) {
      this.pagination.total = myAccountList.total
    }
  }

  render() {
    const { filterObj } = this.state
    const { listType, institutionAccountList, myAccountList } = this.props

    let renderAccountList = {}
    if (listType === 'institutionAccount') {
      renderAccountList = institutionAccountList
    } else {
      renderAccountList = myAccountList
    }

    return (
      <div className='account-list-component'>
        {/* <HzBreadcrumb /> */}
        <div className='filter-area'>
          <div className='inputs'>
            <Select
              value={filterObj.status}
              onChange={this.valueChangeHandler.bind(this, 'status')}
              placeholder='账户类型'
              className='input-item common-length'
              style={{ width: 116 }}
            >
              <Option value='存款账户'>存款账户</Option>
              <Option value='贷款账户'>贷款账户</Option>
            </Select>

            <Input
              value={filterObj.nameOrNo}
              onChange={this.valueChangeHandler.bind(this, 'nameOrNo')}
              placeholder='请输入客户名称、账号'
              style={{ width: 770 }}
            />
          </div>

          <div className='buttons'>
            <Button type='primary' className='btn-item' onClick={this.searchHandler}>搜索</Button>
            <Button className='btn-item' onClick={this.resetHandler.bind(this)}>重置</Button>
          </div>
        </div>

        {/* 结果区域 */}
        <div className='result-area'>
          <div className='list-header clearfix'>
            <span className='total-area'>共<span className='total-num'>{renderAccountList.total || 0}</span>条账户信息</span>
            {/* <span className='sort-button-area'>
              <Select
                allowClear
                placeholder='开户日期排序'
                style={{ width: 170, marginRight: 15 }}
                onChange={this.handleSortByOpenDate}
              >
                <Option value='desc'>开户日期倒叙排列</Option>
                <Option value='asc'>开户日期正序排列</Option>
              </Select>

              <Select
                allowClear
                placeholder='余额排序'
                style={{ width: 170 }}
                onChange={this.handleSortByAmount}
              >
                <Option value='desc'>余额倒叙排列</Option>
                <Option value='asc'>余额正序排列</Option>
              </Select>
            </span> */}
          </div>
          <div className='table-area'>
            <div className='hz-table'>
              <Table
                columns={this.columns}
                rowKey='objectKey'
                bordered
                dataSource={renderAccountList.data}
                pagination={this.pagination.total > PAGE_SIZE ? this.pagination : false}
                onChange={this.handleTableChange}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default List
