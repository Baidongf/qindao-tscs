import React from 'react'
import './component.scss'
import { Input, Button, Table, Select } from 'antd'
import HzLink from 'components/HzLink'


import { commonChangeHandler } from 'utils/antd'

const PAGE_SIZE = 10
const Option = Select.Option
const FILTER_INIT_VALUES = {
  createTime: undefined,
  customerType: undefined,
  nameOrCustomerName: undefined,
  status: undefined,
  source: undefined,
  type: undefined
}

class CommonList extends React.Component {

  // 成员属性、状态的声明，均在构造函数内部
  constructor(props) {
    super(props)

    this.state = {
      filterObj: {
        ...FILTER_INIT_VALUES
      },

    }

    this.customerType = ['行内', '行外']

    this.columns = [{
      title: '商机名称',
      dataIndex: 'name',
      width: 310,
      className: 'td-name',
      render: (value, row, index) => (
        <div>
          <p>
            <HzLink to={`/root/main/opportunityMgt/home/commonDetail?id=${row.id}`}>
              <span title={value}>{value}</span>
            </HzLink>
          </p>
          <p className="list-detail">
            {/* <span className="listing-detail one">{row.customerName}</span> 6.04 行方确定取消展示客户名称 */}
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
      title: '创建时间',
      dataIndex: 'createTime',
      width: 130,
      render: (text) => { return text ? text.split(' ')[0] : '暂无' }
    }]

    this.pagination = {
      showQuickJumper: true,
      total: 0,
      current: 1,
      pageSize: PAGE_SIZE,
      onChange: (page, pageSize) => {
        this.pagination.current = page
        this.searchHandler()
      }
    }

    this.searchHandler = this.searchHandler.bind(this)
    this.resetHandler = this.resetHandler.bind(this)
  }


  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'filterObj', key, value)
  }

  searchHandler() {
    const obj = {
      nameOrCustomerName: this.state.filterObj.nameOrCustomerName,
      customerType: this.state.filterObj.customerType,
      type: this.state.filterObj.type,
      pageNo: this.pagination.current,
      pageSize: this.pagination.pageSize
    }

    this.props.getCommonList(obj)
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

  componentWillReceiveProps({ commonList }) {
    if (this.props.commonList !== commonList) {
      this.pagination.total = commonList.total
    }
  }

  render() {
    const { filterObj } = this.state
    const { commonList } = this.props

    return (
      <div className='common-list-component'>
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


            {/* 搜索输入框 */}
            <Input
              value={filterObj.nameOrCustomerName}
              onChange={this.valueChangeHandler.bind(this, 'nameOrCustomerName')}
              placeholder='请输入商机名称，客户名称'
              style={{ width: 380 }}
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
            <span className='total-area'>共找到<span className='total-num'>{commonList.total || 0}</span>条商机信息</span>
          </div>

          <div className='table-area'>
            <div className='hz-table'>
              <Table
                rowKey='id'
                columns={this.columns}
                bordered
                dataSource={commonList.data}
                pagination={this.pagination.total > 10 ? this.pagination : false}
              />
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default CommonList
