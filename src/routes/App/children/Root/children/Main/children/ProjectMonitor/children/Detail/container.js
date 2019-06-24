import { connect } from 'react-redux'
import { getProjectDetail, getProjectList,getCustomerList} from 'store/modules/projectMonitor/index'
import Component from './component'

const mapDispatchToProps = {
  getProjectDetail,
  getProjectList,
  getCustomerList
}

const mapStateToProps = (state) => ({
  projectDetail: state.projectMonitor.projectDetail,
  projectList: state.projectMonitor.projectList,
  customerList: state.projectMonitor.customerList
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
