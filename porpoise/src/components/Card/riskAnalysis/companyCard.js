import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Layout from 'components/Card/Layout'
import { getCompanyBrief, toggleCardType } from 'actions/Card'
// import { toggleCardType } from 'routes/RiskAnalysis/modules/riskAnalysis'
import PropTypes from 'prop-types'
import { riskStatus } from 'graph.config'

class CompanyCard extends React.Component {
  constructor (props) {
    super(props)

    this.clickRelationBtn = this.clickRelationBtn.bind(this)
  }

  componentDidMount () {
    // 初次进入以企业为中心的图谱页 || 初次从找关系切换至企业详情（直接右键找关系，之前未选中当前node展示企业详情）
    // if (!this.props.companyBrief.company || this.props.companyBrief.company !== this.props.relationSrcName) {
    //   const companyName = this.props.relationSrcName || this.props.reduxLocation.query.company ||
    //     this.props.initCompanyName
    //   if (!companyName) return
    //   this.props.getCompanyBrief(companyName)
    // }
  }

  clickRelationBtn () {
    // this.props.toggleCardType('Relation')
  }
  render () {
    const { curNode, companyBrief, initCompanyName } = this.props
    const Back = this.props.curNode._id && this.props.curNode._id.includes('mergeNode') ? (
      <div className='card-title clearfix' onClick={() => this.props.toggleCardType('merge_relation')}>
        <i className='back' />
        <h2 className='company-detail-title'>群体详情</h2>
      </div>
    ) : null
    const CardHeader = (
      <div>
        {Back}
        <div>
          <h2 className='name'>{companyBrief.name || ''}</h2>
          <div className='card-title clearfix'>
            {
              companyBrief.business_status &&
              <span className='company-status'>{companyBrief.business_status}</span>
            }
          </div>
          <p className='company-address'>{companyBrief.address}</p>
          <div className='relation-btn' />
        </div>
      </div>
    )
    console.log(companyBrief)
    const CardBody = (
      <dl className='description-list scroll-style'>
        <div>
          <dt>企业名称</dt>
          <dd>{companyBrief.name || ''}</dd>
        </div>
        <div>
          <dt>授信金额</dt>
          <dd>{companyBrief.credit_money ? companyBrief.credit_money : '0'}</dd>
        </div>
        <div>
          <dt>授信类型</dt>
          <dd>{companyBrief.type || '--'}</dd>
        </div>
        <div>
          <dt>授信起始时间</dt>
          <dd>{companyBrief.start_time ? moment(companyBrief.start_time).format('YYYY-MM-DD') : '--'}</dd>
        </div>
        <div>
          <dt>授信终止时间</dt>
          <dd>{companyBrief.end_time ? moment(companyBrief.end_time).format('YYYY-MM-DD') : '--'}</dd>
        </div>
        <div>
          <dt>经营范围</dt>
          <dd>{companyBrief.width || '--'}</dd>
        </div>
      </dl>
    )
    return (
      <Layout
        cardHeader={CardHeader}
        cardBody={CardBody}
        type={curNode._type || ''}
        name={companyBrief.company || initCompanyName} />
    )
  }
}

CompanyCard.propTypes = {
  companyBrief: PropTypes.object,
  reduxLocation: PropTypes.object,
  relationSrcName: PropTypes.string,
  initCompanyName: PropTypes.string,
  getCompanyBrief: PropTypes.func,
  toggleCardType: PropTypes.func,
  curNode: PropTypes.object
}

const mapStateToProps = state => {
  return {
    companyBrief: state.companyBriefData,
    reduxLocation: state.location,
    relationSrcName: state.relationSrcName,
    initCompanyName: state.initCompanyName,
    curNode: state.curNode
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCompanyBrief: companyName => dispatch(getCompanyBrief(companyName)),
    toggleCardType: cardType => dispatch(toggleCardType(cardType))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyCard)
