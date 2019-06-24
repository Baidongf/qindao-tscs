import React from 'react'
import './component.scss'
import { withRouter } from 'react-router-dom'
import { Table, Select } from 'antd'

const Option = Select.Option

class FinanceInfo extends React.Component {
  constructor(props){
    super(props)
    this.state = {}
    this.customerName = this.props.customerName

    this.filters = {
      reptPeriodFilter: '', // 报表周期：月/季/年
      reptYearFilter: '', // 报表期次：？
    }

    this.columns = [
      {
        align: 'center',
        title: '报表周期',
        className: 'first-column',
        dataIndex: 'reptPeriod',
        key: 'reptPeriod',
      }, {
        align: 'center',
        title: '报表期次',
        dataIndex: 'reptTermMinor',
        key: 'reptTermMinor',
      }, {
        align: 'center',
        title: '是否审计',
        dataIndex: 'isAudit',
        key: 'isAudit',
        render: (text) => {
          return (
            <span>{ parseInt(text) === 0 ? '否' : '是' }</span>
          )
        },
      }, {
        align: 'center',
        title: '是否调整',
        dataIndex: 'idAdj',
        key: 'idAdj',
        render: (text) => {
          return (
            <span>{ parseInt(text) === 0 ? '否' : '是' }</span>
          )
        },
      }, {
        align: 'center',
        title: '报表详情',
        dataIndex: 'detail',
        key: 'detail',
        render: (text, record, index) => {
          const customerName = this.customerName
          return (
            <span
              className='finance-detail-button'
              onClick={() => {
                const companyKey = record.companyKey
                const reptPeriod = record.reptPeriod
                const reptTermMinor = record.reptTermMinor
                this.props.history.push(
                  `./detail/financeReportForm?companyKey=${companyKey}&period=${encodeURIComponent(reptPeriod)}&term=${encodeURIComponent(reptTermMinor)}&name=${encodeURIComponent(customerName)}`
                )
              }}
            >查看</span>
          )
        }
      },
    ]

    this.pagination = {
      showQuickJumper: true,
      total: 0,
      current: 1,
      pageSize: 5,
      onChange: (page, pageSize) => {
        this.pagination.current = page
        this.getFinanceForm()
      },
    }

    // 计算需要下拉框渲染的年份列表
    this.years = []
    const currentYear = (new Date()).getFullYear()
    for (let year = currentYear; year > 2012; year--) {
      this.years.push(year)
    }

    this.termChangeHandler = this.termChangeHandler.bind(this)
    this.periodChangeHandler = this.periodChangeHandler.bind(this)
  }

  // 用户选择报表周期
  periodChangeHandler(reptPeriodFilter) {
    this.filters.reptPeriodFilter = reptPeriodFilter
    this.getFinanceForm()
  }

  // 用户选择报表期次
  termChangeHandler(reptYearFilter) {
    this.filters.reptYearFilter = reptYearFilter
    this.getFinanceForm()
  }

  // 获取财务信息列表
  getFinanceForm() {
    const { companyKey } = this.props
    const { current, pageSize } = this.pagination
    const { reptPeriodFilter, reptYearFilter } = this.filters
    this.props.getCustomerDetailFinance({
      companyKeyFilter: companyKey,
      pageNo: current,
      pageSize,
      reptPeriodFilter,
      reptYearFilter,
    })
  }

  componentDidMount() {
    this.getFinanceForm()
  }

  componentWillReceiveProps({ customerFinanceInfo }) {
    if (customerFinanceInfo !== this.props.customerFinanceInfo) {

      // 生成列表渲染时需要的 key
      customerFinanceInfo.data.forEach((item, index) => {
        item.key = `${item.objectKey}-${index}`
      })

      this.pagination.total = customerFinanceInfo.total
    }
  }

  shouldComponentUpdate({ customerFinanceInfo }) {
    return customerFinanceInfo !== this.props.customerFinanceInfo
  }


  render() {
    const { columns, years } = this
    const { customerFinanceInfo } = this.props

    return (
      <div className='finance-info-component'>
        <div className='filter-header'>
          <span>
            共
            <span className='color-red'> { customerFinanceInfo.total } </span>
            条财务信息
          </span>

          <span className='filter-select year-select'>
            <Select
              placeholder='年度'
              onChange={this.termChangeHandler}
            >
              <Option value=''>全部</Option>
              {/* 动态渲染，当前年份 - 2013 年 */}
              {
                years.map((year) => {
                  return (
                    <Option value={`${year}`} key={`${year}`}>{year}</Option>
                  )
                })
              }
            </Select>
          </span>

          <span className='filter-select period-select'>
            <Select
              placeholder='报告周期'
              onChange={this.periodChangeHandler}
            >
              <Option key='all' value=''>全部</Option>
              <Option key='month' value='月'>月度</Option>
              <Option key='season' value='季'>季度</Option>
              <Option key='year' value='年'>年度</Option>
            </Select>
          </span>
        </div>

        <Table
          columns={columns}
          dataSource={customerFinanceInfo.data}
          pagination={this.pagination.total > 5 ? this.pagination : false}
          rowKey='objectKey'
        />
      </div>
    )
  }
}

export default withRouter(FinanceInfo)
