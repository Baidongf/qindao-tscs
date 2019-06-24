import React from 'react'
import './component.scss'
import {getQueryString} from 'utils/url'
import HzBreadcrumb from 'components/HzBreadcrumb'
import {dateFmt, isToday} from "utils/timeFormat";
import {Modal} from 'antd'

class Detail extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  editScheduleHandler = (item) => {
    this.props.history.push(`/root/main/schedule/createOrEdit?operation=edit&id=${item.id}`)
  }

  deleteScheduleHandler = (item, index) => {
    Modal.confirm({
      title: '删除日程',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.deleteSchedule([item.id], () => {
          this.props.history.goBack()
        })
      }
    })
  }


  componentWillMount() {
    let id = getQueryString(window.location.href, 'id')
    this.props.getScheduleDetail(id)
  }


  render() {
    let scheduleDetail = this.props.scheduleDetail
    let periodTypeMap = {
      month: '月',
      quarter: '季'
    }
    let opportunityStatusMap = ['新建', '沟通', '完成', '终止']

    return (
      <div className='schedule-detail'>
        <HzBreadcrumb/>
        <div className='content'>
          <div className='title'>{scheduleDetail.title}</div>
          <div className='time clearfix'>
            <div className='label'>{dateFmt(scheduleDetail.startTime, 'yyyy-MM-dd hh:mm')}</div>
            <div className='btn-group'>
              {scheduleDetail.canEdit && <div className='edit' onClick={() => {
                this.editScheduleHandler(scheduleDetail)
              }}>编辑</div>}
              {scheduleDetail.canEdit && <div className='delete' onClick={() => {
                this.deleteScheduleHandler(scheduleDetail)
              }}>删除</div>}
            </div>
          </div>
          <div className='content-content'>
            <div className='label'>日程内容</div>
            <div className='content-list'>
              <div className='item'>
                <div className='left'>日程名称</div>
                <div className='right'>{scheduleDetail.name}</div>
              </div>
              <div className='item'>
                <div className='left'>日程开始时间</div>
                <div className='right'>{dateFmt(scheduleDetail.startTime, 'yyyy-MM-dd hh:mm')}</div>
              </div>
              <div className='item'>
                <div className='left'>日程结束时间</div>
                <div className='right'>{dateFmt(scheduleDetail.endTime, 'yyyy-MM-dd hh:mm')}</div>
              </div>
              <div className='item'>
                <div className='left'>创建人</div>
                <div className='right'>{scheduleDetail.userName}</div>
              </div>
              <div className='item'>
                <div className='left'>知会人</div>
                <div className='right'>{scheduleDetail.notifyUserNames}</div>
              </div>
              <div className='item'>
                <div className='left'>重复周期</div>
                <div className='right'>
                  {/*{scheduleDetail.periodValue}/{periodTypeMap[scheduleDetail.periodType]}*/}
                  {periodTypeMap[scheduleDetail.periodType]}
                </div>
              </div>
              <div className='item'>
                <div className='left'>日程描述</div>
                <div className='right'>{scheduleDetail.description}</div>
              </div>
              <div className='item'>
                <div className='left'>提醒时间</div>
                <div className='right'>{dateFmt(scheduleDetail.remindTime, 'yyyy-MM-dd hh:mm')}</div>
              </div>
            </div>
          </div>
        </div>

        <div className='add-customer add-wrap'>
          <div className='title clearfix'>
            <div className='label'>关联客户</div>
          </div>
          <div className='content'>
            <div className='content-header'>
              <div>客户名称</div>
              <div>客户类型</div>
              <div>所属机构</div>
              <div>客户经理</div>
            </div>
            <div className='list'>
              {scheduleDetail.customers && scheduleDetail.customers.map(item => {
                return (
                  <div className='item'>
                    <div>{item.name}</div>
                    <div>{item.isInter == 0 ? '行内' : '行外'}</div>
                    <div>{item.dataOrgName}</div>
                    <div>{item.dataUserName}</div>
                  </div>
                )
              })}

            </div>
          </div>
        </div>

        <div className='add-opportunity add-wrap'>
          <div className='title clearfix'>
            <div className='label'>关联商机</div>
          </div>
          <div className='content'>
            <div className='content-header'>
              <div>商机名称</div>
              <div>客户名称</div>
              <div>客户类型</div>
              <div>商机状态</div>
              <div>跟进人</div>
            </div>
            <div className='list'>
              {scheduleDetail.business && scheduleDetail.business.map(item => {
                return (
                  <div className='item' key={item.id}>
                    <div>{item.name}</div>
                    <div>{item.customerName}</div>
                    <div>{item.customerType == 0 ? '行内' : '行外'}</div>
                    <div>{opportunityStatusMap[item.status]}</div>
                    <div>{item.followUserName}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default Detail
