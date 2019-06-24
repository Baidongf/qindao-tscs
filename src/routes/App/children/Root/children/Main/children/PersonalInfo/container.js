import { connect } from 'react-redux'
import Component from './component'
import {updatePassword} from 'store/modules/loginOut'
const mapDispatchToProps = {
  updatePassword
}

const mapStateToProps = (state) =>({
  loginUserInfo: state.account.loginUserInfo,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
