import React from 'react'
import './component.scss'
import { Input, Button, Table, Select } from 'antd'
import HzLink from 'components/HzLink'
import OwnInstitution from 'components/OwnInstitution'
import { commonChangeHandler } from 'utils/antd'

const PAGE_SIZE = 10
const Option = Select.Option
const FILTER_INIT_VALUES = {
  titleOrCode: undefined,
  status: undefined,
  type: undefined,
  institutionIds: undefined,
}

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filterObj: {
        ...FILTER_INIT_VALUES
      },

      customerType: ['行内', '行外'],
      optStatus: ['新建', '沟通', '完成', '终止'],
    }

    this.columns = [{
      title: '活动名称',
      dataIndex: 'title',
      width: 270,
      className: 'td-name',
      render: (value, row, index) => (<div><p><HzLink to={`/root/main/marketingActivity/createActivity/detail?id=${row.id}`}><span title={value}>{value}</span></HzLink></p>
      </div>
      ),
    }, {
      title: '活动编号',
      dataIndex: 'code',
      width: 170,
      render: (value, row, index) => {
        return (<span title={value}>{value}</span>)
      }
    }, {
      title: '活动状态',
      dataIndex: 'status',
      width: 120,
      render: (value, row, index) => {
        return (<span title={value}>{this.state.optStatus[value]}</span>)
      }
    }, 
    // {
    //   title: '活动类型',
    //   width: 125,
    //   dataIndex: 'type',
    //   render: (text) => { return text ? text : '--' }
    // }, 
    {
      title: '目标户数(户)',
      dataIndex: 'households',
      width: 150,
      render: (text) => { return text ? text : '--' }
    }, {
      title: '目标金额(万元)',
      width: 170,
      dataIndex: 'amount',
      render: (text) => { return text }
    }, {
      title: '创建者',
      width: 120,
      dataIndex: 'userName',
      render: (text) => { return text ? text : '--' }
    }, {
      title: '执行方',
      width: 120,
      dataIndex: 'executorInstitutionName',
      render: (text) => { return text ? text : '--' }
    }, {
      title: '倒计时天数',
      width: 156,
      dataIndex: 'remindDay',
      render: (text) => { return text ? text : '--' }
    },]

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
      onShowSizeChange: (current, size) => {
        this.pagination.pageSize = size
        this.searchHandler()
      }
    }

    this.isCustomerManager = null
    this.institutionLevel = null

    this.searchHandler = this.searchHandler.bind(this)
    this.resetHandler = this.resetHandler.bind(this)
    this.generateExpandedSubTable = this.generateExpandedSubTable.bind(this)
  }

  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'filterObj', key, value)
  }

  searchHandler() {
    const obj = {
      status: this.state.filterObj.status,
      titleOrCode: this.state.filterObj.titleOrCode,
      institutionIds: this.state.filterObj.institutionIds,
      type: this.state.filterObj.type,
      pageNo: this.pagination.current,
      pageSize: this.pagination.pageSize
    }
    this.props.getCreateActivityList(obj)
  }

  handlePopupConfirm = (keys) => {
    let ids = keys.map(key => {
      let keyArr = key.split('-')
      return keyArr[keyArr.length - 1]
    })
    this.valueChangeHandler('institutionIds', ids)
  }

  resetHandler() {
    this.setState({
      filterObj: {
        ...FILTER_INIT_VALUES
      }
    })
    this.searchHandler()
  }

  componentWillMount() {
    const institutionLevel = localStorage.getItem('INSTITUTION_LEVEL')
    const isCustomerManager = localStorage.getItem('IS_CUSTOMER_MANAGER')
    this.institutionLevel = parseInt(institutionLevel)
    this.isCustomerManager = isCustomerManager
  }

  componentDidMount() {
    this.searchHandler()
  }

  componentWillReceiveProps({ createActivityList }) {
    if (this.props.createActivityList !== createActivityList) {
      // createActivityList.data.forEach((item, index) => {
      //   item.key = index
      // })

      this.pagination.total = createActivityList.total
    }
  }

  // 生成子表格
  generateExpandedSubTable(subTableData = {}) {
    // console.log(subTableData)
    const columns = [
      { title: '活动名称', dataIndex: 'title', key: 'title', render: text => text || '--' },
      { title: '活动编号', dataIndex: 'code', key: 'code', render: text => text || '--' },
      { title: '活动状态', dataIndex: 'status', key: 'status', render: text => this.state.optStatus[text] || '--' },
      { title: '活动类型', dataIndex: 'type', key: 'type', render: text => text || '--' },
      { title: '目标户数(户)', dataIndex: 'households', key: 'households', render: text => text || '--' },
      { title: '目标金额(万元)', dataIndex: 'amount', key: 'amount', render: text => text || '--' },
      { title: '创建者', dataIndex: 'userName', key: 'userName', render: text => text || '--' },
    ]
    // const data = [subTableData.executorUsers || {}]

    const data = [subTableData]
    return (
      <Table
        className='sub-table'
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    )
  }

  render() {
    const { filterObj } = this.state
    const { createActivityList } = this.props
    const { isCustomerManager, institutionLevel } = this

    return (
      <div className='create-marketing-list-component'>
        <div className='filter-area'>
          <div className='inputs'>

            {/* 活动状态 */}
            <Select
              value={filterObj.status}
              onChange={this.valueChangeHandler.bind(this, 'status')}
              placeholder='活动状态'
              className='input-item common-length'
              style={
                institutionLevel < 4 && isCustomerManager === '0' ?
                { width: 140, marginBottom: 15 } : { width: 116 }
              }
            >
              <Option value='0'>未开始</Option>
              <Option value='1'>执行中</Option>
              <Option value='2'>已结束</Option>
            </Select>

            {/* 活动类型 */}
            {/* <Select
              value={filterObj.type}
              onChange={this.valueChangeHandler.bind(this, 'type')}
              placeholder='活动类型'
              className='input-item common-length'
              style={
                institutionLevel < 4 && isCustomerManager === '0' ?
                { width: 340, marginBottom: 15 } : { width: 116 }
              }
            >
              <Option value='0'>营销任务</Option>
              <Option value='1'>营销活动</Option>
            </Select> */}

            {/* 执行人 */}
            {
              institutionLevel < 4 && isCustomerManager === '0' ?
              <OwnInstitution
                handlePopupConfirm={this.handlePopupConfirm}
                btnStyle={{ width: 320 }}
                buttonWording={'执行方'}
              /> : null
            }

            {/* 输入框 */}
            <Input
              value={filterObj.titleOrCode}
              onChange={this.valueChangeHandler.bind(this, 'titleOrCode')}
              placeholder='请输入活动名称，活动编号'
              style={
                isCustomerManager === '0' ?
                { width: 410, marginRight: 15 } :
                { width: 640, marginRight: 15 }
              }
            />

            <div className='buttons'>
              <Button type='primary' className='btn-item' onClick={this.searchHandler}>搜索</Button>
              <span className='btn-item reset-btn' onClick={this.resetHandler.bind(this)}>重置</span>
            </div>
          </div>
        </div>
        <div className='result-area'>
          <div className='list-header clearfix'>
            <span className='total-area'>共找到<span className='total-num'>{createActivityList.total || 0}</span>个活动</span>
            <div className='btns'>
              <HzLink to='/root/main/marketingActivity/createActivity/createOrEdit?operation=create'>
                <Button type='primary'  className='btn-create'>新建活动</Button>
              </HzLink>
            </div>
          </div>
          <div className='table-area'>
            <div className='hz-table'>
              <Table
                rowKey='id'
                columns={this.columns}
                bordered
                dataSource={createActivityList.data}
                expandedRowRender={this.generateExpandedSubTable}
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
