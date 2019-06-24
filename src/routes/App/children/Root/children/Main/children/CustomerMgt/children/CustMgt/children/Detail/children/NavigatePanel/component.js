import React from 'react'
import './component.scss'
import flyArrow from './images/fly-arrow.svg'

class NavigatePanel extends React.Component {
  static defaultProps = {
    isInBank: true, // 客户为行内 or 行外？
  }

  constructor(props) {
    super(props)
    this.state = {}

    // 点击锚点对应的面板id
    this.elements = {
      customer: '#basicInfo', // 客户基本信息
      account: '#accountInfo', // 账户信息
      finance: '#financeInfo', // 财务信息
      relation: '#relationship', // 关联关系
    }

    this.navigate = this.navigate.bind(this)
  }

  find(el) {
    return document.querySelector(el)
  }

  // 实现点击锚点定位至对应元素
  navigate(ev) {
    ev.stopPropagation()
    const targetId = ev.target.id
    const elements = this.elements
    const panelId = elements[targetId]
    const panel = this.find(panelId)
    if (!!panel) {
      panel.scrollIntoView()
    } else {
      console.info(`id 为 ${panelId} 的元素不存在`)
    }
  }

  render() {

    // 是否为行内用户？
    const isInner = parseInt(this.props.customerBasicInfo.isInter)

    return (
      <div className='navigate-panel-component'>

        <div className='panel-title'>
          <img className='title-icon' src={flyArrow} alt='' />
          <span>导航</span>
        </div>

        <div className='panel-content' onClick={this.navigate}>
          <div className='panel-item' id='customer'>客户基本信息</div>
          {
            isInner === 0 ?
            <div className='panel-item' id='account'>账户信息</div> : null
          }
          {
            isInner === 0 ?
            <div className='panel-item' id='finance'>财务信息</div> : null
          }
          <div className='panel-item' id='relation'>关联关系</div>
        </div>

      </div>
    )
  }

}

export default NavigatePanel
