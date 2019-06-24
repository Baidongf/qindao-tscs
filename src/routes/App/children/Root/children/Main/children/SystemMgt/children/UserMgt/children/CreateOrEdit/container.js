import { connect } from 'react-redux'
import { getUserDetail, saveUser, updateUser } from 'store/modules/systemMgt/userMgt'
import { getOrgList, getOrgTree, } from 'store/modules/systemMgt/orgMgt'
import { getRoleList } from 'store/modules/systemMgt/roleMgt'
import Component from './component.js'

const mapDispatchToProps = {
  getUserDetail,
  updateUser,
  saveUser,
  getOrgList,
  getOrgTree,
  getRoleList,
}

const mapStateToProps = (state) => ({
  userDetail: state.userMgt.userDetail,
  orgList: state.orgMgt.orgList,
  orgTree: state.orgMgt.orgTree,
  roleList: state.roleMgt.roleList,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
