import { connect } from 'react-redux'
import Component from './component'
import {
  getLoginUserInfo,
  selectRole,
  setRole,
} from 'store/modules/account/index'

const mapStateToProps = (state) => ({
  loginUserInfo: state.account.loginUserInfo,
})

const mapDispatchToProps = {
  getLoginUserInfo,
  selectRole,
  setRole,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
