import { connect } from 'react-redux'
import Component from './component'
import { getBusinessRelatedScheduleList } from 'store/modules/opportunityMgt/index'

const mapStateToProps = (state) => ({
  businessRelatedScheduleList: state.opportunityMgt.businessRelatedScheduleList
})

const mapDispatchToProps = {
  getBusinessRelatedScheduleList
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
