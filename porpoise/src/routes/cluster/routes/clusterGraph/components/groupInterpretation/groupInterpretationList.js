import React from 'react'
import { connect } from 'react-redux'
import RiskInsightList from './riskInsightList'
import OpportunityInsightList from './opportunityInsightList'
import GroupFeaturesList from './groupFeaturesList'
import { selectCenterClusterNode } from '../../../../../../actions/Card'
import { getGroupFeature, getNewRegister } from '../../modules/GroupRelationCard'

class GroupInterpretationList extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      curNav: 'risk_insight_list'
    }
  }

  componentWillMount () {
    this.props.getGroupFeature()
    this.props.getNewRegister()
  }

  changeNavHandler (type) {
    this.setState({ curNav: type })
  }

  genSubNavList () {
    const navs = [{
      type: 'group_features_list',
      name: '群体特征'
    }, {
      type: 'risk_insight_list',
      name: '风险洞察'
    }, {
      type: 'opportunity_insight_list',
      name: '机会洞察'
    }]

    return (
      navs.map((t) => (
        <li className={t.type === this.state.curNav ? 'nav-item active' : 'nav-item'}
          key={t.name}
          onClick={(e) => this.changeNavHandler(t.type)}>
          {t.name}
        </li>
      ))
    )
  }

  genContentList () {
    const { curNav } = this.state
    if (curNav === 'group_features_list') {
      return (
        <GroupFeaturesList
          singleCompany={this.props.singleCompany}
          groupFeatureObj={this.props.groupFeatureObj}
        />
      )
    } else if (curNav === 'risk_insight_list') {
      return (
        <RiskInsightList
          singleCompany={this.props.singleCompany}
          relations={this.props.relations}
          selectCenterClusterNode={this.props.selectCenterClusterNode}
        />
      )
    } else if (curNav === 'opportunity_insight_list') {
      return (
        <OpportunityInsightList
          singleCompany={this.props.singleCompany}
          relations={this.props.relations}
          selectCenterClusterNode={this.props.selectCenterClusterNode}
          newRegisterObj={this.props.newRegisterObj}
        />
      )
    }
  }

  render () {
    return (
      <div className='tab-list scroll-style'>
        <div className='sub-nav'>
          <ul className='clearfix'>
            {this.genSubNavList()}
          </ul>
        </div>
        {this.genContentList()}
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
    groupFeatureObj: state.groupFeatureObj,
    newRegisterObj: state.newRegisterObj
  }
}

/**
 * map dispatch to props
 * @param {Object} dispatch dispatch
 * @return {Object} action
 */
const mapDispatchToProps = (dispatch) => {
  return {
    selectCenterClusterNode: (id) => dispatch(selectCenterClusterNode(id)),
    getGroupFeature: (groupName, type) => dispatch(getGroupFeature(groupName, type)),
    getNewRegister: (groupName, type) => dispatch(getNewRegister(groupName, type)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupInterpretationList)
