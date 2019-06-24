import React from 'react'
import { connect } from 'react-redux'
import { setSingleCompanyState } from 'actions/InitOperateBtn'
import CompanyList from './companyList'
import NeturePersonList from './naturePersonList'
import GroupInterpretationList from './groupInterpretation/groupInterpretationList'
import './GroupRelationCard.scss'
import doraemon from 'services/utils'
import { getCompanyList, getSingleCompanyChart, clearSingleCompanyChart } from '../modules/GroupRelationCard'
import { toggleDownloadModal } from '../modules/downloadModal'

/** 集团关系卡片 */
class GroupRelationCard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isCardUnfold: true || this.props.isCardUnfold,
      curTab: 'company_list',
      singleCompany: '',
      singleCompanyData: [],
      companyList: [],
      personList: []
    }
    this.num = 0
    this.total = 0
    this.relations = {
      firstDegree: [],  // 存储一度关系数组
      secondDegree: [], // 存储二度关系数组
      thirdDegree: [],  // 存储三度关系数组
    }
    this.clusterChartData = []
    this.naturePersonData = []
    this.companyListCache = []
    this.foldCard = this.foldCard.bind(this)
    this.unfoldCard = this.unfoldCard.bind(this)
    this.getSingleCompanyChart = this.getSingleCompanyChart.bind(this)
  }

  componentWillMount () {
    this.props.getCompanyList()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.clusterChartData !== nextProps.clusterChartData) {
      this.naturePersonData = this.initData(nextProps.clusterChartData)
    }
    if (nextProps.singleCompanyChart && this.props.singleCompanyChart !== nextProps.singleCompanyChart) {
      this.initSingleCompanyData(nextProps.singleCompanyChart)
    }
    if (this.props.companyListObj !== nextProps.companyListObj) {
      this.companyListCache = nextProps.companyListObj.companyList
      this.setState({
        companyList: this.companyListCache
      })
    }
  }

  foldCard () {
    this.setState({ isCardUnfold: false })
  }

  unfoldCard () {
    if (this.state.isCardUnfold) return
    this.setState({ isCardUnfold: true })
  }

  changeTabHandler (type) {
    this.setState({ curTab: type })
  }

  setLinkedTypes = (d, type) => {
    d.linkedTypes = d.linkedTypes || []
    d.linkedTypes.push(type)
  }

  // 初始化单一企业数据
  initSingleCompanyData (data) {
    let companyData = []
    let companyDataCache = []
    let personList = []
    let companyList = []
    let companyListTemp = []
    let investTemp = []
    const stock = (data.stock.stockCompList && data.stock.stockCompList.children) || []
    stock.forEach((s) => {
      if (s.relations.actual_controller) {
        this.setLinkedTypes(s.properties, '疑似实际控制人')
      }
      this.setLinkedTypes(s.properties, '股东')
    })
    const invest = (data.invest.investCompList && data.invest.investCompList.children) || []
    const sameLayerId = data.sameLayer.sameShareholderCompIdList || []
    const sameLayer = data.sameLayer.sameShareholderCompList || []  // 现在数据中只有共控股股东数据，疑似同一企业和共核心高管暂时先不放入
    sameLayer.forEach((s) => {
      this.setLinkedTypes(s, '共控股股东')
    })
    this.relations = {
      firstDegree: [],  // 存储一度关系数组
      secondDegree: [], // 存储二度关系数组
      thirdDegree: [],  // 存储三度关系数组
    }

    this.clusterChartData = Object.values(this.props.clusterChartData)[0]

    companyData.push(...stock)
    // companyData.push(...sameLayer)
    invest.forEach((d) => {
      this.traversalTree(d, (c) => {
        const typeMap = {
          1: '一度投资对象',
          2: '二度间接投资对象',
          3: '三度间接投资对象'
        }
        this.setLinkedTypes(c.properties, typeMap[c.depth])
        investTemp.push(c)
      })
    })
    companyData.push(...investTemp)
    this.matchClusterChartData(companyData)

    // 合并单一企业视角的企业列表数据
    this.combineData(companyData)

    // 处理股权数据，区分企业和自然人
    companyData.forEach((d) => {
      if (!d.properties._id) {
        return
      }
      if (!companyDataCache.includes(d.properties._id)) {
        companyDataCache.push(d.properties._id)
        if (d.properties._id.includes('Person')) {
          d.properties.stock_type = ''
          if (d.relations.invest || d.relations.tradable_share) {
            d.properties.stock_type = '股东'
            if (d.relations.control_shareholder || d.relations.actual_controller) {
              d.properties.stock_type += '、'
            }
          }
          if (d.relations.control_shareholder) {
            d.properties.stock_type += '控股股东'
            if (d.relations.actual_controller) {
              d.properties.stock_type += '、'
            }
          }
          if (d.relations.actual_controller) {
            d.properties.stock_type += '实际控制人'
          }
          personList.push(d.properties)
        } else {
          companyList.push(d.properties)
        }
      }
    })

    // 处理同一层数据，去重
    sameLayer.forEach && sameLayer.forEach((s) => {
      if (!companyList.find((c) => c._id === s._id)) {
        companyListTemp.push(s)
      }
    })
    companyList.push(...companyListTemp)
    this.setState({
      companyList: companyList,
      personList: personList
    })

    sameLayerId && sameLayerId.forEach((d, i) => {
      this.relations.firstDegree.push(this.clusterChartData.vertexes.find((v) => v._id === d))
    })
  }

  matchClusterChartData (data) {
    data && data.forEach((element) => {
      if (this.clusterChartData.vertexes.find((d) => {
        return d._id === element.properties._id
      })) {
        element.properties.is_match = true
      }
      if (element.children) {
        this.matchClusterChartData(element.children)
      }
    })
  }

  combineData (data) {
    data && data.forEach((d, i) => {
      if (!d.depth || d.depth === 1) {
        this.relations.firstDegree.push(d.properties)
      } else if (d.depth === 2) {
        this.relations.secondDegree.push(d.properties)
      } else if (d.depth === 3) {
        this.relations.thirdDegree.push(d.properties)
      }
      // if (d.children) {
      //   this.combineData(d.children)
      // }
    })
  }

  traversalTree (data, cb, prev) {
    cb(data, prev)
    data.children && data.children.forEach((d) => {
      this.traversalTree(d, cb, data)
    })
  }

  // 初始化自然人列表数据
  initData (data) {
    let personData = []
    let personArr = []
    data = Object.values(data)[0]
    data && data.vertexes.forEach((ele, index) => {
      let temp = {}
      let sameCompArr = []
      if (ele._id.indexOf('Person') > -1) {
        data.edges.forEach((d) => {
          temp = {
            person_id: ele._id,
            actual_controller_total: 0,
            officer_share_total: 0,
            name : ele.name,
            belong_inner : ele.belong_inner || '',
            is_black : doraemon.isBlacklist(ele) || '',
            is_listed_enterprise : ele.is_listed_enterprise || '',
            is_abnormal_status : ele.is_abnormal_status || ''
          }
          if (d._from === ele._id && !sameCompArr.includes(d._to)) {
            temp.id = d._id
            temp.type = d.type
            personData.push(temp)
            sameCompArr.push(d._to)
          }
        })
      }
    })
    // 数据去重，并统计投资／任职次数
    personData.forEach((v, index) => {
      const id = v.id.split('/')[0]
      // person_id相同
      if (personArr.findIndex((i) => i.person_id === v.person_id) < 0) {
        // 投资／任职计数
        if (id === 'actual_controller' || id === 'control_shareholder') {
          v.actual_controller_total ++
        } else if (id === 'officer_share' || id === 'officer_core' || id === 'officer') {
          v.officer_share_total ++
        }
        personArr.push(v)
      } else {
        if (id === 'actual_controller' || id === 'control_shareholder') {
          personArr.find((j) => j.person_id === v.person_id).actual_controller_total ++
        } else if (id === 'officer_share' || id === 'officer_core' || id === 'officer') {
          personArr.find((j) => j.person_id === v.person_id).officer_share_total ++
        }
      }
    })
    return personArr
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

  genTabList () {
    const groupTabs = [{
      type: 'company_list',
      name: '企业列表',
      total: this.num || '0'
    }, {
      type: 'nature_person_list',
      name: '自然人列表',
      total: this.naturePersonData.length || '0'
    }, {
      type: 'group_interpretation_list',
      name: '集团解读'
    }]
    const singleCompanyTabs = [{
      type: 'company_list',
      name: '关联企业',
      total: this.state.companyList.length || '0'
    }, {
      type: 'nature_person_list',
      name: '关联自然人',
      total: this.state.personList.length || '0'
    }, {
      type: 'group_interpretation_list',
      name: '解读'
    }]

    const navType = this.getUrlObj('type')
    const tabs = this.state.singleCompany ? singleCompanyTabs : groupTabs
    let newTabs = navType === 'profile_enterprise_info' ? tabs : tabs.slice(0, 2)

    return (
      newTabs.map((t) => (
        <li className={t.type === this.state.curTab ? 'tab-item active' : 'tab-item'}
          key={t.name}
          onClick={(e) => this.changeTabHandler(t.type)}
        >
          <span className='tab-item-name'>{t.name}</span>
          {t.total ? (<em>{t.total}</em>) : ''}
          <span className='active-scroll'/>
        </li>
      ))
    )
  }

  getSingleCompanyChart (singleCompany) {
    this.props.getSingleCompanyChart(singleCompany)
    this.setState({ singleCompany })
  }

  genContentList () {
    const { curTab, companyList, personList } = this.state
    // this.companyList = this.props.companyListObj.companyList
    if (curTab === 'company_list') {
      return (
        <CompanyList
          getSingleCompanyChart={this.getSingleCompanyChart}
          companyList={companyList}
          singleCompany={this.state.singleCompany}
        />
      )
    } else if (curTab === 'nature_person_list') {
      return (
        <NeturePersonList
          naturePersonData={this.naturePersonData}
          personList={personList}
          singleCompany={this.state.singleCompany}
        />
      )
    } else if (curTab === 'group_interpretation_list') {
      return (
        <GroupInterpretationList
          singleCompany={this.state.singleCompany}
          relations={this.relations}
        />
      )
    }
  }

  clearSingleCompanyChart = () => {
    this.setState({
      singleCompany: '',
      companyList: this.companyListCache
    })
    this.props.clearSingleCompanyChart()
    this.props.setSingleCompanyState(false)
  }

  downloadList = () => {
    this.props.toggleDownloadModal(true)
  }

  render () {
    const { isCardUnfold, singleCompany } = this.state
    const { reduxLocation } = this.props
    // this.num = this.num !== 0 ? this.num : this.props.companyListObj.num
    this.num = this.props.companyListObj ? this.props.companyListObj.num : this.num

    const CardHeader = (
      <div className='card-header clearfix'>
        <h2 className={`name ${reduxLocation.query.type + '-add-icon'}`}>
          <span className='eclipse-name' title={reduxLocation.query.group_name}>{reduxLocation.query.group_name}</span> {reduxLocation.query.type === 'profile_enterprise_info' ? '| 系' : ''}
          {
            singleCompany ? null : <i className='download-btn' onClick={this.downloadList} />
          }
        </h2>
        {
          singleCompany ? (
            <h3 className='single-company-name'>
              <span className='single-name' title={`${singleCompany}`}>{`${singleCompany}`}</span> 视角，
              <a onClick={this.clearSingleCompanyChart}>切换为派系概览视角</a>
            </h3>
          ) : null
        }
        <i className='card-icon-pickup' onClick={this.foldCard} />
      </div>
    )

    const CardBody = (
      <div className='card-body'>
        <div className='tab-box'>
          <div className='tab-title'>
            <ul className='clearfix'>
              {this.genTabList()}
            </ul>
          </div>
          {this.genContentList()}
        </div>
      </div>
    )

    return (
      <div>
        {isCardUnfold
          ? (<div className='group-relation-card'>
            {CardHeader}
            {CardBody}
          </div>)
          : (<div className='group-relation-card-small' onClick={this.unfoldCard}><i></i></div>)
        }
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
    singleCompanyChart: state.singleCompanyChart,
    companyListObj: state.companyListObj,
    clusterChartData: state.clusterChartData,
    reduxLocation: state.location
  }
}

/**
 * map dispatch to props
 * @param {Object} dispatch dispatch
 * @return {Object} action
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setSingleCompanyState: (v) => dispatch(setSingleCompanyState(v)),
    getCompanyList: () => dispatch(getCompanyList()),
    getSingleCompanyChart: (id) => dispatch(getSingleCompanyChart(id)),
    clearSingleCompanyChart: () => dispatch(clearSingleCompanyChart()),
    toggleDownloadModal: (visible) => dispatch(toggleDownloadModal(visible))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupRelationCard)
