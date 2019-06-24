import React from 'react'
import { withRouter } from 'react-router-dom'
import './component.scss'
import { Icon } from 'antd'
import HzLink from 'components/HzLink'

class RecentBrowse extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.props.getRecentBrowse()
  }

  shouldComponentUpdate({ recentBrowseRecords }) {
    if (recentBrowseRecords.data.length !== this.props.recentBrowseRecords.data.length) {
      return true
    }
    return false
  }

  render() {

    const { recentBrowseRecords } = this.props
    const records = recentBrowseRecords.data.slice(0, 5) // 只读取五条浏览记录

    return (
      <div className='recent-browse-component'>
        <div className='title'>
          <Icon type='eye' className='icon-eye' />
          最近浏览
        </div>
        <div className='content'>

          {
            records.length > 0 ?
            records.map((record) => {
              return (
                <HzLink
                  to={`/root/main/customerMgt/custMgt/detail?companyKey=${record.companyKey}`}
                  key={record.companyKey}
                >
                  <div className='item'>
                    <div className='item-title'>{ record.companyName }</div>
                    <div className='item-date'>{ record.createTime }</div>
                  </div>
                </HzLink>
              )
            }) : (
              <div className='no-content-tip'>暂无浏览记录</div>
            )
          }

        </div>
      </div>
    )
  }
}

export default withRouter(RecentBrowse)
