import React from 'react'
import './popup.scss'
import EventDetail from './eventDetail'
import RelationDetail from './relationDetail'

class Popup extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isRiskShow: false
    }

    this.closeRiskInfo = this.closeRiskInfo.bind(this)
  }

  componentWillMount () {
    this.setState({ isRiskShow: this.props.isRiskShow })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isRiskShow) {
      this.setState({ isRiskShow: nextProps.isRiskShow })
    }
  }

  closeRiskInfo () {
    this.props.closeRiskInfo()
    // this.setState({ isRiskShow: false })
  }

  render () {
    let popupContent = ''
    let popupType = this.props.type
    if (this.state.isRiskShow && this.props.popupItem && popupType) {
      if (popupType === 'block') {
        popupContent = (
          <div className='risk-info-body'>
            <div className='detail-item clearfix'>
              <p className='title'>转入方：</p>
              <p className='content'>
                {this.props.popupItem.toEntityName || '--'}
              </p>
            </div>
            <div className='detail-item clearfix'>
              <p className='title'>转出方：</p>
              <p className='content'>{this.props.popupItem.fromEntityName || '--'}</p>
            </div>
            <div className='detail-item clearfix'>
              <p className='title'>交易金额：</p>
              <p className='content'>{this.props.popupItem.rmbValue + '万元' || '--'}</p>
            </div>
            <div className='detail-item clearfix'>
              <p className='title'>交易日期：</p>
              <p className='content'>{this.props.popupItem.transTime.split(' ')[0] || '--'}</p>
            </div>
          </div>
        )
      } else if (popupType === 'expire') {
        popupContent = (
          <div className='risk-info-body'>
            <div className='detail-item clearfix'>
              <p className='title'>客户名称：</p>
              <p className='content'>
                {this.props.popupItem.entityName || '--'}
              </p>
            </div>
            <div className='detail-item clearfix'>
              <p className='title'>业务类型：</p>
              <p className='content'>
                {this.props.popupItem.type || '--'}
              </p>
            </div>
            <div className='detail-item clearfix'>
              <p className='title'>业务金额：</p>
              <p className='content'>
                {this.props.popupItem.rmbValue + '万元' || '--'}
              </p>
            </div>
            <div className='detail-item clearfix'>
              <p className='title'>到期日：</p>
              <p className='content'>
                {this.props.popupItem.dueTime.split(' ')[0] || '--'}
              </p>
            </div>
          </div>
        )
      } else if (popupType === 'credit_info') {
        popupContent = (
          <div className='risk-info-body'>
            <div className='detail-item clearfix'>
              <p className='title'>授信对象：</p>
              <p className='content'>
                {this.props.popupItem.entityName || '--'}
              </p>
            </div>
            <div className='detail-item clearfix'>
              <p className='title'>授信金额：</p>
              <p className='content'>
                {this.props.popupItem.creditMoney + '万元' || '--'}
              </p>
            </div>
            <div className='detail-item clearfix'>
              <p className='title'>授信额度：</p>
              <p className='content'>
                {this.props.popupItem.creditLimit + '万元' || '--'}
              </p>
            </div>
            <div className='detail-item clearfix'>
              <p className='title'>额度到期日期：</p>
              <p className='content'>
                {this.props.popupItem.creditDueDate.split(' ')[0] || '--'}
              </p>
            </div>
            <div className='detail-item clearfix'>
              <p className='title'>授信状态：</p>
              <p className='content'>
                {this.props.popupItem.creditStatus || '--'}
              </p>
            </div>
          </div>
        )
      }
    }
    return (
      <div className={this.state.isRiskShow ? 'risk-info-layout' : 'risk-info-layout risk-hide'}>
        <div className='risk-info-header clearfix'>
          <span className='title'>
            {this.props.title}
          </span>
          <i className='i-close' onClick={this.closeRiskInfo} />
        </div>
        <div className='risk-info-container'>
          {
            this.props.riskType
              ? <EventDetail
                index={this.props.curIndex}
                riskList={this.props.riskList}
                isRiskShow={this.props.isRiskShow}
                closeRiskInfo={this.props.closeRiskInfo}
                singleCompany={this.props.singleCompany}
                showRelativeGraph={this.props.showRelativeGraph}
                depth={this.props.depth}
                riskType={this.props.riskType}
              />
              : ('')
          }
          {
            this.props.groupName
              ? <RelationDetail
                capitalCirculationName={this.props.groupName}
              />
              : ('')
          }
          {
            this.props.popupItem
              ? popupContent : ('')
          }
        </div>
      </div>
    )
  }
}

export default Popup
