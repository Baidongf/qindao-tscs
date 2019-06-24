import { connect } from 'react-redux'
import Component from './component'
import { deliverRegisterCapital } from 'store/modules/customerMgt/customerMgt'

const mapStateToProps = (state) => ({
  registerCapital: state.customerMgt.registerCapital,
})

const mapDispatchToProps = {
  deliverRegisterCapital,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
