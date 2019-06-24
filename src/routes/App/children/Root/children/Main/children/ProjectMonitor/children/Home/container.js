import { connect } from 'react-redux'
import { getProjectList, getProjectDetail,} from 'store/modules/projectMonitor/index'
import Component from './component.js'

const mapDispatchToProps = {
  getProjectList,
  getProjectDetail,
}

const mapStateToProps = (state) => ({
  projectList: state.projectMonitor.projectList,
  projectDetail: state.projectMonitor.projectDetail,

})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
