import React from 'react'
import './component.scss'

class OpportunityDetailContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const {
      customerType,
      customerName,
      createTime,
      source,
      status,
      type,
      description,
      followUserName,
      synergyUsers,
      createName
    } = this.props
    return (
      <div className='opportunity-detail-content-component'>
        <div className='title'>商机内容</div>

        {/* <div className='detail-row'>
          <span className='row-title'>客户类型</span>
          <span className='row-content'>{customerType || '-'}</span>
        </div>

        <div className='detail-row'>
          <span className='row-title'>客户名称</span>
          <span className='row-content'>{customerName || '-'}</span>
        </div> */}

        <div className='detail-row'>
          <span className='row-title'>创建时间</span>
          <span className='row-content'>{createTime || '-'}</span>
        </div>

        <div className='detail-row'>
          <span className='row-title'>商机来源</span>
          <span className='row-content'>{source || '-'}</span>
        </div>

        <div className='detail-row'>
          <span className='row-title'>商机状态</span>
          <span className='row-content'>{status || '-'}</span>
        </div>

        <div className='detail-row'>
          <span className='row-title'>商机类型</span>
          <span className='row-content'>{type || '-'}</span>
        </div>

        <div className='detail-row'>
          <span className='row-title'>商机描述</span>
          <span className='row-content'>{description || '-'}</span>
        </div>
        <div className='detail-row'>
          <span className='row-title'>创建人</span>
          <span className='row-content'>{createName || '-'}</span>
        </div>
        <div className='detail-row'>
          <span className='row-title'>跟进人</span>
          <span className='row-content'>{followUserName || '-'}</span>
        </div>

        <div className='detail-row'>
          <span className='row-title'>协同人</span>
          <span className='row-content'>{synergyUsers&&synergyUsers.map((item,index)=>{
              return item.userName+" "
          }) || '-'}</span>
        </div>
      </div>
    )
  }
}


export default OpportunityDetailContent
