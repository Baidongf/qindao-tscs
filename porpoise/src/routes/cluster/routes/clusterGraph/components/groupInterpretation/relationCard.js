import React from 'react'
import { connect } from 'react-redux'
import './relationCard.scss'
import Popup from './popup'
import { getCapitalCircleDetail, getMutualGuaraDetail } from '../../modules/GroupRelationCard'
// import { stat } from 'fs';

class RelationCard extends React.Component {
  constructor (props) {
    super(props)
    // this.state = {
    //   isRiskShow: false
    // }

    this.curIndex = -1
    this.groupName = ''
    this.jumpText = ''
    this.type = ''
    this.title = ''

    this.showDetail = this.showDetail.bind(this)
    this.closeRiskInfo = this.closeRiskInfo.bind(this)
  }

  showDetail (index, groupName) {
    this.curIndex = index
    this.groupName = groupName
    this.getDetail()
    this.props.triggerRiskShow(this.props.relationName)
    // this.setState({ isRiskShow: true })
  }

  getDetail () {
    const { query } = this.props.reduxLocation
    let jsonData = {
      enterpriseGroupName: query.group_name,
      relationGroupName: this.groupName
    }
    if (this.type === '资金流转') {
      this.props.getCapitalCircleDetail(jsonData)
    } else if (this.type === '联保互保') {
      this.props.getMutualGuaraDetail(jsonData)
    }
  }

  closeRiskInfo () {
    this.props.triggerRiskShow('')
    // this.setState({ isRiskShow: false })
  }

  render () {
    if (this.props.groupType === 'capital_circle') {
      this.title = '资金流转详情'
      this.type = '资金流转'
      this.jumpText = '查看转账记录详情'
    } else if (this.props.groupType === 'mutual_guara') {
      this.title = '联保互保详情'
      this.type = '联保互保'
      this.jumpText = '查看担保记录详情'
    }
    return (
      <div className='result-body'>
        {
          this.props.riskList.map((d, i) => {
            const members = d.members || d.entitiesName
            const groupName = d.groupName || d.relationGroupName
            const totalAmount = d.totalAmount || d.guaranteeAmount
            const totalText = d.totalAmount ? '关联资金流转环转账总金额：' : '关联担保圈链有效担保总金额：'
            const companies = members.map((c) => {
              return (
                <div key={c} className='name'>{c}</div>
              )
            })
            return (
              <div key={groupName} className='relation-card'>
                <div className='relation-company'>
                  {/* <div className='title'>涉及企业：</div> */}
                  {companies}
                </div>
                <div className='relation-total'>
                  {totalText}
                  <span className='relation-total-detail'>¥{totalAmount}万元</span>
                </div>
                <div className='relation-more' onClick={() => this.showDetail(i, groupName)}>{this.jumpText}</div>
              </div>
            )
          })
        }
        {
          this.props.isRiskShow
            ? <Popup
              title={this.title}
              groupName={this.groupName}
              isRiskShow={this.props.isRiskShow}
              closeRiskInfo={this.closeRiskInfo}
            />
            : ('')
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
    getCapitalCircleDetail: (jsonData) => dispatch(getCapitalCircleDetail(jsonData)),
    getMutualGuaraDetail: (jsonData) => dispatch(getMutualGuaraDetail(jsonData))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RelationCard)
