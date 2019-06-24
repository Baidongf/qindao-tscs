import { connect } from 'react-redux'
import { getRoleList, updateRole, updateRoleStatus, deleteRole } from 'store/modules/systemMgt/roleMgt/index'
import Component from './component.js'

const mapDispatchToProps = {
  getRoleList,
  updateRole,
  updateRoleStatus,
  deleteRole,
}

const mapStateToProps = (state) => ({
  roleList: state.roleMgt.roleList
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
