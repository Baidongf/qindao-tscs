import React from 'react'
import { connect } from 'react-redux'
import Layout from '../Layout'
import InputRange from '../partials/InputRange'
import InputDatePicker from '../partials/InputDatePicker'
import { getDetailList, toggleCardType, getCaseBrief } from 'actions/Card'
import Pagination from 'rc-pagination'
import moment from 'moment'
import { mergeEdgeMap } from 'graph.config'
import 'rc-pagination/assets/index.css'

class SueRelateCard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      caseDate: {},            // 保存筛选条件 日期
      pageSize: 5,
      current: 1,
      caseDateValid: true,
      filterOptionValid: true,
      recordList: [],
      filterList: [],
      pagList: [],
      resetAll: false,
      isFilterOpen: false
    }

    this.edgeTypes = ['sue_relate', 'plaintiff_relate', 'defendant_relate']

    this.handleInputRange = this.handleInputRange.bind(this)
    this.getRecordList = this.getRecordList.bind(this)
    this.changePage = this.changePage.bind(this)
    this.clearFilter = this.clearFilter.bind(this)
    this.setFilter = this.setFilter.bind(this)
    this.toggleFilter = this.toggleFilter.bind(this)
    this.showDetail = this.showDetail.bind(this)
  }

  componentDidMount () {
    this.getRecordList(this.props.curEdge)
  }

  componentWillReceiveProps (nextProps) {
    if (!this.edgeTypes.includes(nextProps.curEdge._type)) return // 用于判断在各种线型间切换的情况

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
      filterOptionValid: this.state.caseDateValid
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
    let recordList = this.props.originChartData.edges.filter((e) => {
      if (['plaintiff_relate', 'defendant_relate'].includes(curEdge._type)) { // 同为原告、同为被告不考虑方向
        return this.edgeTypes.includes(e._type) &&
          ((e._from === curEdge._from && e._to === curEdge._to) || (e._from === curEdge._to && e._to === curEdge._from))
      }
      return this.edgeTypes.includes(e._type) && e._from === curEdge._from && e._to === curEdge._to
    }) || []
    recordList.sort((a, b) => a.data.case_date < b.data.case_date)

    this.setState({
      recordList,
      filterList: recordList,
      pagList: recordList.slice(this.state.current - 1, this.state.pageSize)
    })
  }

  setFilter () {
    const { caseDate, recordList, pageSize, filterOptionValid } = this.state
    if (!filterOptionValid) return

    const filterList = recordList.filter((item) =>
      (!caseDate.min || Date.parse(item.data.case_date) > Date.parse(caseDate.min)) &&
      (!caseDate.max || Date.parse(item.data.case_date) < Date.parse(caseDate.max))
    )

    this.setState({
      filterList
    }, () => {
      this.changePage(1, pageSize)
    })
  }

  clearFilter () {
    this.setState({
      caseDate: {},
      filterList: this.state.recordList,
      resetAll: true,
      caseDateValid: true,
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

  getBodyTitle () {
    const { originChartData, curEdge } = this.props
    const vertexes = originChartData.vertexes
    const fromCompanyName = vertexes.find((v) => v._id === curEdge._from).name
    const toCompanyName = vertexes.find((v) => v._id === curEdge._to).name

    const method = {
      'sue_relate': () => (
        <dl className='description-list-2 scroll-style'>
          <dt className='double-list-label'>起诉方:</dt>
          <dd className='double-list-value' title={fromCompanyName}>{fromCompanyName}</dd>
          <dt className='double-list-label'>被起诉方:</dt>
          <dd className='double-list-value' title={toCompanyName}>{toCompanyName}</dd>
        </dl>
      ),
      'plaintiff_relate': () => (
        <dl className='description-list-2 scroll-style'>
          <dt className='double-list-label'>同为原告:</dt>
          <dd className='double-list-value show-all' title={`${fromCompanyName},${toCompanyName}`}>
            {`${fromCompanyName}，${toCompanyName}`}
          </dd>
        </dl>
      ),
      'defendant_relate': () => (
        <dl className='description-list-2 scroll-style'>
          <dt className='double-list-label'>同为被告:</dt>
          <dd className='double-list-value show-all' title={`${fromCompanyName},${toCompanyName}`}>
            {`${fromCompanyName}，${toCompanyName}`}
          </dd>
        </dl>
      )
    }

    return method[curEdge._type] && method[curEdge._type]()
  }

  showDetail (item) {
    const { reduxLocation, toggleCardType, getCaseBrief, originChartData } = this.props

    reduxLocation.query.toggle = 'case_detail'
    reduxLocation.query.toggle_src = 'sue_relate'

    let caseType = item.data.src_table || 'judgement_wenshu'
    caseType = caseType[0].toUpperCase() + caseType.substr(1)
    getCaseBrief(item.data._record_id, caseType)
    toggleCardType(caseType)
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
    const { recordList, filterOptionValid, filterList, caseDateValid, resetAll, pagList, isFilterOpen } = this.state
    const { curEdge } = this.props
    const nodeType = mergeEdgeMap[curEdge.type] && mergeEdgeMap[curEdge.type].label
    const total = filterList.length

    const CardBody = (
      <div className='clearfix'>
        {
          this.getBodyTitle()
        }
        <p className='count-area clearfix'>
          {recordList.length}条关联案件
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
                filterTitle='发生日期'
                handleInputRange={this.handleInputRange}
                name='caseDate'
                placeholder='请输入时间'
                reset={resetAll}
              />
              <p className={caseDateValid ? 'hide' : 'error'}>前一个日期必须小于后一个日期</p>
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
              <th width='55%'>标题</th>
              <th>日期</th>
              <th width='15%'>查看</th>
            </tr>
          </thead>
          <tbody>
            {
              pagList.length ? (
                pagList.map((item, idx) => (
                  <tr key={idx}>
                    <td>{ item.data.case_id || '--' }</td>
                    <td>{ moment(item.data.case_date).format('YYYY-MM-DD') || '--' }</td>
                    <td>
                      <a className='show-detail-btn' onClick={() => this.showDetail(item)}>详情</a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='3'>暂无数据</td>
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
          <h2 className='name'>{ `${nodeType} 关系详情` }</h2>
        </div>
      </div>
    )

    return (
      <Layout
        cardHeader={CardHeader}
        cardBody={CardBody}
        name={`${nodeType} 关系详情`}
        customClass='money-flow-card' />
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getDetailList: (postBody) => dispatch(getDetailList(postBody)),
    toggleCardType: (type) => dispatch(toggleCardType(type)),
    getCaseBrief: (id, type) => dispatch(getCaseBrief(id, type))
  }
}

const mapStateToProps = (state) => {
  return {
    curEdge: state.curEdge,
    curNode: state.curNode,
    originChartData: state.originChartData,
    reduxLocation: state.location
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SueRelateCard)
