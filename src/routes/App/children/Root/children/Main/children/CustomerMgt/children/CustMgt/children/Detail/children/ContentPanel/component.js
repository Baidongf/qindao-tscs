import React from 'react'
import './component.scss'
import PropTypes from 'prop-types'
import Loadable from 'react-loadable'

/**
 * ContentPanel
 * @desc 客户详情的内容面板组件(客户基本信息/账户信息/财务信息)
 * @param {string} panelTitle - 面板标题
 * @param {number} contentType - 业务模块类型(0:客户基本信息/1:账户信息/2:财务信息)
 */

class ContentPanel extends React.Component {

  static propTypes = {
    contentType: PropTypes.number,
  }

  static defaultProps = {
    contentType: 0,
  }

  constructor(props) {
    super(props)
    this.state = {}
    this.childrenPath = [
      'BasicInfo',
      'AccountInfo',
      'FinanceInfo',
    ]
    this.titles = [
      '客户基本信息',
      '账户信息',
      '财务信息',
    ]
    this.ids = [
      'basicInfo',
      'accountInfo',
      'financeInfo',
    ]

    this.generateChildPath = this.generateChildPath.bind(this)
  }

  generateChildPath(type = 0) {
    const childrenPath = this.childrenPath
    if (
      type === 0 &&
      parseInt(this.props.isInner) === 1
    ) {
      // 渲染行外客户的基本信息表格
      return `./children/${childrenPath[type]}Outer`
    }
    return `./children/${childrenPath[type]}`
  }

  shouldComponentUpdate({ isInner }) {
    return isInner !== this.props.isInner
  }

  render() {
    const { titles, ids } = this
    const { contentType, customerName } = this.props

    const childPath = this.generateChildPath(contentType)
    const ChildComponent = Loadable({
      loader: () => import(`${childPath}`),
      loading() {
        return <div></div>
      },
    })

    return (
      <div className='content-panel-component'>
        <div className='content-title' id={ids[contentType]}>
          <span className='panel-flag'></span>
          {titles[contentType]}
        </div>
        <div className='content-body'>
          <ChildComponent customerName={customerName} />
        </div>
      </div>
    )
  }

}

export default ContentPanel
