import { connect } from 'react-redux'
import { getLoginAllResourceInfo } from 'store/modules/account/index'
import Component from './component.js'

const mapDispatchToProps = {
  getLoginAllResourceInfo
}

const mapStateToProps = (state) => ({
  loginAllResourceInfo: state.account.loginAllResourceInfo.data,
  loginResourceInfo: state.account.loginResourceInfo,

})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
