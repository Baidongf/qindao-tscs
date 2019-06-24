import React from 'react'
import './component.scss'

import PropTypes from 'prop-types'

/**
 * MarketingResult
 * @desc 首页营销成果的数据展示组件
 * @param {string} iconType - 标题处展示的图标类型 ['deposit', 'balance', 'loan']
 * @param {string} title - 标题
 * @param {string} amount - 金额数
 * @param {boolean} isArrowUp - 涨或跌
 * @param {string} desc - 描述字段，值为相比上月的浮动百分比
 */

class MarketingResult extends React.Component {
  static propTypes = {
    iconType: PropTypes.string,
    title: PropTypes.string,
    amount: PropTypes.string,
    isArrowUp: PropTypes.bool,
    desc: PropTypes.string,
  }

  static defaultProps = {
    iconType: '',
    title: 'title',
    amount: '¥0.00',
    isArrowUp: true,
    desc: '0.0%',
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  toThousands(numStr) {
    const num = parseInt(numStr)
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }

  render() {

    const {
      iconType,
      title,
      amount,
      isArrowUp,
    } = this.props
    const desc = (isArrowUp ? '上涨' : '下跌') + this.props.desc + '%'

    return (
      <div className='marketing-result'>
        <div className='result-title'>
          <span className={`icon icon-${iconType}`}></span>
          <span title={title}>{ title }</span>
        </div>
        <div className='result-data'>
          <span className={`data-amount ${isArrowUp ? 'color-red' : 'color-green'}`}>{ this.toThousands(amount) }</span>
          <span className={`icon ${isArrowUp ? 'arrow-up' : 'arrow-down'}`}></span>
        </div>
        <div className='result-desc'>
          <span>同比上月</span>
          <span className={`${isArrowUp ? 'color-red' : 'color-green'}`}>{ desc }</span>
        </div>
      </div>
    )
  }
}

export default MarketingResult
