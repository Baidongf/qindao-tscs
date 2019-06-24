import React from 'react'
import { connect } from 'react-redux'
import Graph from './Graph'
import BubbleGraph from './bubble'
import { getChartData, getConnectReason, getMergeSuggestedReason, setCurNode, setCurEdge, getIndivTransferChart, setNodeStatus } from '../../actions/Chart'
import { getCompanyBrief, getPersonBrief, toggleCardType, getCaseBrief, setRelationSrcName } from '../../actions/Card'
import { getGuaranteePath } from 'routes/GuaranteeRisk/modules/guaranteeRisk'
import { caseTypeMap } from '../../card.config'
import { getRiskNodeDetail } from 'routes/RiskAnalysis/modules/riskAnalysis'
import { setGraphType } from 'actions/InitOperateBtn'
import PropTypes from 'prop-types'

// 标记是否是初始状态
let isInit = true
class Chart extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      belongBankLinkType: []
    }

    this.getNodeInfo = this.getNodeInfo.bind(this)
    this.getEdgeInfo = this.getEdgeInfo.bind(this)
  }

  componentWillMount () {
    const { query } = this.props.reduxLocation
    const initCardType = query.type

    if (initCardType === 'Graph') {
      this.props.getChartData(this.props.filterOptions)
    } else if (initCardType === 'Connection') {
      const connectionParams = JSON.parse(sessionStorage.getItem('connectionParams'))
      this.props.getConnectReason(connectionParams.id, connectionParams.target)
    } else if (initCardType === 'Merge_suggested') {
      const mergeSuggestedParams = JSON.parse(sessionStorage.getItem('mergeSuggestedParams'))
      this.props.getMergeSuggestedReason(mergeSuggestedParams.person1, mergeSuggestedParams.person2)
    } else if (location.href.includes('indiv_transfer')) {
      this.props.getIndivTransferChart(this.props.reduxLocation.query.id)
    }
    // 集团派系才根据初始状态判断是否要气泡图，其他一直用网状图
    this.props.reduxLocation.query.type !== 'profile_enterprise_info' && (isInit = false)
  }

  componentDidUpdate (prevProps) {
    if (this.props.originChartData !== prevProps.originChartData) {
      this.getCardData(this.props.reduxLocation.query.type)
    }
    if (this.props.graphType === prevProps.graphType) {
      isInit = false
    }
    if (this.props.belongBankRelation !== prevProps.belongBankRelation) {
      this.setState({
        belongBankLinkType: this.props.belongBankRelation.map((r) => r.target_table)
      })
    }
    const { clusterChartData } = this.props
    let clusterVertexN = 0  // 当节点数 > 40 时，用气泡图展示
    for (let id in clusterChartData) {
      if (clusterChartData.hasOwnProperty(id)) {
        clusterVertexN += clusterChartData[id].vertexes.length
      }
    }

    if (clusterVertexN >= 40) {
     this.props.setNodeStatus(true)
    }
  }

  /**
 * 根据URL指定的图谱解释类型获取节点详情
 * @param {String} type 图谱解释类型
 */
  getCardData (type) {
    if (!this.props.reduxLocation.pathname.includes('/explain')) {
      return
    }
    const getNodeById = (id) => this.props.originChartData.vertexes.find((v) => v._id === id) || { _id: '' }
    const { query } = this.props.reduxLocation

    const getCardDataMethod = {
      'concert': () => {
        this.getNodeInfo(getNodeById(query.to))
      },
      'company_faction': () => {
        this.getNodeInfo(getNodeById(query.to))
      },
      'invest_and_officer': () => {
        this.getNodeInfo(getNodeById(query.id))
      },
      'actual_controller': () => {
        this.getNodeInfo(getNodeById(query.to))
      }
    }
    getCardDataMethod[type] && getCardDataMethod[type]()
  }

  getEdgeInfo (edge) {
    let { toggleCardType } = this.props
    const type = edge._type || (edge._id.split('/') && edge._id.split('/')[0])
    this.props.setCurEdge(edge)
    if (type === 'guarantee') {
      toggleCardType('guarantee')
    } else if (type === 'money_flow') {
      toggleCardType('money_flow')
    } else if (type === 'personal_money_flow') {
      toggleCardType('indiv_transfer')
    } else if (this.state.belongBankLinkType.includes(type)) {
      toggleCardType('belong_bank')
    } else if (['sue_relate', 'plaintiff_relate', 'defendant_relate'].includes(type)) {
      toggleCardType('sue_relate')
    } else if (type === 'party_bid') {
      toggleCardType('party_bid')
    } else if (['invest', 'tradable_share'].includes(type)) {
      toggleCardType('invest')
    } else if (type === 'officer') {
      toggleCardType('officer')
    }
  }

  getNodeInfo (vertex) {
    let { getCompanyBrief, getPersonBrief, toggleCardType, getCaseBrief } = this.props
    const type = vertex._type || (vertex._id.split('/') && vertex._id.split('/')[0])
    if (this.props.reduxLocation.pathname.includes('guarantee_risk')) {
      this.props.setCurNode(vertex)
      // this.props.getGuaranteePath(vertex._id || vertex.id) // 通用版又不要了
      // this.props.toggleCardType('guarantee_path')
      getCompanyBrief(vertex.name)
      return
    }
    if (this.props.reduxLocation.pathname.includes('risk_analysis') && vertex) {
      this.props.getRiskNodeDetail(vertex)
      return
    }
    if (type === 'Company') {
      this.props.setCurNode(vertex)
      this.props.setRelationSrcName(vertex.name)
      getCompanyBrief(vertex.name)
    } else if (type === 'Person') {
      this.props.setCurNode(vertex)
      getPersonBrief(vertex._id)
      toggleCardType('Person')
    } else if (Object.keys(caseTypeMap).includes(type)) {
      this.props.setCurNode(vertex)
      getCaseBrief(vertex._record_id, type)
      toggleCardType(type)
    } else if (type.includes('mergeNode')) {
      this.props.setCurNode(vertex)
      toggleCardType('merge_relation')
    }
  }

  render () {
    const { clusterChartData } = this.props
    let clusterVertexN = 0  // 当节点数 > 40 时，用气泡图展示
    for (let id in clusterChartData) {
      if (clusterChartData.hasOwnProperty(id)) {
        clusterVertexN += clusterChartData[id].vertexes.length
      }
    }
    // 初始状态并且是集团派系才则根据节点数判断，不是则根据切换图谱类型判断，默认显示网状图
    let condition = isInit ? clusterVertexN < 40 : this.props.graphType === 'grid'
    if (condition) {
      return (
        <div className='chart-container' ref='chart-container'>
          <Graph
            getNodeInfo={this.getNodeInfo}
            getEdgeInfo={this.getEdgeInfo}
            belongBankLinkType={this.state.belongBankLinkType}
          />
        </div>
      )
    } else {
      return (
        <div className='chart-container' ref='chart-container'>
          <BubbleGraph
            getNodeInfo={this.getNodeInfo}
            getEdgeInfo={this.getEdgeInfo}
            belongBankLinkType={this.state.belongBankLinkType}
            toggleCardType={this.props.toggleCardType}
          />
        </div>
      )
    }
  }
}

Chart.propTypes = {
  originChartData: PropTypes.object,
  filterOptions: PropTypes.object,
  reduxLocation: PropTypes.object,
  getChartData: PropTypes.func,
  getCompanyBrief: PropTypes.func,
  getPersonBrief: PropTypes.func,
  toggleCardType: PropTypes.func,
  setCurNode: PropTypes.func,
  setCurEdge: PropTypes.func,
  getConnectReason: PropTypes.func,
  getMergeSuggestedReason: PropTypes.func,
  getCaseBrief: PropTypes.func,
  setRelationSrcName: PropTypes.func,
  getIndivTransferChart: PropTypes.func,
  getGuaranteePath: PropTypes.func,
  belongBankRelation: PropTypes.array
}

const mapStateToProps = (state) => {
  return {
    filterOptions: state.FilterOptions,
    reduxLocation: state.location,
    originChartData: state.originChartData,
    belongBankRelation: state.belongBankRelation,
    curNode: state.curNode,
    clusterChartData: state.clusterChartData,
    displayChartData: state.displayChartData,
    graphType: state.setGraphType
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getChartData: options => dispatch(getChartData(options)),
    getCompanyBrief: (companyName) => dispatch(getCompanyBrief(companyName)),
    getPersonBrief: (personId) => dispatch(getPersonBrief(personId)),
    toggleCardType: (cardType) => dispatch(toggleCardType(cardType)),
    setCurNode: vertex => dispatch(setCurNode(vertex)),
    setCurEdge: edge => dispatch(setCurEdge(edge)),
    getConnectReason: (id, target) => dispatch(getConnectReason(id, target)),
    getMergeSuggestedReason: (person1, person2) => dispatch(getMergeSuggestedReason(person1, person2)),
    getCaseBrief: (id, cardType) => dispatch(getCaseBrief(id, cardType)),
    setRelationSrcName: companyName => dispatch(setRelationSrcName(companyName)),
    getIndivTransferChart: (id) => dispatch(getIndivTransferChart(id)),
    getRiskNodeDetail: (vertex) => dispatch(getRiskNodeDetail(vertex)),
    getGuaranteePath: (id) => dispatch(getGuaranteePath(id)),
    setGraphType: (v) => {dispatch(setGraphType(v))},
    setNodeStatus: (isNodeMax) => dispatch(setNodeStatus(isNodeMax))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chart)
