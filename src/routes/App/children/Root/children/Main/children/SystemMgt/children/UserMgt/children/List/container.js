import { connect } from 'react-redux'
import { getUserList, resetPassword, updateUser, updateUserStatus, getAllRoles } from 'store/modules/systemMgt/userMgt'
import { getOrgList } from 'store/modules/systemMgt/orgMgt'
import Component from './component.js'

const mapDispatchToProps = {
  getUserList,
  getAllRoles,
  getOrgList,
  updateUser,
  updateUserStatus,
  resetPassword
}

const mapStateToProps = (state) => ({
  userList: state.userMgt.userList,
  allRoles: state.userMgt.allRoles,
  orgList: state.orgMgt.orgList
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
