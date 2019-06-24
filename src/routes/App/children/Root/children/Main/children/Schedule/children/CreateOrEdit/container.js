import {connect} from 'react-redux'
import {
  getTitleParams,
  getCreateUser,
  saveSchedule,
  updateSchedule,
  getScheduleDetail,
} from 'store/modules/schedule'

import Component from './component.js'

const mapDispatchToProps = {
  getTitleParams,
  getCreateUser,
  saveSchedule,
  updateSchedule,
  getScheduleDetail,
}

const mapStateToProps = (state) => ({
  titleParams: state.schedule.titleParams,
  createUser: state.schedule.createUser,
  scheduleDetail: state.schedule.scheduleDetail,

})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
