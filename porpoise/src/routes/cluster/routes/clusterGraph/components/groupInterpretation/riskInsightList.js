import React from 'react'
import PropTypes from 'prop-types'
import EventTable from './eventTable'
import CreditInfoHeader from './creditInfoHeader'
import LatestTable from './latestTable'
import CompanyCard from './companyCard'
import RelationCard from './relationCard'
import { connect } from 'react-redux'
import { getRiskList, getSingleCompanyRiskList, getCapitalCircleList, getMutualGuaraList, getInnerCreditTotal, getCreditOverLimitlist } from '../../modules/GroupRelationCard'
import doraemon from 'services/utils'

class RiskInsightList extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showIndex: [false],
      curClickIndex: -1,
      singleCompany: '',
      poupShowGroupTriggerName: ''
    }

    this.riskList = {}
    this.listObj = {}
    this.searchName = ''
    this.ruleType = 0     // 0: 风险洞察  1: 机会洞察
    this.pageSize = 5
    this.jsonData = {     // 单一企业请求体
      'companies': [],
      'ruleType': this.ruleType,
      'offset': 0,
      'count': this.pageSize
    }
    this.requestObj = {   // 单一企业企业数组
      'SINGLE_COMPANY': [],
      'FIRST_DEGREE': [],
      'SECOND_DEGREE': [],
      'THIRD_DEGREE': [],
      'MORE_DEGREE': []
    }
    this.singleCompanyRiskListObj = {}  //   单一企业返回数据对象

    this.toggleList = this.toggleList.bind(this)
    this.getResultItem = this.getResultItem.bind(this)
    this.getCreditOverLimitlist = this.getCreditOverLimitlist.bind(this)
  }

  componentWillMount () {
    if (this.props.singleCompany) {
      this.listObj = this.requestSingleCompanyRiskList()
      this.singleCompanyRiskListObj = {   //   单一企业返回数据对象
        'riskList': [],
        'totalCount': 0,
        'firstDegreeRiskList': [],
        'firstDegreeTotalCount': 0,
        'secondDegreeRiskList': [],
        'secondDegreeTotalCount': 0,
        'thirdDegreeRiskList': [],
        'thirdDegreeTotalCount': 0,
        'moreDegreeRiskList': [],
        'moreDegreeTotalCount': 0
      }
      for (let key in this.listObj.requestObj) {
        this.listObj.jsonData['companies'] = this.listObj.requestObj[key]
        this.props.getSingleCompanyRiskList(key, this.listObj.jsonData)
      }
    } else {
      const { query } = this.props.reduxLocation
      const jsonData = {
        groupName: query.group_name,
        groupType: query.type,
      }
      this.props.getRiskList(this.ruleType, 0, this.pageSize)
      // 获取集团内资金流转
      this.props.getCapitalCircleList(jsonData)
      // 获取集团内企业间联保互保
      this.props.getMutualGuaraList(jsonData)
      // 获取集团和行内授信总金额
      this.props.getInnerCreditTotal(jsonData)
      // 获取集团下授信超限实体(包含公司和自然人)
      this.getCreditOverLimitlist(jsonData)
      // this.props.getCreditOverLimitlist(jsonData)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.singleCompany !== nextProps.singleCompany) {
      this.props.getRiskList(this.ruleType, 0, this.pageSize)
      this.setState({
        singleCompany: nextProps.singleCompany
      })
    }
  }

  getCreditOverLimitlist (jsonData) {
    if (!jsonData.groupName) {
      const { query } = this.props.reduxLocation
      let obj = {
        groupName: query.group_name,
        groupType: query.type,
      }
      jsonData = Object.assign(jsonData, obj)
    }
    let sortOrders = [{
      property: 'creditMoney',
      direction: 'DESC'
    }]
    jsonData.sortOrders = sortOrders
    jsonData.pageSize = 5
    this.props.getCreditOverLimitlist(jsonData)
  }

  getUrlObj (name) {
    let urlObj = {}
    window.location.search.split('?')[1].split('&').forEach((d) => {
      let key = d.split('=')[0]
      let value = d.split('=')[1]
      urlObj[key] = value
    })
    return decodeURIComponent(urlObj[name])
  }

  requestSingleCompanyRiskList () {
    let requestObj = Object.assign({}, this.requestObj)
    let jsonData = Object.assign({}, this.jsonData)
    requestObj['SINGLE_COMPANY'] = this.getSearchCompanies(this.props.singleCompany)
    requestObj['FIRST_DEGREE'] = this.getSearchCompanies(this.props.relations.firstDegree)
    requestObj['SECOND_DEGREE'] = this.getSearchCompanies(this.props.relations.secondDegree)
    requestObj['THIRD_DEGREE'] = this.getSearchCompanies(this.props.relations.thirdDegree)

    return {
      requestObj,
      jsonData
    }
  }

  getSearchCompanies (data) {
    let searchComp = []
    if (typeof data === 'string') {
      searchComp.push(data)
    } else {
      searchComp = data.map((d) => d.name)
    }
    return searchComp
  }

  changeNavHandler (type) {
    this.setState({ curNav: type })
  }

  toggleList (index) {
    const state = this.state.showIndex
    state[index] = !state[index]
    this.setState({
      showIndex: state,
      // poupShowGroupTriggerName: ''
    })
  }


  setRiskListData () {
    for (let key in this.singleCompanyRiskListObj) {
      if (typeof this.singleCompanyRiskListObj[key] === 'object') {
        if (this.props.singleCompanyRiskListObj[key]) {
          this.singleCompanyRiskListObj[key] = this.props.singleCompanyRiskListObj[key]
        }
      } else {
        if (this.props.singleCompanyRiskListObj[key] >= 0) {
          this.singleCompanyRiskListObj[key] = this.props.singleCompanyRiskListObj[key]
        }
      }
    }
  }

  getResultItem () {
    this.setRiskListData()
    let tabItem = null
    let blackListObj = {
      blackList: [],
      num: 0
    }
    let exceptionListObj = {
      exceptionList: [],
      num: 0
    }
    let capitalCircleListObj = {
      capitalCircleList: this.props.capitalCircleList.capitalCircleList,
      num: this.props.capitalCircleList.num
    }
    let mutualGuaraListObj = {
      mutualGuaraList: this.props.mutualGuaraList.mutualGuaraList,
      num: this.props.mutualGuaraList.num
    }
    this.props.companyListObj.companyList.forEach((d) => {
      if (doraemon.isBlacklist(d)) {
        blackListObj.blackList.push(d)
      }
      if (d.is_abnormal_status) {
        exceptionListObj.exceptionList.push(d)
      }
    })
    blackListObj.num = blackListObj.blackList.length
    exceptionListObj.num = exceptionListObj.exceptionList.length
    const singleCompanyTabMap = [{
      name: '自身风险',
      type: 'SINGLE_COMPANY',
      riskList: this.singleCompanyRiskListObj.riskList,
      totalCount: this.singleCompanyRiskListObj.totalCount
    }, {
      name: '一度关联风险',
      type: 'FIRST_DEGREE',
      riskList: this.singleCompanyRiskListObj.firstDegreeRiskList,
      totalCount: this.singleCompanyRiskListObj.firstDegreeTotalCount,
      showRelativeGraph: true,
      depth: 1
    }, {
      name: '二度关联风险',
      type: 'SECOND_DEGREE',
      riskList: this.singleCompanyRiskListObj.secondDegreeRiskList,
      totalCount: this.singleCompanyRiskListObj.secondDegreeTotalCount,
      showRelativeGraph: true,
      depth: 2
    }, {
      name: '三度关联风险',
      type: 'THIRD_DEGREE',
      riskList: this.singleCompanyRiskListObj.thirdDegreeRiskList,
      totalCount: this.singleCompanyRiskListObj.thirdDegreeTotalCount,
      showRelativeGraph: true,
      depth: 3
    }]
    const groupTabMap = [{
      name: '集团内黑名单企业',
      riskList: blackListObj.blackList,
      totalCount: blackListObj.num,
      type: 'list'
    }, {
      name: '集团内经营异常企业',
      riskList: exceptionListObj.exceptionList,
      totalCount: exceptionListObj.num,
      type: 'list'
    }, {
      name: '集团内企业间联保互保',
      riskList: mutualGuaraListObj.mutualGuaraList,
      totalCount: mutualGuaraListObj.num,
      type: 'relationCard',
      groupType: 'mutual_guara'
    }, {
      name: '集团内资金流转环',
      riskList: capitalCircleListObj.capitalCircleList,
      totalCount: capitalCircleListObj.num,
      type: 'relationCard',
      groupType: 'capital_circle'
    }, {
      name: '集团授信超限',
      riskList: this.props.creditOverLimitlist.data,
      totalCount: this.props.creditOverLimitlist.num,
      headerData: this.props.innerCreditTotal.data,
      type: 'credit_info'
    }, {
      name: '集团成员近期风险事件',
      riskList: this.props.riskListObj.riskList,
      totalCount: this.props.riskListObj.totalCount,
      type: 'table'
    }]
    const tabMap = this.props.singleCompany ? singleCompanyTabMap : groupTabMap
    const resultItem = tabMap.map((t, i) => {
      if (this.state.showIndex[i]) {
        if (t.name === '集团成员近期风险事件' || this.props.singleCompany) {
          tabItem = t.riskList.length ? (
            <EventTable
              index={i}
              riskList={t.riskList}
              totalCount={t.totalCount}
              ruleType={this.ruleType}
              riskType={t.type}
              listObj={this.listObj}
              getRiskList={this.props.getRiskList}
              getSingleCompanyRiskList={this.props.getSingleCompanyRiskList}
              singleCompany={this.props.singleCompany}
              showRelativeGraph={t.showRelativeGraph ? t.showRelativeGraph : false}
              depth={t.depth || ''}
              isRiskShow={this.state.poupShowGroupTriggerName === t.name}
              relationName={t.name}
              triggerRiskShow={(name) => this.changeTriggerShowName(name)}
            />
          ) : ('')
        } else if (t.type === 'relationCard') {
          tabItem = t.riskList.length ? (
            <RelationCard
              riskList={t.riskList}
              groupType={t.groupType}
              relationName={t.name}
              isRiskShow={this.state.poupShowGroupTriggerName === t.name}
              triggerRiskShow={(name) => this.changeTriggerShowName(name)} />
          ) : ('')
        } else if (t.type === 'credit_info') {
          tabItem = t.totalCount ? (
            <div className='credit_info_result_body'>
              <CreditInfoHeader
                data={t.headerData}
              ></CreditInfoHeader>
              <div className='credit_info_detail'>
                <LatestTable
                  index={i}
                  type={t.type}
                  list={t.riskList}
                  totalCount={t.totalCount}
                  popupShow={this.state.poupShowGroupTriggerName === t.name}
                  relationName={t.name}
                  triggerRiskShow={(name) => this.changeTriggerShowName(name)}
                  getTableList={(jsonData) => this.getCreditOverLimitlist(jsonData)}
                />
              </div>
            </div>
          ) : (
            ''
          )
        } else if (t.riskList && t.riskList.length) {
          tabItem = (
            t.riskList && t.riskList.length ? (
              <div className='result-body'>
                {
                  t.riskList.map((d) => {
                    const isBlack = (doraemon.isBlacklist(d)) ? (<span className='special black-list'>黑名单</span>) : ''
                    const isException = (d.is_abnormal_status) ? (<span className='special bexception-company'>异常经营</span>) : ''
                    let companyType
                    switch (t.name) {
                      case '集团内经营异常企业':
                        companyType = isException
                        break
                      case '集团内黑名单企业':
                        companyType = isBlack
                        break
                      case '集团内上市企业':
                        companyType = isListed
                        break
                    }
                    return (
                      <CompanyCard
                        key={d.company}
                        vertex={d}
                        companyType={companyType}
                        selectCenterClusterNode={this.props.selectCenterClusterNode}
                      />
                    )
                  })
                }
              </div>
            ) : null
          )
        }
      } else {
        tabItem = null
      }
      return (
        <div className='result-item' key={t.name} >
          <div className='result-header' onClick={() => this.toggleList(i)}>
            <span className={this.state.showIndex[i] ? 'active-name' : ''}>
              {t.name}
              {t.type !== 'credit_info' ? '(' + (t.totalCount || 0) + ')' : ''}
            </span>
            <i className={this.state.showIndex[i] ? 'i-arrow-up' : 'i-arrow-up i-arrow-down'} />
          </div>
          {tabItem}
        </div >
      )
    })

    return resultItem
  }

  changeTriggerShowName (name) {
    this.setState({
      poupShowGroupTriggerName: name
    })
  }

  render () {
    return (
      <div className='result-list insight-list scroll-style'>
        {this.getResultItem()}
      </div>
    )
  }
}
// 顺序 state、dispatch、props
RiskInsightList.propTypes = {
  riskListObj: PropTypes.object,
  companyListObj: PropTypes.object,
  singleCompanyRiskListObj: PropTypes.object,
  getRiskList: PropTypes.func,
  getSingleCompanyRiskList: PropTypes.func,
  singleCompany: PropTypes.string,
  relations: PropTypes.object,
  selectCenterClusterNode: PropTypes.func
}
/**
 * react-redux state
 * @param {Object} state state
 * @return {Object} state
 */
const mapStateToProps = function (state) {
  return {
    riskListObj: state.riskListObj,
    companyListObj: state.companyListObj,
    singleCompanyRiskListObj: state.singleCompanyRiskListObj,
    capitalCircleList: state.capitalCircleList,
    mutualGuaraList: state.mutualGuaraList,
    innerCreditTotal: state.innerCreditTotal,
    creditOverLimitlist: state.creditOverLimitlist,
    reduxLocation: state.location
  }
}

/**
 * react-redux dispatch
 * @param {Object} dispatch diapatch
 * @return {Object} dispatch
 */
const mapDispatchToProps = (dispatch) => {
  return {
    getRiskList: (ruleType, offset, count) => dispatch(getRiskList(ruleType, offset, count)),
    getSingleCompanyRiskList: (riskType, jsonData) => dispatch(getSingleCompanyRiskList(riskType, jsonData)),
    getCapitalCircleList: (jsonData) => dispatch(getCapitalCircleList(jsonData)),
    getMutualGuaraList: (jsonData) => dispatch(getMutualGuaraList(jsonData)),
    getInnerCreditTotal: (jsonData) => dispatch(getInnerCreditTotal(jsonData)),
    getCreditOverLimitlist: (jsonData) => dispatch(getCreditOverLimitlist(jsonData))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RiskInsightList)
