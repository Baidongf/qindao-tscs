import { connect } from 'react-redux'
import { getProjectDetail,updateProject,addCustomer} from 'store/modules/projectMonitor/index'
import Component from './component.js'

const mapDispatchToProps = {
  getProjectDetail,
  updateProject,
  addCustomer
}

const mapStateToProps = (state) => ({
  projectDetail: state.projectMonitor.projectDetail,
  updateProject: state.projectMonitor.updateProject
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
