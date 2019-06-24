import React from 'react'
import './component.scss'
import { Icon } from 'antd'
import { withRouter } from 'react-router-dom'

/**
 * Recent
 * @desc 最近查看的内容
 */
class Recent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { }
  }

  goToDetail(companyKey) {
    this.props.history.push(`/root/main/customerMgt/custMgt/detail?companyKey=${companyKey}`)
  }

  render() {
    const records = this.props.records
    return (
      <div className='recent-component'>
        <div className='title'>
          <Icon type='eye' theme='filled' className='eye-icon' />最近浏览：
        </div>
        <div className='content'>
        {
          records.length > 0 ?
            records.map(item => {
              return (
                <div
                  className='item history-item'
                  key={item.companyKey}
                  onClick={this.goToDetail.bind(this, item.companyKey)}
                  title={item.companyName}
                >{item.companyName}</div>
              )
            }) :
            <div className='item'>暂无浏览记录</div>
        }

        </div>
      </div>
    )
  }
}

export default withRouter(Recent)
