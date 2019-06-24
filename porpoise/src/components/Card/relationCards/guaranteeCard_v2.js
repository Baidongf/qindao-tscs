import React from 'react'
import { connect } from 'react-redux'
import Layout from '../Layout'
import InputRange from '../partials/InputRange'
import InputDatePicker from '../partials/InputDatePicker'
import { getDetailList, toggleCardType } from 'actions/Card'
import Pagination from 'rc-pagination'
import moment from 'moment'
import 'rc-pagination/assets/index.css'

class GuaranteeCard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      startDate: {},            // 保存筛选条件 日期
      endDate: {},
      value: {},                // 保存筛选条件 金额
      pageSize: 5,
      current: 1,
      valueValid: true,
      startDateValid: true,
      endDateValid: true,
      filterOptionValid: true,
      recordList: [],
      filterList: [],
      pagList: [],
      resetAll: false,
      isFilterOpen: false
    }

    this.handleInputRange = this.handleInputRange.bind(this)
    this.getRecordList = this.getRecordList.bind(this)
    this.changePage = this.changePage.bind(this)
    this.clearFilter = this.clearFilter.bind(this)
    this.setFilter = this.setFilter.bind(this)
    this.toggleFilter = this.toggleFilter.bind(this)
  }

  componentDidMount () {
    this.getRecordList(this.props.curEdge)
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.curEdge._id.includes('guarantee')) return // 用于判断在各种线型间切换的情况

    if (nextProps.curEdge._id !== this.props.curEdge._id) {
      this.getRecordList(nextProps.curEdge)
    }
  }

  handleInputRange (name, range) {
    const validKey = `${name}Valid`
    this.state[validKey] = range.max === undefined || range.min === undefined || range.min < range.max

    this.setState({
      [name]: range,
      resetAll: false,
      filterOptionValid: this.state.startDateValid && this.state.endDateValid && this.state.valueValid
    })
  }

  changePage (current, pageSize) {
    const offset = (current - 1) * pageSize

    this.setState({
      current,
      pagList: this.state.filterList.slice(offset, offset + pageSize)
    })
  }

  getRecordList (curEdge) {
    const recordList = this.props.originChartData.edges.filter((e) =>
      e._type === 'guarantee' && e._from === curEdge._from && e._to === curEdge._to) || []
    recordList.sort((a, b) => a.data.start_date < b.data.start_date)

    this.setState({
      recordList,
      filterList: recordList,
      pagList: recordList.slice(this.state.current - 1, this.state.pageSize)
    })
  }

  setFilter () {
    const { startDate, endDate, value, recordList, pageSize, filterOptionValid } = this.state
    if (!filterOptionValid) return

    const filterList = recordList.filter((item) =>
      (!value.min || item.data.money > value.min) &&
      (!value.max || item.data.money < value.max) &&
      (!startDate.min || Date.parse(item.data.start_date) > Date.parse(startDate.min)) &&
      (!startDate.max || Date.parse(item.data.start_date) < Date.parse(startDate.max)) &&
      (!endDate.min || Date.parse(item.data.end_date) > Date.parse(endDate.min)) &&
      (!endDate.max || Date.parse(item.data.end_date) < Date.parse(endDate.max))
    )

    this.setState({
      filterList
    }, () => {
      this.changePage(1, pageSize)
    })
  }

  clearFilter () {
    this.setState({
      startDate: {},
      endDate: {},
      value: {},
      filterList: this.state.recordList,
      resetAll: true,
      startDateValid: true,
      endDateValid: true,
      valueValid: true,
      filterOptionValid: true
    }, () => {
      this.changePage(1, this.state.pageSize)
    })
  }

  toggleFilter () {
    this.setState({
      isFilterOpen: !this.state.isFilterOpen
    })
  }

  generateBackBtn () {
    let BackBtn = null
    const getBackBtnDiv = getBackBtn.bind(this)
    if (this.props.curNode._id && this.props.curNode._id.includes('mergeNode')) {
      BackBtn = getBackBtnDiv('merge_relation', '群体详情')
    }

    function getBackBtn (cardType, text) {
      return (
        BackBtn = (
          <div className='card-back-wrapper clearfix' onClick={() => this.props.toggleCardType(cardType)}>
            <i className='back' />
            <span className='back-text'>{text}</span>
          </div>
        )
      )
    }
    return BackBtn
  }

  render () {
    const { originChartData, curEdge } = this.props
    const { recordList, filterOptionValid, filterList, valueValid, startDateValid, endDateValid, resetAll, pagList, isFilterOpen } = this.state

    const vertexes = originChartData.vertexes
    const fromCompanyName = vertexes.find((v) => v._id === curEdge._from).name
    const toCompanyName = vertexes.find((v) => v._id === curEdge._to).name
    const total = filterList.length

    const CardBody = (
      <div className='clearfix'>
        <dl className='description-list-2 scroll-style'>
          <dt className='double-list-label'>被担保方:</dt>
          <dd className='double-list-value' title={toCompanyName}>{toCompanyName}</dd>
          <dt className='double-list-label'>担保方:</dt>
          <dd className='double-list-value' title={fromCompanyName}>{fromCompanyName}</dd>
        </dl>
        <p className='count-area clearfix'>
          {recordList.length}条担保记录
          <button onClick={this.toggleFilter} className='btn toggle-filter-btn'>
            {
              isFilterOpen ? '收起筛选' : '展开筛选'
            }
          </button>
        </p>
        {
          isFilterOpen ? (
            <section className='filter-panel clearfix'>
              <InputDatePicker
                filterTitle='起始日期'
                handleInputRange={this.handleInputRange}
                name='startDate'
                placeholder='请输入时间'
                reset={resetAll}
              />
              <p className={startDateValid ? 'hide' : 'error'}>前一个日期必须小于后一个日期</p>
              <InputDatePicker
                filterTitle='终止日期'
                handleInputRange={this.handleInputRange}
                name='endDate'
                placeholder='请输入时间'
                reset={resetAll}
              />
              <p className={endDateValid ? 'hide' : 'error'}>前一个日期必须小于后一个日期</p>
              <InputRange
                filterTitle='担保金额(万元)'
                handleInputRange={this.handleInputRange}
                name='value'
                placeholder='请输入金额'
                unit={10000}
                reset={resetAll}
              />
              <p className={valueValid ? 'hide' : 'error'}>前一个值必须小于后一个值</p>
              <p className='operation-btns'>
                <button
                  className={'money-flow-btn ok-btn' + (filterOptionValid ? '' : ' invalid')}
                  onClick={this.setFilter}>确定</button>
                <button
                  className={'money-flow-btn cancle-btn' + (filterOptionValid ? '' : ' invalid')}
                  onClick={this.clearFilter}>清空</button>
              </p>
            </section>
          ) : null
        }
        <table>
          <thead>
            <tr>
              <th width='20%'>担保金额</th>
              <th>起始日期</th>
              <th>终止日期</th>
              <th width='30%'>担保类型</th>
            </tr>
          </thead>
          <tbody>
            {
              pagList.length ? (
                pagList.map((item, idx) => (
                  <tr key={idx}>
                    <td>{ item.data.money || '--' }</td>
                    <td>{ moment(item.data.start_date).format('YYYY-MM-DD') || '--' }</td>
                    <td>{ moment(item.data.end_date).format('YYYY-MM-DD') || '--' }</td>
                    <td>{ item.data.type || '--' }</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='4'>暂无数据</td>
                </tr>
              )
            }
          </tbody>
        </table>

        <div className='pagination-container'>
          <Pagination
            showTotal={(total) => `共 ${total} 条`}
            total={total}
            current={this.state.current}
            pageSize={this.state.pageSize}
            onChange={this.changePage}
          />
        </div>
      </div>
    )

    const CardHeader = (
      <div>
        { this.generateBackBtn() }
        <div>
          <h2 className='name'>担保详情</h2>
        </div>
      </div>
    )

    return (
      <Layout
        cardHeader={CardHeader}
        cardBody={CardBody}
        name='担保详情'
        customClass='money-flow-card' />
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getDetailList: (postBody) => dispatch(getDetailList(postBody)),
    toggleCardType: (type) => dispatch(toggleCardType(type))
  }
}

const mapStateToProps = (state) => {
  return {
    curEdge: state.curEdge,
    curNode: state.curNode,
    originChartData: state.originChartData
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GuaranteeCard)
