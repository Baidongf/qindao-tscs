import { connect } from 'react-redux'
import { getRoleDetail, saveRole, updateRole, getPermissionTree } from 'store/modules/systemMgt/roleMgt'
import { getParamsConfig } from 'store/modules/systemMgt/paramsMgt'
import Component from './component.js'

const mapDispatchToProps = {
  getRoleDetail,
  saveRole,
  updateRole,
  getParamsConfig,
  getPermissionTree,
}

const mapStateToProps = (state) => ({
  roleDetail: state.roleMgt.roleDetail,
  permissionTree: state.roleMgt.permissionTree,
  paramsConfig: state.paramsMgt.paramsConfig
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
