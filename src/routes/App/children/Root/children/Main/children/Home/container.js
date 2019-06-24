import { connect } from 'react-redux'
import Component from './component'
import { getHomeModules, getRecentBrowse, } from 'store/modules/home/index'
import { getLoginUserInfo, selectRole, setRole } from 'store/modules/account/index'

const mapDispatchToProps = {
  getHomeModules,
  getRecentBrowse,
  selectRole,
  setRole,
  getLoginUserInfo,
}

const mapStateToProps = (state) =>({
  homeModules: state.home.homeModules,
  recentBrowseRecords: state.home.recentBrowseRecords,
  loginUserInfo: state.account.loginUserInfo,
  currentRole: state.account.currentRole,
  userPermission: state.account.userPermission,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
