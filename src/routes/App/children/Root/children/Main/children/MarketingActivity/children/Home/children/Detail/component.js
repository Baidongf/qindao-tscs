import React from 'react'
import './component.scss'
import queryString from 'query-string'
import HzBreadcrumb from 'components/HzBreadcrumb'
import ActDetailHeader from './children/DetailHeader'
import ActDetailContent from './children/DetailContent'

class ActDetail extends React.Component {
  constructor(props) {
    super(props)
    this.queryObj = queryString.parse(props.location.search)
    this.id = this.queryObj.id
    this.status = {
      0: '未开始',
      1: '执行中',
      2: '已结束'
    }
  }

  componentWillMount() {
    this.props.getActivityDetail(this.id)
  }

  componentWillReceiveProps({ actDetail }) {
    if (actDetail !== this.props.actDetail) {
      // 日期转化为时间戳格式
      ['startTime', 'endTime'].forEach(dateKey => {
        if (actDetail[dateKey]) {
          actDetail[dateKey] = actDetail[dateKey].split(" ")[0]
        }
      })
      actDetail.remindFlagWording = actDetail.remindFlag === true ? '是' : '否'
      actDetail.confirmedWording = actDetail.confirmed === true ? '已确认' : '未确认'
      actDetail.statusWording = this.status[actDetail.status]
    }
  }

  render() {
    const { actDetail } = this.props
    return (
      <div className='dynamic-detail-component'>
        <HzBreadcrumb />
        <div className='detail-content-container'>
          <ActDetailHeader
            title={actDetail.title}
            code={actDetail.code}
            confirmed={actDetail.confirmed}
            confirmedWording={actDetail.confirmedWording}
            userId={actDetail.userId}
            id={actDetail.id}
            type={actDetail.type}
            status={actDetail.status}
            statusWording={actDetail.statusWording}
            createTime={actDetail.createTime}
            finishActivity={this.props.finishActivity}
            suspendActivity={this.props.suspendActivity}
            confirmActivity={this.props.confirmActivity}
          />

          <ActDetailContent
            executorInstitutionName={actDetail.executorInstitutionName}
            endTime={actDetail.endTime}
            status={actDetail.statusWording}
            startTime={actDetail.startTime}
            remindFlag={actDetail.remindFlagWording}
            attachments={actDetail.attachments}
            replace={actDetail.replace}
            remindDay={actDetail.remindDay}
            households={actDetail.households}
            amount={actDetail.amount}
            description={actDetail.description}
          />
        </div>
      </div>
    )
  }
}


export default ActDetail
