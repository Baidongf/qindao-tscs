import { connect } from 'react-redux'
import Component from './component.js'
import {
  getOpportunityList,
  getScheduleList,
  getDynamicRelatedScheduleList,
  getBusinessRelatedScheduleList,
  relateScheduleAndDynamic,
  relateScheduleAndBusiness,
  unRelateScheduleAndDynamic,
  unRelateScheduleAndBusiness,
} from 'store/modules/schedule'

const mapDispatchToProps = {
  getOpportunityList,
  getScheduleList,
  getDynamicRelatedScheduleList,
  getBusinessRelatedScheduleList,
  relateScheduleAndDynamic,
  relateScheduleAndBusiness,
  unRelateScheduleAndDynamic,
  unRelateScheduleAndBusiness,
}

const mapStateToProps = (state) => ({
  opportunityList: state.schedule.opportunityList,
  scheduleList: state.schedule.scheduleList,
  dynamicRelatedScheduleList: state.schedule.dynamicRelatedScheduleList,
  businessRelatedScheduleList: state.schedule.businessRelatedScheduleList,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
