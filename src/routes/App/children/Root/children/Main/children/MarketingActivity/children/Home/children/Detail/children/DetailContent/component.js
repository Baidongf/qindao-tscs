import React from 'react'
import './component.scss'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading'
import { Icon } from 'antd'

const DownloadFile = Loadable({
  loader: () => import('components/DownloadFile'),
  loading: RouteLoading
})

class ActivityDetailContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const {
      executorInstitutionName,
      endTime,
      startTime,
      remindFlag,
      remindDay,
      attachments,
      status,
      households,
      replace,
      amount,
      description
    } = this.props
    return (
      <div className='activity-detail-content-component'>
        <div className='title'>活动内容</div>

        <div className='detail-row'>
          <span className='row-title'>执行方</span>
          <span className='row-content'>{executorInstitutionName || '-'}</span>
        </div>

        <div className='detail-row'>
          <span className='row-title'>执行状态</span>
          <span className='row-content'>{status || '-'}</span>
        </div>

        <div className='detail-row'>
          <span className='row-title'>开始日期</span>
          <span className='row-content'>{startTime || '-'}</span>
        </div>

        <div className='detail-row'>
          <span className='row-title'>结束日期</span>
          <span className='row-content'>{endTime || '-'}</span>
        </div>

        <div className='detail-row'>
          <span className='row-title'>目标户数(户)</span>
          <span className='row-content'>{households || '-'}</span>
        </div>

        <div className='detail-row'>
          <span className='row-title'>目标金额(万元)</span>
          <span className='row-content'>{amount}</span>
        </div>

        <div className='detail-row'>
          <span className='row-title'>是否提醒执行方</span>
          <span className='row-content'>{remindFlag || '-'}</span>
        </div>

        <div className='detail-row'>
          <span className='row-title'>倒计时提醒天数</span>
          <span className='row-content'>{remindDay || '-'}</span>
        </div>

        <div className='detail-row'>
          <span className='row-title'>地点</span>
          <span className='row-content'>{replace || '-'}</span>
        </div>

        <div className='detail-row'>
          <span className='row-title'>任务描述</span>
          <span className='row-content'>{description || '-'}</span>
        </div>

        {/* 附件区域 */}
        <div className='attachments-container'>
          <div className='attachments-title'>附件</div>
          <div className='attachments-content'>

            {
              !attachments || attachments.length < 1 ?
                <div className='attachments'>
                  <span className='file-title'>
                    <span className='attachment-icon'></span>
                    <span className='wording'>无附件</span>
                  </span>
                </div> :
                attachments.map(item => {
                  return (
                    <div className='attachments' key={item.id}>
                      <span className='file-title'>
                        <span className='attachment-icon'></span>
                        <span className='wording'>{item.name}</span>
                      </span>
                      <span className='download-button'>
                        <DownloadFile
                          fileName={item.name}
                          downloadUrl={item.url}
                        >
                          <Icon type='download' />
                        </DownloadFile>
                      </span>
                    </div>
                  )
                })
            }
          </div>
        </div>

      </div>
    )
  }
}


export default ActivityDetailContent
