import React from 'react'
import { connect } from 'react-redux'
import CompanyCard from './CompanyCard'
import RelationCard from './RelationCard'
import PersonCard from './PersonCard'
import MergeSuggested from './MergeSuggested'
import CaseCard from './CaseCard'
import CompanyCluster from './CompanyCluster'
import GroupRelationCard from '../../routes/cluster/routes/clusterGraph/components/GroupRelationCard'
import GuaranteeCard from './relationCards/guaranteeCard_v2'
import MoneyFlowCard from './relationCards/moneyFlowCard_v2'
import SueRelateCard from './relationCards/sueRelateCard'
import PartyBidCard from './relationCards/partyBidCard'
import InvestCard from './relationCards/investCard'
import OfficerCard from './relationCards/officerCard'
import IndividualTransferCard from './IndividualTransferCard'
import MergeRelationCard from './MergeRelationCard'
import ClusterDetailCard from './ClusterDetailCard'
import BelongBankDetailCard from './BelongBankDetailCard'
import GuaranteeRiskCard from 'routes/GuaranteeRisk/components/GuaranteeRiskCard'
import GuaranteePathCard from 'routes/GuaranteeRisk/components/GuaranteePathCard'
import BlacklistRelationCard from 'routes/BlacklistCheat/components/BlacklistRelationCard'
import BlacklistRelationPath from 'routes/BlacklistCheat/components/BlacklistRelationPath'
import { toggleCardType, selectCenterTreeNode, selectCenterClusterNode, selectPersonClusterNode, getCompanyBrief } from '../../actions/Card'
import { caseTypeMap } from '../../card.config'
import { getCompanyList, getSingleCompanyChart, clearSingleCompanyChart, getGroupFeature, getNewRegister, getGroupMembers } from '../../routes/cluster/routes/clusterGraph/modules/GroupRelationCard'
import PropTypes from 'prop-types'

/** 详情卡片 */
class Card extends React.Component {
  /**
   * constructor
   * @param {Object} props props
   */
  constructor (props) {
    super(props)

    this.initCardType = this.props.reduxLocation.query.type
  }

  /**
   * 加载默认卡片状态
   */
  componentWillMount () {
    if (this.initCardType) {
      this.props.toggleCardType(this.initCardType)
    }
  }

  /**
   * render card
   * @return {Object} card div
   */
  render () {
    let card
    let rightCard = null
    let domain_name = ''
    let type = ''
    let { cardType } = this.props
    if (cardType === 'Company' || cardType === 'Graph') {
      card = <CompanyCard />
    } else if (cardType === 'Person') {
      card = <PersonCard />
    } else if (cardType === 'Relation' || cardType === 'Guarantee') {
      card = <RelationCard />
    } else if (cardType === 'Merge_suggested') {
      card = <MergeSuggested />
    } else if (Object.keys(caseTypeMap).includes(cardType)) {
      card = <CaseCard />
    } else if (cardType === 'guarantee') {
      card = <GuaranteeCard />
    } else if (cardType === 'money_flow') {
      card = <MoneyFlowCard />
    } else if (cardType === 'sue_relate') {  // 起诉/被起诉/同为原告/同为被告 关系详情
      card = <SueRelateCard />
    } else if (cardType === 'party_bid') {  // 招中标关系详情
      card = <PartyBidCard />
    } else if (cardType === 'invest') {
      card = <InvestCard />
    } else if (cardType === 'officer') {
      card = <OfficerCard />
    } else if (cardType === 'indiv_transfer') {
      card = <IndividualTransferCard />
    } else if (cardType === 'merge_relation') {
      card = <MergeRelationCard />
    } else if (cardType === 'guarantee_path') {
      card = <GuaranteePathCard />
    } else if (cardType === 'blacklist_relation') {
      card = <BlacklistRelationCard />
    } else if (cardType === 'Company_cluster') {
      card = <ClusterDetailCard />
    } else if (cardType === 'belong_bank') {
      card = <BelongBankDetailCard />
    } else if (cardType === 'hide_card') {
      card = null
    }

    if (this.props.reduxLocation.pathname.includes('/cluster/detail')) {
      card = null
      rightCard = (
        <div className='clearfix card-wrap group-card'>
          {/* <CompanyCluster /> */}
          <GroupRelationCard />
        </div>
      )
    } else if (this.props.reduxLocation.pathname.includes('guarantee_risk')) {
      rightCard = (
        <div className='clearfix card-wrap right-card'>
          <GuaranteeRiskCard />
        </div>
      )
    } else if (this.props.reduxLocation.pathname.includes('blacklist_cheat')) {
      rightCard = (
        <div className='clearfix card-wrap right-card'>
          <BlacklistRelationPath />
        </div>
      )
    }

    return (
      <div>
        <div className='clearfix card-wrap'>
          {card}
        </div>
        {rightCard}
      </div>
    )
  }
}

Card.propTypes = {
  cardType: PropTypes.string,
  reduxLocation: PropTypes.object,
  toggleCardType: PropTypes.func,
  selectCenterClusterNode: PropTypes.func,
  getCompanyBrief: PropTypes.func
}

/**
 * map state to props
 * @param {Object} state state
 * @return {Object} state
 */
const mapStateToProps = function (state) {
  return {
    cardType: state.cardType,
    reduxLocation: state.location,
    companyListObj: state.companyListObj,
    domain_name: state.domain_name,
    type: state.type,
    curNode: state.curNode,
    centerTreeNode: state.centerTreeNode,
    clusterChartData: state.clusterChartData,
    renderChartStatus: state.renderChartStatus,
    singleCompanyChart: state.singleCompanyChart,
    groupFeatureObj: state.groupFeatureObj,
    newRegisterObj: state.newRegisterObj,
    findGroupMembers: state.findGroupMembers
  }
}

/**
 * map dispatch to props
 * @param {Object} dispatch dispatch
 * @return {Object} action
 */
const mapDispatchToProps = (dispatch) => {
  return {
    toggleCardType: (cardType) => dispatch(toggleCardType(cardType)),
    getCompanyList: () => dispatch(getCompanyList()),
    getSingleCompanyChart: (id) => dispatch(getSingleCompanyChart(id)),
    clearSingleCompanyChart: () => dispatch(clearSingleCompanyChart()),
    selectCenterClusterNode: (id) => dispatch(selectCenterClusterNode(id)),
    selectPersonClusterNode: (id, showType) => dispatch(selectPersonClusterNode(id, showType)),
    getCompanyBrief: (name) => dispatch(getCompanyBrief(name)),
    getGroupFeature: (groupName, type) => dispatch(getGroupFeature(groupName, type)),
    getNewRegister: (groupName, type) => dispatch(getNewRegister(groupName, type)),
    selectCenterTreeNode: (id) => dispatch(selectCenterTreeNode(id)),
    getGroupMembers: (filterObj) => dispatch(getGroupMembers(filterObj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Card)
