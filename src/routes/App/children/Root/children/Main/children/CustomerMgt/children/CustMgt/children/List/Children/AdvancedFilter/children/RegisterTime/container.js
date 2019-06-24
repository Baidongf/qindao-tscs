import { connect } from 'react-redux'
import Component from './component'
import { deliverRegisterTime } from 'store/modules/customerMgt/customerMgt'

const mapStateToProps = (state) => ({
  registerTime: state.customerMgt.registerTime,
})

const mapDispatchToProps = {
  deliverRegisterTime,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
