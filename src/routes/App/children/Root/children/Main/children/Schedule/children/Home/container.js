import { connect } from 'react-redux'
import { getScheduleList,getScheduleListByTime,deleteSchedule } from 'store/modules/schedule/index'
import Component from './component.js'

const mapDispatchToProps = {
  getScheduleList,
  getScheduleListByTime,
  deleteSchedule
}

const mapStateToProps = (state) => ({
 scheduleList:state.schedule.scheduleList
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
