/**
 * @desc: { 提示按钮 }
 * @author: zhengyiqiu
 * @Create Date: 2018-12-18 17:34:46
 * @Last Modified by: zhengyiqiu
 * @Last Modified time: 2019-02-28 16:55:54
 */

import React from 'react'
import Btn from './btn'
import { connect } from 'react-redux'

import tipImg from './assets/tip.svg'
import tipImgDeep from './assets/tip_deep.svg'
import tipImgHighlight from './assets/tip_highlight.svg'
import tipImgHighlightDeep from './assets/tip_highlight_deep.svg'

class TipBtn extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isShowPopover: false
    }

    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
  }

  onMouseEnter () {
    this.setState({
      isShowPopover: true
    })
  }

  onMouseLeave () {
    this.setState({
      isShowPopover: false
    })
  }

  getSelectPopover () {
    if (this.props.reduxLocation.query.type === 'profile_enterprise_info') {
      return (
        <div className='btn-desc-container'>
          <div className='btn-desc-detail'>
            <h5 className='btn-desc-title'>算法规则说明</h5>
            <span className='btn-desc-summary'>以全量行内信贷客户为起点，以集团管理办法为指导，基于下列关联关系进行传导</span>
            <ul className='btn-desc-detail-list not-click'>
              <li className='btn-desc-detail-item'>直接控股（一度投资对象，且持股比例在50%以上）</li>
              <li className='btn-desc-detail-item'>第一大股东（一层股东，持股比例大于30%且小于50%，且持股比例最高）</li>
              <li className='btn-desc-detail-item'>间接控股（二度及以上投资对象，且累计持股比例在50%以上）</li>
              {/* <li className='btn-desc-detail-item'>实际控制人（实际股权比例在50%上）</li> */}
              <li className='btn-desc-detail-item'>控股股东（直接投资比例在50%以上）</li>
              <li className='btn-desc-detail-item'>企业核心高管（包括：董事长、法定代表人、总经理）</li>
              <li className='btn-desc-detail-item'>共控股股东的企业</li>
              <li className='btn-desc-detail-item'>共同核心高管的企业</li>
            </ul>
          </div>
        </div>
      )
    } else if (this.props.reduxLocation.query.type === 'risk_guarantee_info') {
      return (
        <div className='btn-desc-container'>
          <div className='btn-desc-detail btn-desc-detail-risk'>
            <h5 className='btn-desc-title'>算法规则说明</h5>
            <p className='btn-desc-content'>基于机构内的企业间担保数据、企业董监高和企业间的担保数据进行挖掘，得到具有<span>互保、联保、担保链条</span>等形态特征的高风险担保圈</p>
          </div>
        </div>
      )
    } else if (this.props.reduxLocation.query.type === 'market_updown_info') {
      return (
        <div className='btn-desc-container'>
          <div className='btn-desc-detail btn-desc-detail-risk'>
            <h5 className='btn-desc-title'>算法规则说明</h5>
            <p className='btn-desc-content'>基于行内的转账、票据、票据背书、受托支付、保函、信用证等数据，挖掘出<span>企业间</span>的上下游关系</p>
          </div>
        </div>
      )
    } else if (this.props.reduxLocation.query.type === 'risk_black_info') {
      return (
        <div className='btn-desc-container'>
          <div className='btn-desc-detail'>
            <h5 className='btn-desc-title'>算法规则说明</h5>
            <span className='btn-desc-summary'>该功能需要接入人行、银监、行内的黑名单列表，在下列传导关系的基础上，得到和黑名单企业的关联族谱，族谱中任一企业都存在关联风险：</span>
            <ul className='btn-desc-detail-list not-click'>
              <li className='btn-desc-detail-item'>疑似同一企业</li>
              <li className='btn-desc-detail-item'>控股股东</li>
              <li className='btn-desc-detail-item'>实际控制人</li>
              <li className='btn-desc-detail-item'>间接控股/被间接控股</li>
              <li className='btn-desc-detail-item'>共董监高</li>
              <li className='btn-desc-detail-item'>资金交易大额、频繁</li>
            </ul>
          </div>
        </div>
      )
    }
  }

  render () {
    let selectPopover = null
    if (this.state.isShowPopover) {
      selectPopover = this.getSelectPopover()
    }

    return (
      <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} className='operate-btn-popover-box'>
        <div className='operate-btn-box' onClick={this.click}>
          <Btn
            img={this.props.theme === 'light' ? tipImg : tipImgDeep}
            imgHighlight={this.props.theme === 'light' ? tipImgHighlight : tipImgHighlightDeep}
            isShowPopover={this.state.isShowPopover}
          />
        </div>
        {selectPopover}
      </div>
    )
  }
}

const mapState = (state) => ({
  theme: state.setTheme,
  reduxLocation: state.location
})

export default connect(mapState, null)(TipBtn)
