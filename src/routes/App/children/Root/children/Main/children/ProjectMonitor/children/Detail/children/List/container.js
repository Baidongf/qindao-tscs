import { connect } from 'react-redux'
import { getProjectList, getProjectDetail,getCustomerList} from 'store/modules/projectMonitor/index'
import Component from './component.js'

const mapDispatchToProps = {
  getProjectList,
  getProjectDetail,
  getCustomerList
}

const mapStateToProps = (state) => ({
  projectList: state.projectMonitor.projectList,
  projectDetail: state.projectMonitor.projectDetail,
  customerList: state.projectMonitor.customerList
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
