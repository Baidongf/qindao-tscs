import { connect } from 'react-redux'
import Component from './component'
import {
  updateHomeModules,
  deliverHomeModules,
} from 'store/modules/home'

const mapStateToProps = (state) => ({
  homeModules: state.home.homeModules,
  userPermission: state.account.userPermission,
})

const mapDispatchToProps = {
  updateHomeModules,
  deliverHomeModules,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
