import { connect } from 'react-redux'
import Component from './component.js'
import {
  getScheduleList,
  getDynamicRelatedScheduleList,
  getBusinessRelatedScheduleList,
  relateScheduleAndDynamic,
  relateScheduleAndBusiness,
} from 'store/modules/schedule'

const mapStateToProps = (state) => ({
  scheduleList: state.schedule.scheduleList,
  dynamicRelatedScheduleList: state.schedule.dynamicRelatedScheduleList,
  businessRelatedScheduleList: state.schedule.businessRelatedScheduleList,
})

const mapDispatchToProps = {
  getScheduleList,
  getDynamicRelatedScheduleList,
  getBusinessRelatedScheduleList,
  relateScheduleAndDynamic,
  relateScheduleAndBusiness,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
