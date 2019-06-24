import React from 'react'
import { Link } from 'react-router'

class NavTab extends React.Component {
  constructor(props) {
    super(props)
  }

  genNavTab () {
    const { activeTab } = this.props
    const tabs = [{
      type: 'profile_enterprise_info',
      name: '集团派系'
    }, {
      type: 'risk_guarantee_info',
      name: '担保圈链'
    }, {
      type: 'risk_black_info',
      name: '黑名单关联族谱'
    }, {
      type: 'market_updown_info',
      name: '上下游族谱'
    }]

    return tabs.map((t) => (
      <li className={activeTab === t.type ? 'nav-list-item active' : 'nav-list-item'} key={t.name}>
        <Link to={`/graph/cluster/nav?type=${t.type}`}>{t.name}</Link>
      </li>
    ))
  }

  render () {
    return (
      <ul className='nav-list'>
        {this.genNavTab()}
      </ul>
    )
  }
}

export default NavTab
