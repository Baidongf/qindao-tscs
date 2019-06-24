import { connect } from 'react-redux'
import { getActivityDetail, saveActivity, getActivityNumber} from 'store/modules/marketingActivity/index'
import { getManagerTree } from 'store/modules/customerMgt/customerMgt/index'
import { getInstitutionManagers } from 'store/modules/opportunityMgt/index'
import Component from './component.js'

const mapDispatchToProps = {
  getActivityDetail,
  getActivityNumber,
  saveActivity,
  getManagerTree,
  getInstitutionManagers
}

const mapStateToProps = (state) => ({
  actDetail: state.marketingActivity.actDetail,
  actNumber: state.marketingActivity.actNumber,
  managerTree:state.customerMgt.managerTree,
  // institutionManagers:state
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
