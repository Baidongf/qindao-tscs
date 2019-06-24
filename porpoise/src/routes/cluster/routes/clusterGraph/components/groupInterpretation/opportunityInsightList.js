import React from 'react'
import PropTypes from 'prop-types'
import CompanyCard from './companyCard'
import EventTable from './eventTable'
import LatestTable from './latestTable'
import { connect } from 'react-redux'
import { getRiskList, getSingleCompanyRiskList, getBlockTradeList, getExpireBusinessList } from '../../modules/GroupRelationCard'

class OpportunityInsightList extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showIndex: [false],
      singleCompany: '',
      poupShowGroupTriggerName: ''
    }

    this.riskList = {}
    this.listObj = {}
    this.searchName = ''
    this.ruleType = 1     // 0: 风险洞察  1: 机会洞察
    this.pageSize = 5
    this.jsonData = {     // 单一企业请求体
      'companies': [],
      'ruleType': this.ruleType,
      'offset': 0,
      'count': this.pageSize
    }
    this.requestObj = {
      'SINGLE_COMPANY': [],
      'FIRST_DEGREE': [],
      'SECOND_DEGREE': [],
      'THIRD_DEGREE': []
    }
    this.singleCompanyRiskListObj = {}  //   单一企业返回数据对象

    this.toggleList = this.toggleList.bind(this)
    this.selectCenterClusterNode = this.selectCenterClusterNode.bind(this)
    this.getTableList = this.getTableList.bind(this)
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
        'thirdDegreeTotalCount': 0
      }
      for (let key in this.listObj.requestObj) {
        this.listObj.jsonData['companies'] = this.listObj.requestObj[key]
        this.props.getSingleCompanyRiskList(key, this.listObj.jsonData)
      }
    } else {
      this.props.getRiskList(this.ruleType, 0, this.pageSize)
      this.getTableList({
        offset: 0,
        direction: 'DESC',
        property: 'transTime',
        type: 'block'
      })
      this.getTableList({
        offset: 0,
        direction: 'ASC',
        property: 'dueTime',
        type: 'expire'
      })
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

  getTableList ({ offset, direction, property, type }) {
    let query = this.props.reduxLocation.query
    let sortOrders = []
    sortOrders.push({
      direction,
      property
    })
    let postData = {
      groupName: query.group_name || '',
      groupType: query.type || '',
      offset: offset,
      pageSize: 5,
      sortOrders: sortOrders
    }
    if (type === 'block') {
      this.props.getBlockTradeList(postData)
    } else if (type === 'expire') {
      this.props.getExpireBusinessList(postData)
    }
  }

  selectCenterClusterNode (id) {
    if (!this.props.singleCompany) {
      this.props.selectCenterClusterNode(id)
    }
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

  changeTriggerShowName (name) {
    this.setState({
      poupShowGroupTriggerName: name
    })
  }

  setRiskListData () {
    for (let key in this.singleCompanyRiskListObj) {
      if (typeof this.singleCompanyRiskListObj[key] === 'object') {
        if (this.props.singleCompanyRiskListObj[key]) {
          this.singleCompanyRiskListObj[key] = this.props.singleCompanyRiskListObj[key]
        }
      } else {
        // this.singleCompanyRiskListObj[key] = 0
        if (this.props.singleCompanyRiskListObj[key] >= 0) {
          this.singleCompanyRiskListObj[key] = this.props.singleCompanyRiskListObj[key]
        }
      }
    }
  }

  getResultItem () {
    this.setRiskListData()
    let listedPlateObj = {
      listedPlateList: [],
      num: 0
    }
    this.props.companyListObj.companyList.forEach((d) => {
      if (d.is_listed && d.is_listed === 'true') {
        listedPlateObj.listedPlateList.push(d)
      }
    })
    listedPlateObj.num = listedPlateObj.listedPlateList.length
    const singleCompanyTabMap = [{
      name: '自身机会',
      type: 'SINGLE_COMPANY',
      riskList: this.singleCompanyRiskListObj.riskList,
      totalCount: this.singleCompanyRiskListObj.totalCount,
    }, {
      name: '一度关联机会',
      type: 'FIRST_DEGREE',
      riskList: this.singleCompanyRiskListObj.firstDegreeRiskList,
      totalCount: this.singleCompanyRiskListObj.firstDegreeTotalCount,
      showRelativeGraph: true,
      depth: 1,
    }, {
      name: '二度关联机会',
      type: 'SECOND_DEGREE',
      riskList: this.singleCompanyRiskListObj.secondDegreeRiskList,
      totalCount: this.singleCompanyRiskListObj.secondDegreeTotalCount,
      showRelativeGraph: true,
      depth: 2,
    }, {
      name: '三度关联机会',
      type: 'THIRD_DEGREE',
      riskList: this.singleCompanyRiskListObj.thirdDegreeRiskList,
      totalCount: this.singleCompanyRiskListObj.thirdDegreeTotalCount,
      showRelativeGraph: true,
      depth: 3,
    }]
    const groupTabMap = [{
      name: '集团内上市企业',
      riskList: listedPlateObj.listedPlateList,
      totalCount: listedPlateObj.num
    }, {
      name: '集团内新注册企业',
      riskList: this.props.newRegisterObj.registerList,
      totalCount: this.props.newRegisterObj.totalCount
    }, {
      name: '集团内近期大额交易客户',
      type: 'block',
      riskList: this.props.blockTradeList.blockTradeList,
      totalCount: this.props.blockTradeList.num
    }, {
      name: '集团内近期业务到期客户',
      type: 'expire',
      riskList: this.props.expireBusinessList.expireBusinessList,
      totalCount: this.props.expireBusinessList.num
    },
    {
      name: '集团成员近期机会线索',
      riskList: this.props.riskListObj.riskList,
      totalCount: this.props.riskListObj.totalCount,
      type: 'table'
    }]
    const tabMap = this.props.singleCompany ? singleCompanyTabMap : groupTabMap
    let tabItem = null
    const resultItem = tabMap.map((t, i) => {
      if (this.state.showIndex[i]) {
        if (t.name === '集团成员近期机会线索' || this.props.singleCompany) {
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
        } else if (t.name === '集团内近期大额交易客户' || t.name === '集团内近期业务到期客户') {
          tabItem = t.riskList.data && t.riskList.data.length ? (
            <LatestTable
              index={i}
              type={t.type}
              list={t.riskList}
              totalCount={t.totalCount}
              popupShow={this.state.poupShowGroupTriggerName === t.name}
              relationName={t.name}
              triggerRiskShow={(name) => this.changeTriggerShowName(name)}
              getTableList={(jsonData) => this.getTableList(jsonData)}
            />
          ) : ('')
        } else if (t.riskList && t.riskList.length) {
          tabItem = t.riskList.length ? (
            <div className='result-body'>
              {
                t.riskList.map((d) => {
                  const isListed = (d.public_sector) ? (
                    <span className='special listed-plate public_sector'>{d.public_sector}</span>
                    ) : ''
                  let companyType
                  switch (t.name) {
                    case '集团内上市企业':
                      companyType = isListed
                      break
                  }
                  return (
                    (t.name === '集团内新注册企业') ? (
                      <div className='relation-card main-info' key={d.company}>
                        {/* customer-header */}
                        <p className='relation-name ' onClick={() => this.selectCenterClusterNode(d._id)}>
                          {/* customer-name */}
                          <span className='name '>{d.company}</span>
                        </p>
                          {/* company-info */}
                        <div className='relation-info'>
                          <p className='info-item'>
                            <span className='item'>成立日期: {d.created_date || '--'}</span>
                            <span className='item'>注册资本: {d.registered_capital || '--'}</span>
                          </p>
                          <p className='info-item'>
                            <span className='item'>法定代表人: {d.corporation || '--'}</span>
                            <span className='item'>联系电话: {d.contact || '--'}</span>
                          </p>
                          <p className='info-item'>
                            <span className='item'>组织机构代码: {d.organization_code || '--'}</span>
                            <span className='item'>公司类型: {d.company_type || '--'}</span>
                          </p>
                          <p className='info-item'>
                            <span className='item'>行业类型: {d.main_industry || '--'}</span>
                            <span className='item'>区域: {d.region || '--'}</span>
                          </p>
                          <p className='info-item'>
                            <span className='item'>注册地址: {d.registered_address || '--'}</span>
                            {/* <span className='item'>上市地址: {d.listed_place || '--'}</span> */}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <CompanyCard
                        key={d.name || d.company}
                        vertex={d}
                        companyType={companyType}
                        selectCenterClusterNode={this.props.selectCenterClusterNode}
                      />
                    )
                  )
                })
              }
            </div>
          ) : ('')
        }
      } else {
        tabItem = null
      }
      return (
        <div className='result-item' key={t.name}>
          <div className='result-header' onClick={() => this.toggleList(i)}>
            <span className={this.state.showIndex[i] ? 'active-name' : ''}>
              {t.name} ({t.totalCount || 0})
            </span>
            <i className={this.state.showIndex[i] ? 'i-arrow-up' : 'i-arrow-up i-arrow-down'} />
          </div>
          {tabItem}
        </div>
      )
    })

    return resultItem
  }

  render () {
    return (
      <div className='result-list insight-list scroll-style'>
        {this.getResultItem()}
      </div>
    )
  }
}
OpportunityInsightList.PropTypes = {
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
    blockTradeList: state.blockTradeList,
    expireBusinessList: state.expireBusinessList,
    reduxLocation: state.location,
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
    getBlockTradeList: (postData) => dispatch(getBlockTradeList(postData)),
    getExpireBusinessList: (postData) => dispatch(getExpireBusinessList(postData)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OpportunityInsightList)
