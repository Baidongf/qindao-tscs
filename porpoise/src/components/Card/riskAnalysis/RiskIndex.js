import React from 'react'
import { connect } from 'react-redux'
// import { getClusterNames } from 'routes/RiskAnalysis/modules/riskAnalysis'

class RiskIndex extends React.Component {
  render () {
    const data = this.props.creditData
    return (
      <div className='card risk-card-box'>
        <div className='risk-index-title'>
          集团客户授信集中度指标
          <i className='help-icon' />
          <div className='description'>
            <p>关联集团授信集中度定义：</p>
            <p>(1) 公式：某关联集团授信集中度＝该集团客户授信敞口总额／银行资本净额×100%</p>
            <p>(2) 集团客户定义按照《商业银行集团客户授信业务风险管理指引》(中国银行业监督管理委员会2003年第5号令) 及相关法规要求执行；</p>
            <p>(3) 银监规定：最大的集团客户集中度不应高于15%；</p>
          </div>
        </div>
        <p>集团授信集中度<i className='risk-index-percen'>{data['credit_percen_total'] || '--'}</i></p>
        <p>单一客户授信集中度:<i className='risk-index-percen'>{data['credit_percen'] || '--'}</i></p>
        <p className='risk-index-money-title'>集团授信金额</p>
        <p className='risk-index-money'>{data['credit_money_total'] || '--'}</p>
        <p className='risk-index-money-title'>当前客户授信金额</p>
        <p className='risk-index-money'>{data['credit_money'] || '--'}</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    creditData: state.creditData
  }
}

export default connect(mapStateToProps, null)(RiskIndex)
