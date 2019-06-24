import React from 'react'
import './component.scss'
import { Input, Button, Table, Select, DatePicker, Spin } from 'antd'
import HzLink from 'components/HzLink'
import { makeUrlString } from 'utils/url'

import { commonChangeHandler } from 'utils/antd'

const PAGE_SIZE = 10
const Option = Select.Option
const FILTER_INIT_VALUES = {
  updateTime: undefined,
  customerType: undefined,
  nameOrCustomerName: undefined,
  status: undefined,
  source: undefined,
  type: undefined,
  followUserId: undefined,
}

class SubordinateList extends React.Component {

  // 成员属性、状态的声明，均在构造函数内部
  constructor(props) {
    super(props)

    this.state = {
      filterObj: {
        ...FILTER_INIT_VALUES
      },

      localFoundCustomerManagers: [], // “跟进人”输入框根据用户的输入在全部数据中搜到的数据
      fetching: false // 控制“跟进人”输入框的搜索状态
    }

    this.customerType = ['行内', '行外']
    this.optStatus = ['新建', '沟通', '完成', '终止']

    this.columns = [{
      title: '商机名称',
      dataIndex: 'name',
      width: 310,
      className: 'td-name',
      render: (value, row, index) => (
        <div>
          <p>
            <HzLink to={`/root/main/opportunityMgt/home/detail?id=${row.id}`}>
              <span className="td-name-title" title={value}>{value}</span>
            </HzLink>
          </p>
          <p className="list-detail">
            <span className="listing-detail one">{row.customerName}</span>
            <span
              className={`listing-detail ${row.customerType === '0' ? 'inner-tag' : 'outer-tag'}`}
            >{this.customerType[row.customerType]}</span>
          </p>
        </div>
      ),
    }, {
      title: '商机类型',
      dataIndex: 'type',
      width: 150,
      render: (value, row, index) => {
        return (<span title={value}>{value}</span>)
      }
    }, {
      title: '商机状态',
      dataIndex: 'status',
      width: 100,
      render: (value, row, index) => {
        return (<span title={value}>{this.optStatus[value]}</span>)
      }
    }, {
      title: '商机来源',
      width: 115,
      dataIndex: 'source',
      render: (text) => { return text ? text : '--' }
    }, {
      title: '跟进人',
      width: 60,
      dataIndex: 'followUserName',
      render: (text) => { return text ? text : '--' }
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 115,
      render: (text) => { return text ? text.split(' ')[0] : '暂无' }
    }, {
      title: '最近维护日期',
      width: 115,
      dataIndex: 'updateTime',
      render: (text) => { return text ? text.split(' ')[0] : '暂无' }
    }, {
      title: '操作',
      align: 'center',
      key: 'operation',
      width: 120,
      render: (value, row, index) => (
        <div className='operation-column'>
          {
            localStorage['USER_ID']&&localStorage['USER_ID'] == value.userId?
            <Button type="primary"
              className='operation-btn edit'
              onClick={this.jumpToEditPage.bind(this, row.id)}
            >编辑</Button>:""
            //
          }
        </div>
      )
    }]

    this.pagination = {
      showQuickJumper: true,
      total: 0,
      current: 1,
      pageSize: PAGE_SIZE,
      onChange: (page, pageSize) => {
        this.pagination.current = page
        // this.jobsQueryConfig.page = page - 1
        this.searchHandler()
      }
    }

    this.searchHandler = this.searchHandler.bind(this)
    this.exportHandler = this.exportHandler.bind(this)
    this.resetHandler = this.resetHandler.bind(this)
    this.debounce = this.debounce.bind(this)
    this.searchCustomerManagers = this.searchCustomerManagers.bind(this)
    this.jumpToEditPage = this.jumpToEditPage.bind(this)
  }
  // 跳转去编辑商机页面
  jumpToEditPage(businessId){
    const url = `/root/main/opportunityMgt/home/createOrEdit?operation=edit&id=${businessId}`
    this.props.history.push(url)
    // console.log(this)
  }

  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'filterObj', key, value)
  }

  searchHandler() {

    const {
      status,
      nameOrCustomerName,
      updateTime,
      customerType,
      type,
      source,
      followUserId,
    } = this.state.filterObj

    const { current, pageSize } = this.pagination

    const obj = {
      status,
      nameOrCustomerName,
      updateTime: !!updateTime ? updateTime.format('YYYY-MM-DD') : '',
      customerType,
      type,
      source,
      followUserId,
      pageNo: current,
      pageSize,
    }

    this.props.getSubordinateList(obj)
  }

  // 导出 excel 表
  exportHandler() {
    const {
      status,
      nameOrCustomerName,
      updateTime,
      customerType,
      type,
      source,
      followUserId,
    } = this.state.filterObj

    const { current, pageSize } = this.pagination

    const obj = {
      status,
      nameOrCustomerName,
      updateTime: !!updateTime ? updateTime.format('YYYY-MM-DD') : '',
      customerType,
      type,
      source,
      followUserId,
      pageNo: current,
      pageSize,
    }

    var exportParams = makeUrlString('/crm-fd/api/businessChance/export', obj)
    window.open(exportParams)
  }


  // 搜索客户经理(在 prop 的 allManagers 中搜)
  searchCustomerManagers(userInput) {
    // 开启搜索状态
    this.setState({
      localFoundCustomerManagers: [],
      fetching: true
    })

    const allManagers = this.props.allManagers.data

    // 如果全部数据是空，则直接结束搜索
    if (allManagers.length < 1 || userInput.trim() === '') {
      this.setState({ fetching: false })
      return null
    }

    let searchResults = []
    searchResults = allManagers.filter((manager) => {
      return manager.name.indexOf(userInput) > -1 || manager.id.indexOf(userInput) > -1
    })


    setTimeout(() => {
      this.setState({
        localFoundCustomerManagers: searchResults,
        fetching: false,
      })
    }, 1000)

  }


  // 防抖
  debounce(fn, delay) {
    return function(args) {
      let that = this
      clearTimeout(fn.id)
      fn.id = setTimeout(function() {
        fn.call(that, args)
      }, delay)
    }
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

    // 获取辖内的所有客户经理
    this.props.getAllManagers()
  }

  componentWillReceiveProps({ subordinateList, allManagers }) {
    if (this.props.subordinateList !== subordinateList) {
      this.pagination.total = subordinateList.total
    }


    if (allManagers !== this.props.allManagers) {
      // 先只展示前10个跟进人选项（客户经理）
      this.setState({
        localFoundCustomerManagers: allManagers.data.slice(0, 20)
      })
    }
  }

  render() {
    const { filterObj, localFoundCustomerManagers, fetching } = this.state
    const { subordinateList } = this.props

    return (
      <div className='subordinate-list-component'>
        <div className='filter-area'>
          <div className='inputs'>

            {/* 客户类型 */}
            <Select
              value={filterObj.customerType}
              onChange={this.valueChangeHandler.bind(this, 'customerType')}
              placeholder='客户类型'
              className='input-item common-length'
              style={{ width: 250 }}
            >
              <Option value='0'>行内</Option>
              <Option value='1'>行外</Option>
            </Select>

            {/* 商机类型 */}
            <Select
              value={filterObj.type}
              onChange={this.valueChangeHandler.bind(this, 'type')}
              placeholder='商机类型'
              className='input-item common-length'
              style={{ width: 250 }}
            >
              <Option value='业务到期'>业务到期</Option>
              <Option value='企业注册'>企业注册</Option>
              <Option value='供应链业务'>供应链业务</Option>
              <Option value='融资需求'>融资需求</Option>
              <Option value='投资需求'>投资需求</Option>
              <Option value='咨询顾问'>咨询顾问</Option>
            </Select>

            {/* 商机状态 */}
            <Select
              value={filterObj.status}
              onChange={this.valueChangeHandler.bind(this, 'status')}
              placeholder='商机状态'
              className='input-item common-length'
              style={{ width: 250 }}
            >
              <Option value='0'>新建</Option>
              <Option value='1'>沟通</Option>
              <Option value='2'>完成</Option>
              <Option value='3'>终止</Option>
            </Select>

            {/* 商机来源 */}
            <Select
              value={filterObj.source}
              onChange={this.valueChangeHandler.bind(this, 'source')}
              placeholder='商机来源'
              className='input-item last-input-item common-length'
              style={{ width: 250 }}
            >
              <Option value='手动创建'>手动创建</Option>
              <Option value='系统创建'>系统创建</Option>
            </Select>

            {/* 跟进人 */}
            <Select
              allowClear
              showSearch
              showArrow={false}
              style={{ width: 250 }}
              placeholder='跟进人'
              notFoundContent={fetching ? <Spin size="small" /> : null}
              onChange={this.valueChangeHandler.bind(this, 'followUserId')}
              onSearch={this.debounce(this.searchCustomerManagers, 500)}
              className='input-item'
              filterOption={false}
            >
              {
                localFoundCustomerManagers.map(manager => {
                  return (
                    <Option
                      key={ manager.id }
                      value={ manager.id }
                    >{ manager.name }</Option>
                  )
                })
              }
            </Select>

            {/* 最近维护日期 */}
            <DatePicker
              value={filterObj.updateTime}
              onChange={this.valueChangeHandler.bind(this, 'updateTime')}
              placeholder='最近维护日期'
              className='input-item common-length bg-white'
              style={{ width: 250 }}
            >
            </DatePicker>

            {/* 搜索输入框 */}
            <Input
              value={filterObj.nameOrCustomerName}
              onChange={this.valueChangeHandler.bind(this, 'nameOrCustomerName')}
              placeholder='请输入商机名称，客户名称'
              style={{ width: 384 }}
            />

            {/* 按钮区域 */}
            <div className='buttons'>
              <Button type='primary' className='btn-item' onClick={this.searchHandler}>搜索</Button>
              <span className='reset-btn' onClick={this.resetHandler.bind(this)}>重置</span>
            </div>

          </div>
        </div>

        {/* 结果区域 */}
        <div className='result-area'>

          <div className='list-header clearfix'>
            <span className='total-area'>共找到<span className='total-num'>{subordinateList.total || 0}</span>条商机信息</span>
            <div className='btns'>
              <HzLink to='/root/main/opportunityMgt/home/createOrEdit?operation=create'>
                <Button type='primary' className='btn-create'>新建商机</Button>
              </HzLink>
              <Button type='default' className='btn-export' onClick={this.exportHandler}>导出商机</Button>
            </div>
          </div>

          <div className='table-area'>
            <div className='hz-table'>
              <Table
                rowKey='id'
                columns={this.columns}
                bordered
                dataSource={subordinateList.data}
                pagination={this.pagination.total > 10 ? this.pagination : false}
              />
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default SubordinateList
