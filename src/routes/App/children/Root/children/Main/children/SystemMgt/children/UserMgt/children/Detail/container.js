import { connect } from 'react-redux'
import { getUserDetail } from 'store/modules/systemMgt/userMgt'
import Component from './component.js'

const mapDispatchToProps = {
  getUserDetail
}

const mapStateToProps = (state) => ({
  userDetail: state.userMgt.userDetail
})

export default connect(mapStateToProps, mapDispatchToProps)(Component)
