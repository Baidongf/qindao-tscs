import {connect} from 'react-redux'
import {
  getLoginUserInfo,
  getLoginRoleInfo,
  getLoginResourceInfo,
  getLoginUrl,
  selectRole,
  setRole,
  queryUserList,
  switchUser,
  getLoginAllResourceInfo,
  setPanelList,
  switchRole,
  getUserPermission,
  getMessageCount,
  getHeaderMessage,
  readAllMessages,
  emptyUnreadMessages,
  getBatchTime,
} from 'store/modules/account/index'
import { readMessage } from 'store/modules/messageMgt'

import { search } from 'store/modules/home/index'

import { logout } from 'store/modules/loginOut/index'

import Component from './component.js'

const mapDispatchToProps = {
  getLoginUserInfo,
  getLoginRoleInfo,
  getLoginResourceInfo,
  getLoginUrl,
  selectRole,
  setRole,
  queryUserList,
  switchUser,
  getLoginAllResourceInfo,
  setPanelList,
  switchRole,
  getUserPermission,
  getMessageCount,
  getHeaderMessage,
  readAllMessages,
  emptyUnreadMessages,
  logout,
  search,
  getBatchTime,
  readMessage,
}

const mapStateToProps = (state) => ({
  loginUserInfo: state.account.loginUserInfo,
  loginRoleInfo: state.account.loginRoleInfo,
  loginResourceInfo: state.account.loginResourceInfo,
  loginUrl: state.account.loginUrl,
  currentRole: state.account.currentRole,
  userList: state.account.userList,
  loginAllResourceInfo: state.account.loginAllResourceInfo,
  userPermission: state.account.userPermission,
  messageCount: state.account.messageCount,
  headerMessage: state.account.headerMessage,
  customerList: state.home.customerList,
  batchTime: state.account.batchTime,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
