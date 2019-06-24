import { connect } from 'react-redux'
import Component from './component'
import { getHomeModuleData } from 'store/modules/home/index'

const mapDispatchToProps = {
  getHomeModuleData,
}

const mapStateToProps = (state) =>({
  homeMarketingResults: state.home.homeMarketingResults,
  loginUserInfo: state.account.loginUserInfo,
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
