import React from 'react'
import { connect } from 'react-redux'
import { configObj } from './msg.config'
import { getSingleCompanyRelativeChart } from '../../modules/GroupRelationCard'
import Force from '../lib/d3.force';

class EventDetail extends React.Component {
  constructor (props) {
    super(props)
    this.curIndex = 0
    this.riskList = {}

    this.formatVals = this.formatVals.bind(this)
    this.unicode2CN = this.unicode2CN.bind(this)
    this.getSingleCompanyRelativeChart = this.getSingleCompanyRelativeChart.bind(this)
  }

  componentWillMount () {
    this.curIndex = this.props.index
    this.getSingleCompanyRelativeChart()
  }
  getSingleCompanyRelativeChart () {
    if (this.props.showRelativeGraph) {
      let relativeCompany = this.props.riskList[this.curIndex].company
      let companyNames = []
      companyNames.push(this.props.singleCompany)
      companyNames.push(relativeCompany)
      this.props.depth && this.props.getSingleCompanyRelativeChart(companyNames, this.props.depth)
    }
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.index !== nextProps.index) {
      this.curIndex = nextProps.index
      this.getSingleCompanyRelativeChart()
    }
  }

  formatVals (key, val) {
    let dateArr = ['publish_time', 'publish_date', 'filing_date', 'case_date', 'reg_date', 'court_time'];
    if (dateArr.indexOf(key) > -1) {
      return this.datetimeToDate(val)
    }
    return val
  }

  datetimeToDate (datetime) {
    if (typeof (datetime) === 'undefined') {
      return ''
    }
    return datetime.split(' ')[0]
  }

  unicode2CN (value) {
    if (value !== '' && typeof value === 'string') {
      let result = unescape(value.replace(/\\u/g, '%u'))
      return result
    }
    return value ? value.toString() : '--'
  }

  genDetailList (detailData) {
    return (
      <table>
        <thead>
          <tr>
            <th>公司名称</th>
          </tr>
        </thead>
        <tbody>
          {
            detailData.details.list.map(function (item) {
              return (
                <tr key={item}>
                  <td>{item}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  }

  genNewAffiliate (detailData) {
    return (
      <table>
        <thead>
          <tr>
            <th>分支机构名称</th>
          </tr>
        </thead>
        <tbody>
          {
            detailData.details.list.map(function (val) {
              return (
                <tr key={val}>
                  <td>{val}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  }

  genChangeTable (detailData) {
    return (
      detailData.details.list.map(function (val, item) {
        return (
          <tr key={val['change_date'] + item}>
            <td>{val['before_content'] === ' ' ? '--' : val['before_content']}</td>
            <td>{val['after_content'] || '--'}</td>
            <td>{val['change_date'] || '--' }</td>
          </tr>
        )
      })
    )
  }

  genJudgement (detailData) {
    return (
      detailData.details['doc_content'].split('\n').map(function (item) {
        return (
          <div key={item}>{item}</div>
        )
      })
    )
  }

  genItemValue (detailData, type, subType) {
    const _this = this
    return (
      configObj[type][subType].cols.map(function (item) {
        let val = (item.en === 'defendant_list' ||
          item.en === 'plaintiff_list' ||
          item.en === 'litigant_list' ||
          item.en === 'taxpayer_name' ||
          item.en === 'win_bid_company' ||
          item.en === 'public_bid_company')
          ? detailData.details[item.en]
          : (_this.formatVals(item.en, _this.unicode2CN(detailData.details[item.en])) || '--')
        return (
          <div className={`detail-item clearfix ${item.en}`} key={item.en}>
            <div className='title'>{item.cn}</div>
            <div className='content'>
              {val}
            </div>
          </div>
        )
      })
    )
  }

  getRiskDetail () {
    let svgId = this.props.riskType + 'risk_relative_graph'
    if (this.props.showRelativeGraph) {
      const riskRelativeGraph = this.refs.risk_relative_graph
      const singleCompanyRelativeChart = this.props.singleCompanyRelativeChart
      if (singleCompanyRelativeChart && riskRelativeGraph) {
        // $('#' + svgId).forceGraph({
        //   data: singleCompanyRelativeChart
        // })
        const chart = new Force({
          ele: riskRelativeGraph,
          data: singleCompanyRelativeChart
        })
        chart.init()
      }
    }
    if (!this.riskList.length) {
      return ''
    }
    const detailData = this.riskList[this.curIndex]
    const type = detailData.typeEnName
    const subType = detailData.subTypeEnName
    let detailItem = ''
    let subItem = ''

    if (subType === 'bulletin' ||
      subType === 'court_fygg' ||
      subType === 'court_ktgg' ||
      subType === 'judge_process' ||
      subType === 'judgement_wenshu'
    ) {
      subItem = (
        <div className='detail-item clearfix role'>
          <div className='title'>身份</div>
          <div className='content'>
            {detailData.role || '--'}
          </div>
        </div>
      )
    }

    if (configObj[type][subType]['showType'] === 'list' && detailData.details.list) {
      subItem = this.genDetailList(detailData)
    }

    if (subType === 'tax_payer_level_A') {
      detailItem = (
        <table>
          <thead>
            <tr>
              <th>纳税人名称</th>
              <th>纳税人识别号</th>
              <th width='70'>评价年度</th>
            </tr>
          </thead>
          <tbody>
            <tr key={detailData.details.taxpayer_code}>
              <td>{detailData.details.taxpayer_name}</td>
              <td>{detailData.details.taxpayer_code}</td>
              <td>{detailData.details.year}</td>
            </tr>
          </tbody>
        </table>
      )
    } else if (subType === 'new_affiliate') {
      detailItem = this.genNewAffiliate(detailData)
    } else if (subType === 'legal_man_change' ||
      subType === 'shareholder_change' ||
      subType === 'place_change' ||
      subType === 'registor_capital_change' ||
      subType === 'senior_executive_change') {
      detailItem = (
        <table>
          <thead>
            <tr>
              <th>变更前</th>
              <th>变更后</th>
              <th width='70'>变更时间</th>
            </tr>
          </thead>
          <tbody>
            {this.genChangeTable(detailData)}
          </tbody>
        </table>
      )
    } else {
      detailItem = (
        <div className='map-tmpl'>
          {subItem}
          {this.genItemValue(detailData, type, subType)}
        </div>
      )
    }
    return (
      <div className='risk-info-body scroll-style'>
        <div className='risk-detail'>
          { detailItem }
          {
            this.props.showRelativeGraph ? (
              <div className='risk-graph'>
                <p className='relative-reason'>关联原因</p>
                <svg id={svgId} width='514' height='300' ref='risk_relative_graph' />
              </div>
            ) : (
              ''
            )
          }
        </div>
      </div>
    )
  }

  render () {
    this.riskList = this.props.riskList

    return (
      <div>
        <div className='risk-info-sub-title'>
          <p className='company-name'>{this.riskList.length && this.riskList[this.curIndex].company}</p>
          <p className='risk-title'>{this.riskList.length && this.riskList[this.curIndex].title}</p>
        </div>
        { this.getRiskDetail() }
      </div>
    )
  }
}

/**
 * map state to props
 * @param {Object} state state
 * @return {Object} state
 */
const mapStateToProps = function (state) {
  return {
    singleCompanyRelativeChart: state.singleCompanyRelativeChart,
  }
}

/**
 * map dispatch to props
 * @param {Object} dispatch dispatch
 * @return {Object} action
 */
const mapDispatchToProps = (dispatch) => {
  return {
    getSingleCompanyRelativeChart: (companyNames, depth) => dispatch(getSingleCompanyRelativeChart(companyNames, depth)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDetail)
