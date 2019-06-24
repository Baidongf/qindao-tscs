import React from 'react'
import './component.scss'
import { Button } from 'antd'
import { withRouter } from 'react-router-dom'


class DetailHeader extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hasConfirmed: false
    }

    this.institutionLevel = null
    this.isCustomerManager = null
    this.userId = null

    this.activityType = null

  }

  // 确认活动
  confirmHandler = () => {
    this.props.confirmActivity(this.props.id, () => {
      this.setState({
        hasConfirmed: true
      })
    })
  }

  // 完成活动
  completeHandler = () => {
    this.props.finishActivity(this.props.id, () => {
      this.props.history.goBack()
    })
  }

  // 终止活动
  suspendHandler = () => {
    this.props.suspendActivity(this.props.id, () => {
      this.props.history.goBack()
    })
  }

  // 分配活动
  distributeHandler = () => {
    const id = this.props.id
    this.props.history.push(`./createOrEdit?id=${id}&operation=distribution`)
  }

  componentWillMount = () => {
    const userId = localStorage.getItem('USER_ID')
    const isCustomerManager = localStorage.getItem('IS_CUSTOMER_MANAGER')
    const institutionLevel = localStorage.getItem('INSTITUTION_LEVEL')

    this.userId = userId
    this.isCustomerManager = isCustomerManager
    this.institutionLevel = institutionLevel

    const href = window.location.href
    this.activityType = href.indexOf('createActivity') > -1 ? 'createActivity' : 'receiveActivity'
  }

  render() {
    const {
      title,
      createTime,
      code,
      statusWording,
      confirmed,
      confirmedWording,
      userId,
      status, //0未开始 1执行中 2已结束
    } = this.props

    const { hasConfirmed } = this.state

    const { institutionLevel, isCustomerManager, activityType } = this
    const localUserId = this.userId

    return (
      <div className='activity-detail-header-component'>
        <div className="contain-left">
          <div className='detail-title'>{title || '-'}
            <span className='tag-style'>
              {
                hasConfirmed ?
                '已确认' :
                (confirmedWording || '-')
              }
            </span>
          </div>
          <div className='tags-container'>
            <span className='tag '>创建日期：{createTime || '-'}</span>
            <span className='tag '>活动编号：{code || '-'}</span>
            <span className='tag '>活动类型：{statusWording || '-'}</span>
          </div>
        </div>
        <div className="contain-right">
          {
            activityType === 'createActivity' ? (
              parseInt(status) === 2 ?
              <Button disabled>已结束</Button> :
              <div>
                <Button type="primary" className="btn-style" onClick={this.completeHandler}>完成</Button>
                {
                  parseInt(userId) === parseInt(localUserId) ?
                  <Button type="default" className='end-btn' onClick={this.suspendHandler}>终止</Button> : null
                }

              </div>
            ) : (
              activityType === 'receiveActivity' ?
              <div>
                {
                  confirmed || hasConfirmed ?
                  <Button type="primary" className="btn-style" disabled>已确认</Button> :
                  <Button type="primary" className="btn-style" onClick={this.confirmHandler}>确认</Button>
                }
                {
                  isCustomerManager === '0' ? (
                    // 是一二级机构，不是客户经理，且活动已确认
                    parseInt(institutionLevel) < 4 &&
                    (confirmed || hasConfirmed) ?
                    <Button type="default" className='distribute-btn' onClick={this.distributeHandler}>分配</Button> :
                    <Button type="default" className='distribute-btn' disabled>分配</Button>
                  ) : null
                }
              </div> : null
            )
          }

        </div>
      </div>
    )
  }
}

export default withRouter(DetailHeader)
