import React from 'react'
import { connect } from 'react-redux'
import Layout from './Layout'
import PropTypes from 'prop-types'
import InputRange from './partials/InputRange'
import InputDatePicker from './partials/InputDatePicker'
import { getDetailList, toggleCardType } from 'actions/Card'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
/*
 * post请求 body
{
	'from': 'Company/74DFB7AAAC745B53E4D921A112CDAB46',
	'to': 'Company/DCF3F5B4D4D4461412E9C8E88FFA9421',
	'type': 'guarantee',
	'offset': 0,
	'count': 5,
	'conditionList': [
		{
			'isSection': false,
			'field': 'value',
			'sort': 'desc',
			'min': 0,
			'max': 100
		}
	]
}
*/
class GuaranteeCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      'postBody': {          // postBody 默认结构
        'type': 'guarantee',
        'offset': 0,
        'count': 5,
        'conditionList': []
      },
      'date': {},            // 保存筛选条件 日期
      'value': {},           // 保存筛选条件 金额
      'offset': 0,           // 保存分页状态
      'count': 5,            // 保存分页状态
      'current': 1,
      'valueValid': true,
      'dateValid': true
    }
    this.handleInputRange = this.handleInputRange.bind(this)
    this.getFilterMoneyFlowList = this.getFilterMoneyFlowList.bind(this)
    this.changePage = this.changePage.bind(this)
  }
  componentDidMount () {
    if (this.props.curEdge._from && this.props.curEdge._to) {
      let postBody = Object.assign({}, this.state['postBody'])
      postBody['from'] = this.props.curEdge._from
      postBody['to'] = this.props.curEdge._to
      this.props.getDetailList(postBody)
    }
  }
  componentWillReceiveProps (nextProps) {
    if (!nextProps.curEdge._id.includes('guarantee')) return
    if (this.props.curEdge._from !== nextProps.curEdge._from || this.props.curEdge._to !== nextProps.curEdge._to) {
      let postBody = Object.assign({}, this.state['postBody'])
      postBody['from'] = nextProps.curEdge._from
      postBody['to'] = nextProps.curEdge._to
      this.props.getDetailList(postBody)
    }
  }
  isEmptyObject(obj) {
    var t;
    for (t in obj)
      return !1;
    return !0
  }
  handleInputRange (name, range) {
    // field: value,date
    this.setState({[name]: range})
  }
  changePage (current, pageSize) {
    let offset = current> 0 ? (current-1) * pageSize : 0;
    let count = pageSize;
    this.state.offset = offset
    this.state.count = count
    this.state.current = current
    this.getFilterMoneyFlowList()
  }
  getFilterMoneyFlowList () {
    let postBody = Object.assign({}, this.state.postBody)
    postBody.offset =  this.state.offset
    postBody.count =  this.state.count
    postBody.type = 'guarantee'
    postBody.from = this.props.curEdge._from
    postBody.to = this.props.curEdge._to
    postBody.conditionList = []
    if (!this.isEmptyObject(this.state.date)) {
      // 验证输入的合法性
      if (this.state.date.hasOwnProperty('min') && this.state.date.hasOwnProperty('max')) {
        if (this.state.date.min > this.state.date.max) {
          this.setState({dateValid: false})
          return;
        } else {
          this.setState({dateValid: true})
        }
      }
      let filterCondition = {
        'conditionType': 'section',
        'field': 'begin_date, end_date',
        'sort': 'desc'
      }
      Object.assign(filterCondition, this.state.date)
      postBody.conditionList.push(filterCondition)
    }
    if (!this.isEmptyObject(this.state.value)) {
      if (this.state.value.hasOwnProperty('min') && this.state.value.hasOwnProperty('max')) {
        if (this.state.value.min > this.state.value.max) {
          this.setState({valueValid: false})
          return;
        } else {
          this.setState({valueValid: true})
        }
      }
      let filterCondition = {
        'conditionType': 'range',
        'field': 'value',
        'sort': 'desc'
      }
      Object.assign(filterCondition, this.state.value)
      postBody.conditionList.push(filterCondition)
    }
    this.props.getDetailList(postBody)
  }

  getAllNodes () {
    const vertexes = this.props.chartData.vertexes.concat(this.props.expandChartData.vertexes)
    const { guaranteeClusterChartData } = this.props
    for (let i in guaranteeClusterChartData) {
      vertexes.push(...guaranteeClusterChartData[i].vertexes)
    }
    return vertexes
  }

  generateBackBtn () {
    let BackBtn = null
    const getBackBtnDiv = getBackBtn.bind(this)
    if (this.props.curNode._id && this.props.curNode._id.includes('mergeNode')) {
      BackBtn = getBackBtnDiv('merge_relation', '群体详情')
    } else if (this.props.reduxLocation.query.lp_type === 'Company_cluster') {
      BackBtn = getBackBtnDiv('Company_cluster', '返回')
    } else if (['/graph/guarantee_risk'].includes(this.props.reduxLocation.pathname)) {
      BackBtn = getBackBtnDiv('Company_cluster', '返回')
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
    let vertexes = this.getAllNodes()
    let fromCompanyName = vertexes.find((v) => v._id === this.props.curEdge._from).name
    let toCompanyName = vertexes.find((v) => v._id === this.props.curEdge._to).name
    let { moneyFlowData } = this.props
    let moneyFlowList = moneyFlowData.list ? moneyFlowData.list : []
    let tfootClass = 'hide'
    if (moneyFlowList.length === 0) {
      tfootClass = 'show'
    }
    let total = moneyFlowData.total || 0
    const CardBody = (
      <div className='clearfix'>
        <dl className='description-list-2 scroll-style'>
          <div>
            <dt className='double-list-label'>被担保方:</dt>
            <dd className='double-list-value' title='{toCompanyName}'>{toCompanyName}</dd>
          </div>
          <div>
            <dt className='double-list-label'>担保方:</dt>
            <dd className='double-list-value' title='{fromCompanyName}'>{fromCompanyName}</dd>
          </div>
        </dl>
        <div className='filter-panel clearfix'>
          <InputRange
            filterTitle='担保金额(元)'
            handleInputRange={this.handleInputRange}
            name='value'
            placeholder='请输入金额'
            unit={1}
          />
          <div className={this.state.valueValid ? 'hide' : 'error'}>前一个值必须小于后一个值</div>
          <InputDatePicker
            filterTitle='担保时间区间'
            handleInputRange={this.handleInputRange}
            name='date'
            placeholder='请输入时间'
          />
          <div className={this.state.dateValid ? 'hide' : 'error'}>前一个日期必须小于后一个日期</div>
          <button
            className='money-flow-btn'
            onClick={this.getFilterMoneyFlowList}>查询</button>
        </div>
        <h3>满足条件的担保结果</h3>
        <table className='table2'>
          <thead className='thead2'>
            <tr className='tr2'>
              <td className='td2'>担保类型</td>
              <td className='td2'>起始日期</td>
              <td className='td2'>终止日期</td>
              <td className='td2'>担保金额（元）</td>
            </tr>
          </thead>
          <tbody className='tbody2'>
            {moneyFlowList.map((v, i) => {
              let trClassName = i % 2 == 0 ? 'tr2 odd' : 'tr2'
              let gType = v.type === '020' ? '最高额担保' : '一般担保'
              return (
                <tr key={v._id} className={trClassName}>
                  <td className='td2'>{gType}</td>
                  <td className='td2'>{v.begin_date}</td>
                  <td className='td2'>{v.end_date}</td>
                  <td className='td2'>{v.value}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot className={tfootClass}>
            <tr>
              <td className='td2' colSpan='4'>没有符合条件的记录</td>
            </tr>
          </tfoot>

        </table>
        <div className='pagination-container'>
          <Pagination
            showTotal={(total) => `共 ${total} 条`}
            total={total}
            current={this.state.current}
            pageSize={this.state.count}
            onChange={this.changePage}
          />
        </div>
      </div>
    )

    const Back = this.generateBackBtn()
    let CardHeader = (
      <div>
        { Back }
        <div className='switch-tab'>
          <span>担保详情</span>
        </div>
      </div>
    )

    return (
      <Layout
        cardHeader={CardHeader}
        cardBody={CardBody}
        name= '担保详情'
        customClass='money-flow-card' />
    )
  }
}

GuaranteeCard.propTypes = {
  moneyFlowData: PropTypes.PropTypes.object,
  curEdge: PropTypes.object,
  curNode: PropTypes.object,
  chartData: PropTypes.object,
  expandChartData: PropTypes.object,
  reduxLocation: PropTypes.object,
  toggleCardType: PropTypes.func,
  guaranteeClusterChartData: PropTypes.object,
}

const mapDispatchToProps = (dispatch) => {
  return {
    getDetailList: (postBody) => dispatch(getDetailList(postBody)),
    toggleCardType: (type) => dispatch(toggleCardType(type))
  }
}

const mapStateToProps = (state) => {
  return {
    moneyFlowData: state.briefData,
    curEdge: state.curEdge,
    curNode: state.curNode,
    chartData: state.chartData,
    expandChartData: state.expandChartData,
    reduxLocation: state.location,
    guaranteeClusterChartData: state.guaranteeClusterChartData,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GuaranteeCard)
