import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import Layout from './Layout'
import { getCompanyBrief, toggleCardType } from '../../actions/Card'
import PropTypes from 'prop-types'
import { riskStatus } from 'graph.config'

class CompanyCard extends React.Component {
  constructor (props) {
    super(props)

    this.clickRelationBtn = this.clickRelationBtn.bind(this)
  }

  componentDidMount () {
    // 初次进入以企业为中心的图谱页 || 初次从找关系切换至企业详情（直接右键找关系，之前未选中当前node展示企业详情）
    if (!this.props.companyBrief.company || this.props.companyBrief.company !== this.props.relationSrcName) {
      const companyName = this.props.relationSrcName || this.props.reduxLocation.query.company ||
        this.props.initCompanyName
      if (!companyName) return
      this.props.getCompanyBrief(companyName)
    }
  }

  clickRelationBtn () {
    this.props.toggleCardType('Relation')
  }

  /**
   * 将xxxxx.xx元格式化成x.xx万元
   * @param {Number} num number
   * @param {String} unit unit
   * @return {String} 格式化后的数据
   */
  formatCapital (num, unit) {
    unit = unit || ''

    /**
     * xxxxxxx -> x,xxx,xxx
     * @param {Number} num num
     * @return {String} 格式化后数据
     */
    function format (num) {
      return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
    }

    if (parseFloat(num) === 0) {
      return '未公布'
    }
    if (isNaN(num)) {
      return '--'
    }
    if (num) {
      if (num < 10000) {
        return format(parseFloat(num)) + unit
      }
      return format(num / 10000) + ' 万' + unit
    }

    return '--'
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
            <i className='back'/>
            <span className='back-text'>{text}</span>
          </div>
        )
      )
    }

    return BackBtn
  }

  render () {
    const { curNode, companyBrief, initCompanyName } = this.props
    const Back = this.generateBackBtn()
    const CardHeader = (
      <div>
        {Back}
        <div>
          <h2 className='name'>{companyBrief.company || initCompanyName}</h2>
          <div className='card-title clearfix'>
            {
              companyBrief.business_status &&
              <span className='company-status'>{companyBrief.business_status}</span>
            }
          </div>
          <p className='company-address'>{companyBrief.address}</p>
          <div className='relation-btn' onClick={this.clickRelationBtn}/>
        </div>
      </div>
    )

    const CardBody = (
      <dl className='description-list scroll-style'>
        <div>
          <dt>法定代表人</dt>
          <dd>{companyBrief.legal_man || '--'}</dd>
        </div>
        <div>
          <dt>注册资本</dt>
          <dd>{Number(companyBrief.registered_capital)
            ? this.formatCapital(companyBrief.registered_capital, companyBrief.registered_capital_unit) ||
            '' : '未公布'}</dd>
        </div>
        <div>
          <dt>成立日期</dt>
          <dd>{companyBrief.registered_date ? moment(companyBrief.registered_date).format('YYYY-MM-DD') : '--'}</dd>
        </div>
        <div>
          <dt>注册号</dt>
          <dd>{companyBrief.registered_code || '--'}</dd>
        </div>
        <div className={riskStatus.includes(companyBrief.business_status) ? 'risk-status' : ''}>
          <dt>经营状态</dt>
          <dd>{companyBrief.business_status || '--'}</dd>
        </div>
        <div>
          <dt>统一社会信用代码</dt>
          <dd>{companyBrief.unified_social_credit_code || '--'}</dd>
        </div>
        <div>
          <dt>经营范围</dt>
          <dd>{companyBrief.business_scope || '--'}</dd>
        </div>
      </dl>
    )

    return (
      <Layout
        cardHeader={CardHeader}
        cardBody={CardBody}
        type={curNode._type || ''}
        name={companyBrief.company || initCompanyName}
        customClass='company-card'/>
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
