import React from 'react'
import './component.scss'
import PropTypes from 'prop-types'
import Loadable from 'react-loadable'
import HzLink from 'components/HzLink'

/**
 * Panel
 * @desc 首页业务模块容器组件
 * @param {string} panelTitle - 模块面板标题
 * @param {string} moreLinkHref - 点击“查看更多”的跳转链接
 * @param {number} contentType - 业务模块类型
 */

class Panel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      childrenPath: [
        'CustomerInfo',
        'CustomerActivity',
        'BusinessOpportunity',
        'WorkSchedule',
        'MarketingActivity',
        'KnowledgeBase',
        'MarketingResults',
      ]
    }
  }

  static propTypes = {
    panelTitle: PropTypes.string.isRequired,
    moreLinkHref: PropTypes.string,
    contentType: PropTypes.number.isRequired,
  }

  generateChildPath(type = 0) {
    const childrenPath = this.state.childrenPath;
    return `./children/${childrenPath[type]}`;
  }

  componentWillMount() { }

  render() {

    const { panelTitle, moreLinkHref, contentType } = this.props
    const isShowMoreLink = !!moreLinkHref ? true : false

    const childPath = this.generateChildPath(contentType)
    const ContentComponent = Loadable({
      loader: () => import(`${childPath}`),
      loading() {
        return <div></div>
      },
    })


    return (
      <div className='panel-component'>
        <div className='panel-title'>
          <span className='panel-flag'></span>
          {panelTitle}
          <HzLink to={`${moreLinkHref}`}>
            <span className={`more ${isShowMoreLink ? '' : 'hide'}`}>
              查看更多<span className='more-arrow'>&nbsp;&gt;</span>
            </span>
          </HzLink>
        </div>
        <div className='panel-content'>
          <ContentComponent />
        </div>
      </div>
    )
  }
}

export default Panel
