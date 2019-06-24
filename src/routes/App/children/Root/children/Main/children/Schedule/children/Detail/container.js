import {connect} from 'react-redux'
import {getScheduleDetail,deleteSchedule} from 'store/modules/schedule'
import Component from './component'

const mapDispatchToProps = {
  getScheduleDetail,
  deleteSchedule
}

const mapStateToProps = (state) => ({
  scheduleDetail: state.schedule.scheduleDetail
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
