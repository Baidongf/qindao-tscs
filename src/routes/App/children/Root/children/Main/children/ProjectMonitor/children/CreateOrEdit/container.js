import { connect } from 'react-redux'
import { getProjectDetail,saveProject,updateProject,getCreateUser,getCustomerList,addCustomer,getSequence} from 'store/modules/projectMonitor/index'
import Component from './component.js'

const mapDispatchToProps = {
  getProjectDetail,
  saveProject,
  updateProject,
  getCreateUser,
  getCustomerList,
  getSequence
}

const mapStateToProps = (state) => ({
  projectDetail: state.projectMonitor.projectDetail,
  saveProject: state.projectMonitor.projectDetail,
  updateProject: state.projectMonitor.projectDetail,
  createUser:state.projectMonitor.createUser,
  customerList:state.projectMonitor.customerList,
  userInfo:state.account.loginUserInfo
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
