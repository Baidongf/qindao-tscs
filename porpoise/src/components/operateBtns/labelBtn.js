/**
 * @desc: { 标签按钮 }
 * @author: zhengyiqiu
 * @Create Date: 2018-12-18 17:34:46
 * @Last Modified by: zhengyiqiu
 * @Last Modified time: 2019-03-01 17:24:14
 */

import React from 'react'
import Btn from './btn'
import { connect } from 'react-redux'

import labelImg from './assets/label.svg'
import labelImgDeep from './assets/label_deep.svg'
import labelImgHighlight from './assets/label_highlight.svg'
import labelImgHighlightDeep from './assets/label_highlight_deep.svg'
import Tips from 'routes/cluster/routes/clusterGraph/components/tips'

class LabelBtn extends React.Component {
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
    if (this.props.isSingleCompany) {
      return <Tips />
    } else {
      return (
        <div className='btn-desc-container'>
          <div className='btn-desc-detail'>
            <h5 className="btn-desc-title">实体标签</h5>
            <ul className='btn-desc-detail-list not-click'>
              <li className='btn-desc-detail-item label label-rect core'>集团核心</li>
              <li className='btn-desc-detail-item label label-rect listed'>上市企业</li>
              <li className='btn-desc-detail-item label label-rect not-listed'>非上市企业</li>
              <li className='btn-desc-detail-item label label-rect person'>自然人</li>
            </ul>
            <h5 className="btn-desc-title">指示标签</h5>
            <ul className='btn-desc-detail-list not-click'>
              <li className='btn-desc-detail-item label label-triangle belong'>行内客户</li>
              <li className='btn-desc-detail-item label label-triangle abnormal'>异常经营状态</li>
              <li className='btn-desc-detail-item label label-triangle blacklist'>黑名单</li>
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
        <div className='operate-btn-box'>
          <Btn
            img={this.props.theme === 'light' ? labelImg : labelImgDeep}
            imgHighlight={this.props.theme === 'light' ? labelImgHighlight : labelImgHighlightDeep}
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
  isSingleCompany: state.singleCompanyState
})

export default connect(mapState, null)(LabelBtn)
